import { z } from "zod";

export const planCreateSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  price: z.number().min(0).optional().default(0),
  currency: z.string().optional().default("AUD"),
  interval: z.string().optional().default("one-time"),
  features: z.string().optional(),
  sortOrder: z.number().optional(),
  active: z.boolean().optional().default(true),
  highlighted: z.boolean().optional().default(false),
});

export const planUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  currency: z.string().optional(),
  interval: z.string().optional(),
  features: z.string().optional(),
  sortOrder: z.number().optional(),
  active: z.boolean().optional(),
  highlighted: z.boolean().optional(),
});
