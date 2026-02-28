import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";
import {MediaProvider} from "@/generated/prisma/enums";
import { normalizeFolder } from "@/lib/media/normalize-folders";

interface MediaPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  folder?: string;
  mimeType?: string;
}

export async function getMediaAssets(params: MediaPaginationParams = {}) {
  const { page = 1, limit = 20, search, sortBy = "createdAt", sortDir = "desc", folder, mimeType } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { deleted: false };
  if (folder) where.folder = folder;
  if (mimeType) where.mimeType = { contains: mimeType };
  if (search) {
    where.OR = [
      { filename: { contains: search } },
      { alt: { contains: search } },
      { title: { contains: search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.mediaAsset.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortDir },
    }),
    prisma.mediaAsset.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getMediaAsset(id: string) {
  return prisma.mediaAsset.findUniqueOrThrow({ where: { id } });
}

export async function createMediaAsset(
    data: {
      url: string;
      filename: string;
      mimeType: string;
      size?: number;
      width?: number;
      height?: number;
      alt?: string;
      title?: string;
      tags?: string;
      folder?: string;
      provider?: string;
      providerFileId?: string;
      providerPath?: string;
      thumbnailUrl?: string;
    },
    actorId?: string
) {
  const folder = normalizeFolder(data.folder) || "general";
  const provider = (data.provider ?? "cloudinary") as MediaProvider;

  let createdBy: string | undefined = undefined;
  if (actorId) {
    const exists = await prisma.user.findUnique({
      where: { id: actorId },
      select: { id: true },
    });
    if (exists?.id) createdBy = exists.id;
  }

  const asset = await prisma.mediaAsset.create({
    data: {
      url: data.url,
      filename: data.filename,
      mimeType: data.mimeType,
      size: data.size ?? 0,
      width: data.width,
      height: data.height,
      alt: data.alt,
      title: data.title,
      tags: data.tags,
      folder,
      createdBy,
      provider,
      providerFileId: data.providerFileId,
      providerPath: data.providerPath,
      thumbnailUrl: data.thumbnailUrl,
    },
  });

  await logAudit({ actorId, action: "create", entity: "MediaAsset", entityId: asset.id });
  return asset;
}

export async function updateMediaAsset(
    id: string,
    data: { alt?: string; title?: string; tags?: string; folder?: string },
    actorId?: string
) {
  const nextData = {
    ...data,
    ...(data.folder !== undefined ? { folder: normalizeFolder(data.folder) || "general" } : {}),
  };

  const asset = await prisma.mediaAsset.update({
    where: { id },
    data: nextData,
  });

  await logAudit({ actorId, action: "update", entity: "MediaAsset", entityId: id });
  return asset;
}


export async function deleteMediaAsset(id: string, actorId?: string) {
  const asset = await prisma.mediaAsset.update({
    where: { id },
    data: { deleted: true },
  });
  await logAudit({ actorId, action: "delete", entity: "MediaAsset", entityId: id });
  return asset;
}

export async function getFolders() {
  const assets = await prisma.mediaAsset.findMany({
    where: { deleted: false },
    select: { folder: true },
    distinct: ["folder"],
    orderBy: { folder: "asc" },
  });
  return assets.map((a: { folder: string }) => a.folder);
}
