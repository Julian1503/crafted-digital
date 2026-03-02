import { z } from "zod";

export const contentBlockSchema = z.object({
  section: z.string().min(1, "Section is required"),
  title: z.string().optional(),
  content: z.string().optional(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});
