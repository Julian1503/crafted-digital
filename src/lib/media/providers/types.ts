export type MediaProvider = "cloudinary" | "imagekit";

export type ProviderUploadInput = {
    provider: MediaProvider;
    fileBuffer: Buffer;
    originalName: string;
    mimeType: string;
    folder: string;
};

export type ProviderUploadResult = {
    provider: MediaProvider;

    url: string;
    thumbnailUrl: string | null;

    providerFileId: string | null;
    providerPath: string | null;

    filename: string;
    mimeType: string;
    size: number;
    width: number | null;
    height: number | null;

    folder: string;
};