/**
 * @fileoverview Server-side checks for admin media uploads.
 *
 * The browser-supplied `File.type` is not trusted: the first bytes of the file
 * decide the type, and the stored filename is regenerated from a safe slug of
 * the original name plus the extension that matches the detected type.
 */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB per file
export const MAX_UPLOAD_FILES = 10;

export type DetectedImageType = "image/png" | "image/jpeg" | "image/webp";

const EXTENSION: Record<DetectedImageType, string> = {
    "image/png":  "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
};

/** Returns the image type from magic bytes, or null when it is not a supported image. */
export function detectImageType(bytes: Uint8Array): DetectedImageType | null {
    if (bytes.length < 12) return null;
    const startsWith = (sig: number[], offset = 0) => sig.every((b, i) => bytes[offset + i] === b);

    if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
    if (startsWith([0xff, 0xd8, 0xff])) return "image/jpeg";
    // RIFF....WEBP
    if (startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8)) return "image/webp";
    return null;
}

/** `My Photo (1).PNG` becomes `my-photo-1.png`; the extension always matches the detected type. */
export function safeUploadFilename(originalName: string, type: DetectedImageType): string {
    const base = originalName
        .replace(/\.[^.]*$/, "")
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
    return `${base || "upload"}.${EXTENSION[type]}`;
}

export interface UploadCheck {
    ok: true;
    mimeType: DetectedImageType;
    filename: string;
}

export interface UploadCheckFailure {
    ok: false;
    reason: string;
}

export function checkUpload(file: { name: string; size: number }, bytes: Uint8Array): UploadCheck | UploadCheckFailure {
    if (file.size === 0 || bytes.length === 0) return { ok: false, reason: `${file.name}: empty file` };
    if (file.size > MAX_UPLOAD_BYTES || bytes.length > MAX_UPLOAD_BYTES) {
        return { ok: false, reason: `${file.name}: larger than ${MAX_UPLOAD_BYTES / 1024 / 1024} MB` };
    }
    const mimeType = detectImageType(bytes);
    if (!mimeType) return { ok: false, reason: `${file.name}: not a PNG, JPEG or WebP image` };
    return { ok: true, mimeType, filename: safeUploadFilename(file.name, mimeType) };
}
