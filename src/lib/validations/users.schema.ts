import { z } from "zod";
import { v, msg } from "./common";

export const userCreateSchema = z.object({
  name: v.reqStr("Name", 100),
  email: z.string().email(msg.email()),
  password: z.string().min(8, msg.min("Password", 8)).max(128, msg.max("Password", 128)),
  image: v.optUrlOrEmpty("Image"),
  active: z.boolean().default(true),
  roleIds: z.array(z.string().min(1, msg.empty("Role ID"))).optional().nullable(),
});

export const userUpdateSchema = z.object({
  name: v.optStr("Name", 100),
  email: z.string().email(msg.email()).optional().nullable(),
  password: z.string().min(8, msg.min("Password", 8)).max(128, msg.max("Password", 128)).optional().nullable(),
  image: v.optUrlOrEmpty("Image"),
  active: z.boolean().optional().nullable(),
  roleIds: z.array(z.string().min(1, msg.empty("Role ID"))).optional().nullable(),
});