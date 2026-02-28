import ImageKit from "imagekit";
import type { ProviderUploadInput, ProviderUploadResult } from "./types";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function uploadImageKit(input: ProviderUploadInput): Promise<ProviderUploadResult> {
    const folder = input.folder || process.env.IMAGEKIT_FOLDER || "crafted-digital";

    // ImageKit server SDK acepta Buffer
    const res = await imagekit.upload({
        file: input.fileBuffer,
        fileName: input.originalName,
        folder: `/${folder}`,
        useUniqueFileName: true,
    });

    return {
        provider: "imagekit",

        url: res.url,
        thumbnailUrl: res.thumbnailUrl ?? null,

        providerFileId: res.fileId ?? null,
        providerPath: res.filePath ?? null,

        filename: input.originalName,
        mimeType: input.mimeType,
        size: res.size ?? input.fileBuffer.length,
        width: res.width ?? null,
        height: res.height ?? null,

        folder,
    };
}
