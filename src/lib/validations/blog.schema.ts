import { z } from "zod";

export const blogPostCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().nullable().optional(),
  excerpt: z.string().nullable().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  publishedAt: z.coerce.date().optional(),
  sortOrder: z.number().int().optional(),
  tags: z.string().nullable().optional(),
  categories: z.string().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDesc: z.string().nullable().optional(),
  ogImage: z.string().nullable().optional(),
});

export const blogPostUpdateSchema = z.object({
  title: z.string().min(1).nullable().optional(),
  slug: z.string().nullable().optional(),
  excerpt: z.string().nullable().optional(),
  content: z.string().min(1).nullable().optional(),
  coverImage: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  sortOrder: z.number().int().optional(),
  tags: z.string().nullable().optional(),
  categories: z.string().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDesc: z.string().nullable().optional(),
  ogImage: z.string().nullable().optional(),
});
