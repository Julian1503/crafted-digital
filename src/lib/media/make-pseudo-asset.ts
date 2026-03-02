import type { MediaAsset } from "@/components/admin/MediaPicker";

/**
 * Creates a minimal MediaAsset object from a URL string.
 * Useful when a coverImage URL exists but no full MediaAsset record is available.
 */
export function makePseudoAssetFromUrl(url: string): MediaAsset {
  const clean = url.trim();
  const filename = (() => {
    try {
      const u = new URL(clean);
      return decodeURIComponent(u.pathname.split("/").pop() || clean);
    } catch {
      return clean.split("/").pop() || clean;
    }
  })();

  return {
    id: clean,
    url: clean,
    filename,
    mimeType: "image/*",
    size: 0,
    width: null,
    height: null,
    alt: null,
    title: null,
    tags: null,
    folder: "unknown",
    createdBy: null,
    deleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    provider: undefined,
    providerFileId: undefined,
    providerPath: undefined,
    thumbnailUrl: undefined,
  };
}
