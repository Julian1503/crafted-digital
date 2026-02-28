import type { ProviderUploadInput, ProviderUploadResult } from "./types";
import { uploadCloudinary } from "./provider-cloudinary";
import { uploadImageKit } from "./provider-imagekit";

export async function uploadWithProvider(input: ProviderUploadInput): Promise<ProviderUploadResult> {
    switch (input.provider) {
        case "cloudinary":
            return uploadCloudinary(input);
        case "imagekit":
            return uploadImageKit(input);
        default:
            throw new Error(`Unsupported provider: ${input.provider}`);
    }
}
