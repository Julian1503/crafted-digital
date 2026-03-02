import { z } from "zod";

export const couponCreateSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  type: z.string().optional().default("percent"),
  amount: z.number().min(0, "Amount must be non-negative"),
  maxRedemptions: z.number().int().positive().optional(),
  expiresAt: z.coerce.date().optional(),
  active: z.boolean().optional().default(true),
});

export const couponUpdateSchema = z.object({
  code: z.string().min(1).optional(),
  type: z.string().optional(),
  amount: z.number().min(0).optional(),
  maxRedemptions: z.number().int().positive().nullable().optional(),
  expiresAt: z.coerce.date().nullable().optional(),
  active: z.boolean().optional(),
});
