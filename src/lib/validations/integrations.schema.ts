import { z } from "zod";

export const integrationSchema = z.object({
  name: z.string().min(1).optional(),
  enabled: z.boolean().optional(),
  config: z.string().optional(),
  status: z.string().optional(),
});
