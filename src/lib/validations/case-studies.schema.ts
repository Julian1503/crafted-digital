import { z } from "zod";

export const caseStudyCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  body: z.string().min(1, "Body is required"),
  coverImage: z.string().nullable().optional(),
  gallery: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDesc: z.string().nullable().optional(),
  ogImage: z.string().nullable().optional(),
});

export const caseStudyUpdateSchema = z.object({
  title: z.string().min(1).nullable().optional(),
  slug: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  body: z.string().min(1).nullable().optional(),
  coverImage: z.string().nullable().optional(),
  gallery: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  featured: z.boolean().nullable().optional(),
  sortOrder: z.number().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDesc: z.string().nullable().optional(),
  ogImage: z.string().nullable().optional(),
});
