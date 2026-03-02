import { z } from "zod";

export const leadCreateSchema = z.object({
  source: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().optional(),
  status: z.string().optional(),
  tags: z.string().optional(),
});

export const leadUpdateSchema = z.object({
  source: z.string().optional(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
  status: z.string().optional(),
  tags: z.string().optional(),
});

export const leadNoteSchema = z.object({
  leadId: z.string().min(1, "Lead ID is required"),
  content: z.string().min(1, "Content is required"),
});
