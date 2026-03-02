import { z } from "zod";
import { v, msg } from "./common";

export const mediaAssetSchema = z.object({
  url: z.string().url("Invalid URL"),
  filename: v.reqStr("Filename", 255),
  mimeType: v.reqStr("MIME type", 100),
  size: v.intMin("size", 0).default(0),
  width: v.intMin("width", 0).optional().nullable(),
  height: v.intMin("height", 0).optional().nullable(),
  alt: z.string().max(255, msg.max("Alt", 255)).optional().nullable(),
  title: z.string().max(255, msg.max("Title", 255)).optional().nullable(),
  tags: z.string().max(500, msg.max("Tags", 500)).optional().nullable(),
  folder: z
    .string()
    .min(1, msg.required("Folder"))
    .max(100, msg.max("Folder", 100))
    .default("crafed_digital"),
  provider: z
    .string()
    .min(1, msg.required("Provider"))
    .max(50, msg.max("Provider", 50))
    .default("cloudinary"),
  providerFileId: z.string().max(255, msg.max("Provider file ID", 255)).optional().nullable(),
  providerPath: z.string().max(255, msg.max("Provider path", 255)).optional().nullable(),
  thumbnailUrl: z.string().url(msg.url("Thumbnail URL")).optional().nullable(),
});