import { z } from "zod";
import { v, msg } from "./common";

export const roleSchema = z.object({
  name: v.reqStr("Role name", 50),
  description: z.string().max(255, msg.max("Description", 255)).optional().nullable(),
  permissionIds: z.array(z.string().min(1, msg.empty("Permission ID"))).optional().nullable(),
});