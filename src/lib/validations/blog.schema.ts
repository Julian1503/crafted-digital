import { z } from "zod";
import { v, msg, slugRegex, slugMessage } from "./common";

export const blogPostCreateSchema = z.object({
  title: v.reqStr("Title", 200),
  slug: z
    .string()
    .min(1, msg.empty("Slug"))
    .max(200, msg.max("Slug", 200))
    .regex(slugRegex, slugMessage)
    .optional().nullable(),
  excerpt: z.string().max(500, msg.max("Excerpt", 500)).optional().nullable(),
  content: v.reqStr("Content"),
  coverImage: v.optUrlOrEmpty("Cover image").optional().nullable(),
  status: v.enum("Status", ["draft", "published", "scheduled"]).default("draft"),
  publishedAt: v.date("publishedAt").optional().nullable(),
  sortOrder: v.intMin("sortOrder", 0).default(0),
  tags: z.string().max(500, msg.max("Tags", 500)).optional().nullable(),
  categories: z.string().max(500, msg.max("Categories", 500)).optional().nullable(),
  metaTitle: z.string().max(70, msg.max("Meta title", 70)).optional().nullable(),
  metaDesc: z.string().max(160, msg.max("Meta description", 160)).optional().nullable(),
  ogImage: v.optUrlOrEmpty("OG image").optional().nullable(),
});

export const blogPostUpdateSchema = z.object({
  title: v.optStr("Title", 200),
  slug: z
    .string()
    .min(1, msg.empty("Slug"))
    .max(200, msg.max("Slug", 200))
    .regex(slugRegex, slugMessage)
    .optional().nullable(),
  excerpt: z.string().max(500, msg.max("Excerpt", 500)).optional().nullable(),
  content: z.string().min(1, msg.empty("Content")).optional().nullable(),
  coverImage: v.optUrlOrEmpty("Cover image").optional().nullable(),
  status: v.enum("Status", ["draft", "published", "scheduled"]).optional().nullable(),
  publishedAt: v.date("publishedAt").optional().nullable(),
  sortOrder: v.intMin("sortOrder", 0).optional().nullable(),
  tags: z.string().max(500, msg.max("Tags", 500)).optional().nullable(),
  categories: z.string().max(500, msg.max("Categories", 500)).optional().nullable(),
  metaTitle: z.string().max(70, msg.max("Meta title", 70)).optional().nullable(),
  metaDesc: z.string().max(160, msg.max("Meta description", 160)).optional().nullable(),
  ogImage: v.optUrlOrEmpty("OG image").optional().nullable(),
  deleted: z.boolean().optional().nullable(),
});