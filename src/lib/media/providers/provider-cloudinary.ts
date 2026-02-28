import { v2 as cloudinary } from "cloudinary";
import type { ProviderUploadInput, ProviderUploadResult } from "./types";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadCloudinary(input: ProviderUploadInput): Promise<ProviderUploadResult> {
    const folder = input.folder || process.env.CLOUDINARY_FOLDER || "crafted-digital";

    // Upload using upload_stream so we can pass Buffer
    const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image", // si después soportás video/docs, hacelo dinámico
                use_filename: true,
                unique_filename: true,
            },
            (err, res) => {
                if (err || !res) return reject(err || new Error("Cloudinary upload failed"));
                resolve(res);
            }
        );
        stream.end(input.fileBuffer);
    });

    return {
        provider: "cloudinary",

        url: result.secure_url,
        thumbnailUrl: result.secure_url ?? null,

        providerFileId: result.public_id ?? null,
        providerPath: result.asset_folder ?? folder ?? null,

        filename: input.originalName,
        mimeType: input.mimeType,
        size: result.bytes ?? input.fileBuffer.length,
        width: result.width ?? null,
        height: result.height ?? null,

        folder,
    };
}