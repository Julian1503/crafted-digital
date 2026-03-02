import { z } from "zod";
import { v, msg } from "./common";

export const leadCreateSchema = z.object({
  source: z.string().min(1, msg.required("Source")).max(50, msg.max("Source", 50)).default("website"),
  name: v.reqStr("Name", 100),
  email: z.string().email(msg.email()),
  phone: z.string().max(30, msg.max("Phone", 30)).optional().nullable(),
  message: z.string().max(2000, msg.max("Message", 2000)).optional().nullable(),
  status: v.enum("Status", ["new", "contacted", "qualified", "lost", "won"]).default("new"),
  tags: z.string().max(500, msg.max("Tags", 500)).optional().nullable(),
});

export const leadUpdateSchema = z.object({
  source: z.string().min(1, msg.empty("Source")).max(50, msg.max("Source", 50)).optional().nullable(),
  name: v.optStr("Name", 100),
  email: z.string().email(msg.email()).optional().nullable(),
  phone: z.string().max(30, msg.max("Phone", 30)).optional().nullable(),
  message: z.string().max(2000, msg.max("Message", 2000)).optional().nullable(),
  status: v.enum("Status", ["new", "contacted", "qualified", "lost", "won"]).optional().nullable(),
  tags: z.string().max(500, msg.max("Tags", 500)).optional().nullable(),
  deleted: z.boolean().optional().nullable(),
});

export const leadNoteSchema = z.object({
  leadId: v.reqStr("Lead ID"),
  content: v.reqStr("Content", 2000),
});