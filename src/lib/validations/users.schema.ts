import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  image: z.string().url().optional(),
  active: z.boolean().optional().default(true),
  roleIds: z.array(z.string()).optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  image: z.string().optional(),
  active: z.boolean().optional(),
  roleIds: z.array(z.string()).optional(),
});
