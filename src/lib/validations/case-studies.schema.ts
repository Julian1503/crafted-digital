import { z } from "zod";
import { v, msg, slugRegex, slugMessage } from "./common";

export const caseStudyCreateSchema = z.object({
  title: v.reqStr("Title", 200),
  slug: z
    .string()
    .min(1, msg.empty("Slug"))
    .max(200, msg.max("Slug", 200))
    .regex(slugRegex, slugMessage)
    .optional().nullable(),
  summary: z.string().max(500, msg.max("Summary", 500)).optional().nullable(),
  body: v.reqStr("Body"),
  coverImage: v.optUrlOrEmpty("Cover image").nullable(),
  gallery: z.string().optional().nullable(),
  status: v.enum("Status", ["draft", "published", "scheduled"]).default("draft"),
  publishedAt: v.date("publishedAt").optional().nullable(),
  featured: z.boolean().default(false),
  sortOrder: v.intMin("sortOrder", 0).default(0),
  metaTitle: z.string().max(70, msg.max("Meta title", 70)).optional().nullable(),
  metaDesc: z.string().max(160, msg.max("Meta description", 160)).optional().nullable(),
  ogImage: v.optUrlOrEmpty("OG image").optional().nullable(),
});

export const caseStudyUpdateSchema = z.object({
  title: v.optStr("Title", 200),
  slug: z
    .string()
    .min(1, msg.empty("Slug"))
    .max(200, msg.max("Slug", 200))
    .regex(slugRegex, slugMessage)
    .optional().nullable(),
  summary: z.string().max(500, msg.max("Summary", 500)).optional().nullable(),
  body: z.string().min(1, msg.empty("Body")).optional().nullable(),
  coverImage: v.optUrlOrEmpty("Cover image"),
  gallery: z.string().optional().nullable(),
  status: v.enum("Status", ["draft", "published", "scheduled"]).optional().nullable(),
  publishedAt: v.date("publishedAt").optional().nullable(),
  featured: z.boolean().optional().nullable(),
  sortOrder: v.intMin("sortOrder", 0).optional().nullable(),
  metaTitle: z.string().max(70, msg.max("Meta title", 70)).optional().nullable(),
  metaDesc: z.string().max(160, msg.max("Meta description", 160)).optional().nullable(),
  ogImage: v.optUrlOrEmpty("OG image").optional().nullable(),
  deleted: z.boolean().optional().nullable(),
});