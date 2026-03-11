import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { uploadWithProvider } from "@/lib/media/providers";
import { normalizeFolder } from "@/lib/media/normalize-folders";
import { createMediaAsset } from "@/lib/services/media";
import { MediaProvider } from "@/generated/prisma/enums";
import { withErrorHandling, successResponse } from "@/lib/http/api-handler";
import { UnauthorizedError, ForbiddenError, BadRequestError } from "@/lib/errors/api-error";

export const runtime = "nodejs";

const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);

function isMediaProvider(value: unknown): value is MediaProvider {
    return value === "cloudinary" || value === "imagekit";
}

export const POST = withErrorHandling(async (req) => {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin", "editor"]))
        throw new ForbiddenError();

    const form = await req.formData();

    const rawProvider = form.get("provider")?.toString() ?? "imagekit";
    if (!isMediaProvider(rawProvider))
        throw new BadRequestError("Invalid provider");

    const provider: MediaProvider = rawProvider;
    const rawFolder = form.get("folder")?.toString();
    const folder = normalizeFolder(rawFolder) || "general";

    const files = form.getAll("files") as File[];
    if (!files.length)
        throw new BadRequestError("No files provided");

    const created = [];
    for (const file of files) {
        if (!(file instanceof File)) continue;

        if (!ALLOWED_MIME.has(file.type))
            throw new BadRequestError(`Unsupported file type: ${file.type}`);

        const buffer = Buffer.from(await file.arrayBuffer());

        const uploaded = await uploadWithProvider({
            provider,
            fileBuffer: buffer,
            originalName: file.name,
            mimeType: file.type,
            folder,
        });

        const row = await createMediaAsset(
            {
                url: uploaded.url,
                filename: uploaded.filename,
                mimeType: uploaded.mimeType,
                size: uploaded.size,
                width: uploaded.width ?? undefined,
                height: uploaded.height ?? undefined,
                folder: uploaded.folder,
                provider: uploaded.provider,
                providerFileId: uploaded.providerFileId ?? undefined,
                providerPath: uploaded.providerPath ?? undefined,
                thumbnailUrl: uploaded.thumbnailUrl ?? undefined,
            },
            session.user.id
        );

        created.push(row);
    }

    return successResponse({ data: created }, 201);
});
