import { z } from "zod";
import { v, msg } from "./common";

export const siteSettingSchema = z.object({
  key: v.reqStr("Key", 100),
  value: z.string().min(1, msg.required("Value")).max(5000, msg.max("Value", 5000)),
  group: z.string().min(1, msg.required("Group")).max(50, msg.max("Group", 50)).default("general"),
});