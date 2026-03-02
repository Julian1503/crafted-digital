import { z } from "zod";
import { v } from "./common";

export const couponCreateSchema = z
  .object({
    code: z
      .string()
      .min(1, "Coupon code is required")
      .max(50, "Coupon code must be 50 characters or less")
      .regex(/^[A-Z0-9_-]+$/, "Code must be uppercase alphanumeric with hyphens/underscores"),
    type: v.enum("Type", ["percent", "fixed"]).default("percent"),
    amount: z.number().min(0, "Amount must be non-negative"),
    maxRedemptions: z
      .number()
      .int("maxRedemptions must be an integer")
      .min(1, "maxRedemptions must be at least 1")
      .optional().nullable(),
    expiresAt: z.coerce.date().optional().nullable(),
    active: z.boolean().default(true),
  })
  .refine((data) => !(data.type === "percent" && data.amount > 100), {
    message: "Percentage discount cannot exceed 100",
    path: ["amount"],
  });

export const couponUpdateSchema = z.object({
  code: z
    .string()
    .min(1, "Coupon code cannot be empty")
    .max(50, "Coupon code must be 50 characters or less")
    .regex(/^[A-Z0-9_-]+$/, "Code must be uppercase alphanumeric with hyphens/underscores")
    .optional().nullable(),
  type: v.enum("Type", ["percent", "fixed"]).optional().nullable(),
  amount: z.number().min(0, "Amount must be non-negative").optional().nullable(),
  maxRedemptions: z
    .number()
    .int("maxRedemptions must be an integer")
    .min(1, "maxRedemptions must be at least 1")
    .optional()
    .nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  active: z.boolean().optional().nullable(),
});