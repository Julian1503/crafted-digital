import { z } from "zod";

export const siteSettingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  group: z.string().optional().default("general"),
});
