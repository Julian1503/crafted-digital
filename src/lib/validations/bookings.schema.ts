import { z } from "zod";
import { v, msg } from "./common";

export const bookingCreateSchema = z.object({
  customerName: v.reqStr("Customer name", 100),
  customerEmail: z.string().email(msg.email()),
  customerPhone: z.string().max(30, msg.max("Customer phone", 30)).optional().nullable(),
  date: v.date("Date"),
  duration: z.number().int(msg.int("Duration")).min(1, msg.gte("Duration", 1)).optional().nullable(),
  status: v.enum("Status", ["pending", "confirmed", "cancelled", "completed"]).default("pending"),
  notes: z.string().max(2000, msg.max("Notes", 2000)).optional().nullable(),
});

export const bookingUpdateSchema = z.object({
  customerName: v.optStr("Customer name", 100),
  customerEmail: z.string().email(msg.email()).optional().nullable(),
  customerPhone: z.string().max(30, msg.max("Customer phone", 30)).optional().nullable(),
  date: v.date("Date").optional().nullable(),
  duration: z.number().int(msg.int("Duration")).min(1, msg.gte("Duration", 1)).optional().nullable(),
  status: v.enum("Status", ["pending", "confirmed", "cancelled", "completed"]).optional().nullable(),
  notes: z.string().max(2000, msg.max("Notes", 2000)).optional().nullable(),
  deleted: z.boolean().optional().nullable(),
});

export const bookingNoteSchema = z.object({
  bookingId: v.reqStr("Booking ID"),
  content: v.reqStr("Content", 2000),
});