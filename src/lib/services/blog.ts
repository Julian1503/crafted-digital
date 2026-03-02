import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";

interface BlogPaginationParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sortBy?: string | null;
  sortDir?: "asc" | "desc";
  status?: string | null;
  tags?: string | null;
  dateFrom?: Date;
  dateTo?: Date;
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
    const existing = await prisma.blogPost.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    counter++;
    candidate = `${slug}-${counter}`;
  }
}

export async function getBlogPosts(params: BlogPaginationParams = {}) {
  const { page = 1, limit = 20, search, sortBy = "sortOrder", sortDir = "desc", status, tags, dateFrom, dateTo } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { deleted: false };
  if (status) where.status = status;
  if (tags) where.tags = { contains: tags };
  if (search) where.title = { contains: search };
  if (dateFrom || dateTo) {
    where.createdAt = {
      ...(dateFrom && { gte: dateFrom }),
      ...(dateTo && { lte: dateTo }),
    };
  }

  const [data, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy as string]: sortDir },
      include: { author: { select: { id: true, name: true, email: true } } },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getBlogPost(id: string) {
  return prisma.blogPost.findUniqueOrThrow({
    where: { id },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUniqueOrThrow({
    where: { slug },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
}

export async function getPublishedBlogPosts() {
  return prisma.blogPost.findMany({
    where: { status: "published", deleted: false },
    orderBy: { sortOrder: "asc" },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
}

export async function createBlogPost(
  data: {
    title: string;
    slug?: string | null;
    excerpt?: string | null;
    content: string;
    coverImage?: string | null;
    status?: string | null;
    publishedAt?: Date;
    sortOrder?: number;
    tags?: string | null;
    categories?: string | null;
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

  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage || null,
      status: data.status ?? "draft",
      publishedAt: data.publishedAt,
      sortOrder: nextSortOrder,
      tags: data.tags,
      categories: data.categories,
      metaTitle: data.metaTitle,
      metaDesc: data.metaDesc,
      ogImage: data.ogImage || null,
      authorId: actorId,
    },
    include: { author: { select: { id: true, name: true, email: true } } },
  });

  await logAudit({ actorId, action: "create", entity: "BlogPost", entityId: post.id });
  return post;
}

export async function updateBlogPost(
  id: string,
  data: {
    title?: string | null;
    slug?: string | null;
    excerpt?: string | null;
    content?: string | null;
    coverImage?: string | null;
    status?: string | null;
    publishedAt?: Date | null;
    sortOrder?: number;
    tags?: string | null;
    categories?: string | null;
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

  const post = await prisma.blogPost.update({
    where: { id },
    data: updateData,
    include: { author: { select: { id: true, name: true, email: true } } },
  });

  await logAudit({ actorId, action: "update", entity: "BlogPost", entityId: id });
  return post;
}

export async function deleteBlogPost(id: string, actorId?: string) {
  const target = await prisma.blogPost.findUniqueOrThrow({
    where: { id },
    select: { sortOrder: true },
  });
  const post = await prisma.blogPost.update({
    where: { id },
    data: { deleted: true },
  });
  await prisma.blogPost.updateMany({
    where: {
      deleted: false,
      sortOrder: { gt: target.sortOrder },
    },
    data: { sortOrder: { decrement: 1 } },
  });
  await logAudit({ actorId, action: "delete", entity: "BlogPost", entityId: id });
  return post;
}

export async function reorderBlogPosts(items: { id: string; sortOrder: number }[], actorId?: string) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.blogPost.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
    )
  );
  await renormalizeIfNeeded(actorId);
  await logAudit({ actorId, action: "reorder", entity: "BlogPost", metadata: { count: items.length } });
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

export async function bulkUpdateStatus(ids: string[], status: string, actorId?: string) {
  await prisma.blogPost.updateMany({
    where: { id: { in: ids } },
    data: { status },
  });
  await logAudit({
    actorId,
    action: "bulk_status",
    entity: "BlogPost",
    metadata: { ids, status },
  });
}
