import { describe, it, expect } from "vitest";
import { makePseudoAssetFromUrl } from "../media/make-pseudo-asset";

describe("makePseudoAssetFromUrl", () => {
  it("creates asset with correct URL", () => {
    const asset = makePseudoAssetFromUrl("https://example.com/image.png");
    expect(asset.url).toBe("https://example.com/image.png");
    expect(asset.id).toBe("https://example.com/image.png");
  });

  it("extracts filename from URL", () => {
    const asset = makePseudoAssetFromUrl("https://example.com/path/to/photo.jpg");
    expect(asset.filename).toBe("photo.jpg");
  });

  it("handles encoded filenames", () => {
    const asset = makePseudoAssetFromUrl("https://example.com/my%20image.png");
    expect(asset.filename).toBe("my image.png");
  });

  it("handles plain string without URL format", () => {
    const asset = makePseudoAssetFromUrl("simple-file.png");
    expect(asset.filename).toBe("simple-file.png");
  });

  it("trims whitespace from URL", () => {
    const asset = makePseudoAssetFromUrl("  https://example.com/img.png  ");
    expect(asset.url).toBe("https://example.com/img.png");
  });

  it("sets default values for non-required fields", () => {
    const asset = makePseudoAssetFromUrl("https://example.com/img.png");
    expect(asset.mimeType).toBe("image/*");
    expect(asset.size).toBe(0);
    expect(asset.width).toBeNull();
    expect(asset.height).toBeNull();
    expect(asset.alt).toBeNull();
    expect(asset.folder).toBe("unknown");
    expect(asset.deleted).toBe(false);
  });
});
