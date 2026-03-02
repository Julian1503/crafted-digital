import { z } from "zod";

export const bookingCreateSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().optional(),
  date: z.coerce.date(),
  duration: z.number().int().positive().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

export const bookingUpdateSchema = z.object({
  customerName: z.string().min(1).optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  date: z.coerce.date().optional(),
  duration: z.number().int().positive().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

export const bookingNoteSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  content: z.string().min(1, "Content is required"),
});
