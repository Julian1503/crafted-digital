import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortDir: z.enum(["asc", "desc"]).optional().default("desc"),
  status: z.string().optional(),
  tags: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  active: z
    .union([z.boolean(), z.string().transform((v) => v === "true")])
    .optional(),
  folder: z.string().optional(),
  mimeType: z.string().optional(),
  entity: z.string().optional(),
  action: z.string().optional(),
  actorId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  featured: z
    .union([z.boolean(), z.string().transform((v) => v === "true")])
    .optional(),
});

export const reorderSchema = z.array(
  z.object({
    id: z.string().min(1),
    sortOrder: z.number(),
  }),
);
