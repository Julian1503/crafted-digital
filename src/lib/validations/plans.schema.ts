import { z } from "zod";
import { v, msg } from "./common";

export const planCreateSchema = z.object({
  name: v.reqStr("Plan name", 100),
  description: z.string().max(500, msg.max("Description", 500)).optional().nullable(),
  price: z.number().min(0, "Price must be non-negative").default(0),
  currency: z.string().length(3, "Currency must be a 3-letter code").default("AUD"),
  interval: v.enum("Interval", ["one-time", "monthly", "yearly"]).default("one-time"),
  features: z.string().optional().nullable(),
  sortOrder: v.intMin("sortOrder", 0).default(0),
  active: z.boolean().default(true),
  highlighted: z.boolean().default(false),
});

export const planUpdateSchema = z.object({
  name: v.optStr("Plan name", 100),
  description: z.string().max(500, msg.max("Description", 500)).optional().nullable(),
  price: z.number().min(0, "Price must be non-negative").optional().nullable(),
  currency: z.string().length(3, "Currency must be a 3-letter code").optional().nullable(),
  interval: v.enum("Interval", ["one-time", "monthly", "yearly"]).optional().nullable(),
  features: z.string().optional().nullable(),
  sortOrder: v.intMin("sortOrder", 0).optional().nullable(),
  active: z.boolean().optional().nullable(),
  highlighted: z.boolean().optional().nullable(),
});