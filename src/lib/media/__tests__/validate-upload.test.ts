import { describe, it, expect } from "vitest";
import { checkUpload, detectImageType, safeUploadFilename, MAX_UPLOAD_BYTES } from "@/lib/media/validate-upload";

const PNG  = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0, 0, 0]);
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
const WEBP = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50, 0, 0]);
const TEXT = new Uint8Array(Array.from("<?php echo 1; ?>  ").map((c) => c.charCodeAt(0)));

describe("detectImageType", () => {
    it("recognises PNG, JPEG and WebP by their magic bytes", () => {
        expect(detectImageType(PNG)).toBe("image/png");
        expect(detectImageType(JPEG)).toBe("image/jpeg");
        expect(detectImageType(WEBP)).toBe("image/webp");
    });

    it("rejects anything else, including short buffers", () => {
        expect(detectImageType(TEXT)).toBeNull();
        expect(detectImageType(new Uint8Array([0x89, 0x50]))).toBeNull();
    });
});

describe("safeUploadFilename", () => {
    it("slugifies the name and forces the extension of the detected type", () => {
        expect(safeUploadFilename("My Photo (1).PNG", "image/png")).toBe("my-photo-1.png");
        expect(safeUploadFilename("../../etc/passwd.jpg", "image/jpeg")).toBe("etc-passwd.jpg");
        expect(safeUploadFilename("shell.php.webp", "image/webp")).toBe("shell-php.webp");
        expect(safeUploadFilename("Café résumé.jpeg", "image/jpeg")).toBe("cafe-resume.jpg");
    });

    it("falls back to a default base name", () => {
        expect(safeUploadFilename("....", "image/png")).toBe("upload.png");
    });
});

describe("checkUpload", () => {
    it("accepts a real image and renames it", () => {
        const result = checkUpload({ name: "Hero Image.PNG", size: PNG.length }, PNG);
        expect(result).toEqual({ ok: true, mimeType: "image/png", filename: "hero-image.png" });
    });

    it("rejects files that are empty, too large or not images", () => {
        expect(checkUpload({ name: "a.png", size: 0 }, new Uint8Array())).toMatchObject({ ok: false });
        expect(checkUpload({ name: "a.png", size: MAX_UPLOAD_BYTES + 1 }, PNG)).toMatchObject({ ok: false });
        expect(checkUpload({ name: "a.png", size: TEXT.length }, TEXT)).toMatchObject({ ok: false });
    });
});
