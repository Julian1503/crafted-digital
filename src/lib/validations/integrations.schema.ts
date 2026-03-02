import { z } from "zod";
import { v } from "./common";

export const integrationSchema = z.object({
  name: z.string().min(1, "Integration name is required").max(100),
  enabled: z.boolean().default(false),
  config: z.string().optional().nullable(),
  status: v.enum("Status", ["connected", "disconnected", "error"]).default("disconnected"),
});