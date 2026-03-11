import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";
import { generateSlug, ensureUniqueSlug } from "@/lib/utils/slug";
import { SORT_ORDER_GAP, SORT_ORDER_MIN_GAP, ContentStatus } from "@/lib/types/enums";

interface CaseStudyPaginationParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sortBy?: string | null;
  sortDir?: "asc" | "desc";
  status?: string | null;
  featured?: boolean;
}

export async function getCaseStudies(params: CaseStudyPaginationParams = {}) {
  const { page = 1, limit = 20, search, sortBy = "sortOrder", sortDir = "asc", status, featured } = params;
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
        where:   { status: ContentStatus.PUBLISHED, deleted: false },
        orderBy: { sortOrder: "asc" },
        include: {
            author:                { select: { id: true, name: true, email: true } },
            customer:              true,
            caseStudyIndustries:   { include: { industry: true } },
            caseStudyTools:        { include: { tool: true } },
            caseStudyTechnologies: { include: { technology: true } },
        },
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
  const slug = await ensureUniqueSlug(
    data.slug || generateSlug(data.title),
    "caseStudy"
  );

  const aggregate = await prisma.caseStudy.aggregate({
    _max: { sortOrder: true },
    where: { deleted: false },
  });
  const nextSortOrder = (aggregate._max.sortOrder ?? 0) + SORT_ORDER_GAP;

  const caseStudy = await prisma.caseStudy.create({
    data: {
      title: data.title,
      slug,
      summary: data.summary,
      body: data.body,
      coverImage: data.coverImage || null,
      gallery: data.gallery,
      status: data.status ?? ContentStatus.DRAFT,
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
    updateData.slug = await ensureUniqueSlug(data.slug, "caseStudy", id);
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
  const caseStudy = await prisma.caseStudy.update({
    where: { id },
    data: { deleted: true },
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

  const minGap = items.reduce((min, item, i) => {
    if (i === 0) return min;
    return Math.min(min, item.sortOrder - items[i - 1].sortOrder);
  }, Infinity);

  if (minGap >= SORT_ORDER_MIN_GAP) return;

  await prisma.$transaction(
      items.map((item, i) =>
          prisma.caseStudy.update({
            where: { id: item.id },
            data: { sortOrder: (i + 1) * SORT_ORDER_GAP },
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