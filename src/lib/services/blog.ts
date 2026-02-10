import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";

interface BlogPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  status?: string;
  tags?: string;
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
  const { page = 1, limit = 20, search, sortBy = "createdAt", sortDir = "desc", status, tags, dateFrom, dateTo } = params;
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
      orderBy: { [sortBy]: sortDir },
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
    slug?: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    status?: string;
    publishedAt?: Date;
    sortOrder?: number;
    tags?: string;
    categories?: string;
    metaTitle?: string;
    metaDesc?: string;
    ogImage?: string;
  },
  actorId?: string
) {
  const slug = await ensureUniqueSlug(data.slug || generateSlug(data.title));

  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage || null,
      status: data.status ?? "draft",
      publishedAt: data.publishedAt,
      sortOrder: data.sortOrder ?? 0,
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
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    status?: string;
    publishedAt?: Date | null;
    sortOrder?: number;
    tags?: string;
    categories?: string;
    metaTitle?: string;
    metaDesc?: string;
    ogImage?: string;
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
  const post = await prisma.blogPost.update({
    where: { id },
    data: { deleted: true },
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
  await logAudit({ actorId, action: "reorder", entity: "BlogPost", metadata: { count: items.length } });
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
