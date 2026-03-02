import { z } from "zod";
import { v, msg } from "./common";

export const contentBlockSchema = z.object({
  section: v.reqStr("Section", 100),
  title: z.string().max(200, msg.max("Title", 200)).optional().nullable(),
  content: z.string().optional().nullable(),
  sortOrder: v.intMin("sortOrder", 0).default(0),
  active: z.boolean().default(true),
});