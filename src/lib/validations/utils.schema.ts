import { z } from "zod";
import { v, msg } from "./common";

export const reorderSchema = z
    .array(
        z.object({
            id: v.reqStr("id"),
            sortOrder: v.floatMin("sortOrder", 0.0),
        })
    )
    .min(1, "Reorder payload must contain at least 1 item");

export const paginationSchema = z.object({
  page: z.coerce.number().int(msg.int("page")).min(1, msg.gte("page", 1)).default(1),
  limit: z.coerce
    .number()
    .int(msg.int("limit"))
    .min(1, msg.gte("limit", 1))
    .max(100, "limit must be 100 or less")
    .default(20),
  search: z.string().max(200, msg.max("search", 200)).optional().nullable(),
  sortBy: z.string().max(50, msg.max("sortBy", 50)).optional().nullable(),
  sortDir: v.enum("sortDir", ["asc", "desc"] as ["asc", "desc"]).default("asc"),
});