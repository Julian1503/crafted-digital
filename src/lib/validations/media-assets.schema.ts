import { z } from "zod";

export const mediaAssetSchema = z.object({
  url: z.string().url("Invalid URL"),
  filename: z.string().min(1, "Filename is required"),
  mimeType: z.string().min(1, "MIME type is required"),
  size: z.number().int().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  alt: z.string().optional(),
  title: z.string().optional(),
  tags: z.string().optional(),
  folder: z.string().optional(),
  provider: z.string().optional(),
  providerFileId: z.string().optional(),
  providerPath: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
});
