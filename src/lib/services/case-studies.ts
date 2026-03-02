import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";

interface CaseStudyPaginationParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sortBy?: string | null;
  sortDir?: "asc" | "desc";
  status?: string | null;
  featured?: boolean;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  let candidate = slug;
  let counter = 1;
  while (true) {
    const existing = await prisma.caseStudy.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    counter++;
    candidate = `${slug}-${counter}`;
  }
}

export async function getCaseStudies(params: CaseStudyPaginationParams = {}) {
  const { page = 1, limit = 20, search, sortBy = "sortOrder", sortDir = "desc", status, featured } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { deleted: false };
  if (status) where.status = status;
  if (typeof featured === "boolean") where.featured = featured;
  if (search) where.title = { contains: search };

  const [data, total] = await Promise.all([
    prisma.caseStudy.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy as string]: sortDir },
      include: { author: { select: { id: true, name: true, email: true } } },
    }),
    prisma.caseStudy.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getCaseStudy(id: string) {
  return prisma.caseStudy.findUniqueOrThrow({
    where: { id },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
}

export async function getCaseStudyBySlug(slug: string) {
  return prisma.caseStudy.findUniqueOrThrow({
    where: { slug },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
}

export async function getPublishedCaseStudies() {
  return prisma.caseStudy.findMany({
    where: { status: "published", deleted: false },
    orderBy: { sortOrder: "asc" },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
}

export async function createCaseStudy(
  data: {
    title: string;
    slug?: string | null;
    summary?: string | null;
    body: string;
    coverImage?: string | null;
    gallery?: string | null;
    status?: string | null;
    publishedAt?: Date | null;
    featured?: boolean;
    sortOrder?: number;
    metaTitle?: string | null;
    metaDesc?: string | null;
    ogImage?: string | null;
  },
  actorId?: string
) {
  const slug = await ensureUniqueSlug(data.slug || generateSlug(data.title));

  const sortOrder = await prisma.caseStudy.aggregate({
    _max: { sortOrder: true },
    where: { deleted: false }
  })
  const SORT_GAP = 1000;
  const nextSortOrder = (sortOrder._max.sortOrder ?? 0) + SORT_GAP;

  const caseStudy = await prisma.caseStudy.create({
    data: {
      title: data.title,
      slug,
      summary: data.summary,
      body: data.body,
      coverImage: data.coverImage || null,
      gallery: data.gallery,
      status: data.status ?? "draft",
      publishedAt: data.publishedAt,
      featured: data.featured ?? false,
      sortOrder: nextSortOrder,
      metaTitle: data.metaTitle,
      metaDesc: data.metaDesc,
      ogImage: data.ogImage || null,
      authorId: actorId,
    },
    include: { author: { select: { id: true, name: true, email: true } } },
  });

  await logAudit({ actorId, action: "create", entity: "CaseStudy", entityId: caseStudy.id });
  return caseStudy;
}

export async function updateCaseStudy(
  id: string,
  data: {
    title?: string | null;
    slug?: string | null;
    summary?: string | null;
    body?: string | null;
    coverImage?: string | null;
    gallery?: string | null;
    status?: string | null;
    publishedAt?: Date | null;
    featured?: boolean | null;
    sortOrder?: number | null;
    metaTitle?: string | null;
    metaDesc?: string | null;
    ogImage?: string | null;
  },
  actorId?: string
) {
  const updateData: Record<string, unknown> = { ...data };
  if (data.slug) {
    updateData.slug = await ensureUniqueSlug(data.slug, id);
  }
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage || null;
  if (data.ogImage !== undefined) updateData.ogImage = data.ogImage || null;

  const caseStudy = await prisma.caseStudy.update({
    where: { id },
    data: updateData,
    include: { author: { select: { id: true, name: true, email: true } } },
  });

  await logAudit({ actorId, action: "update", entity: "CaseStudy", entityId: id });
  return caseStudy;
}

export async function deleteCaseStudy(id: string, actorId?: string) {
  const target = await prisma.caseStudy.findUniqueOrThrow({
    where: { id },
    select: { sortOrder: true },
  });

  const caseStudy = await prisma.caseStudy.update({
    where: { id },
    data: { deleted: true },
  });

  await prisma.caseStudy.updateMany({
    where: {
      deleted: false,
      sortOrder: { gt: target.sortOrder },
    },
    data: { sortOrder: { decrement: 1 } },
  });

  await logAudit({ actorId, action: "delete", entity: "CaseStudy", entityId: id });
  return caseStudy;
}

export async function reorderCaseStudies(items: { id: string; sortOrder: number }[], actorId?: string) {
  await prisma.$transaction(
    items.map((item) =>
        prisma.caseStudy.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
    )
  );
  await renormalizeIfNeeded(actorId);
  await logAudit({ actorId, action: "reorder", entity: "CaseStudy", metadata: { count: items.length } });
}

/** Renormalizes all sortOrders to multiples of 1000 when gaps get too small */
async function renormalizeIfNeeded(actorId?: string) {
  const items = await prisma.caseStudy.findMany({
    where: { deleted: false },
    orderBy: { sortOrder: "asc" },
    select: { id: true, sortOrder: true },
  });

  // Check minimum gap
  const minGap = items.reduce((min, item, i) => {
    if (i === 0) return min;
    return Math.min(min, item.sortOrder - items[i - 1].sortOrder);
  }, Infinity);

  if (minGap >= 1) return; // Gaps still healthy, skip

  await prisma.$transaction(
      items.map((item, i) =>
          prisma.caseStudy.update({
            where: { id: item.id },
            data: { sortOrder: (i + 1) * 1000 },
          })
      )
  );
  await logAudit({ actorId, action: "renormalize", entity: "CaseStudy", metadata: { count: items.length } });
}

export async function toggleFeatured(id: string, actorId?: string) {
  const existing = await prisma.caseStudy.findUniqueOrThrow({ where: { id } });
  const caseStudy = await prisma.caseStudy.update({
    where: { id },
    data: { featured: !existing.featured },
  });
  await logAudit({
    actorId,
    action: "toggle_featured",
    entity: "CaseStudy",
    entityId: id,
    metadata: { featured: caseStudy.featured },
  });
  return caseStudy;
}