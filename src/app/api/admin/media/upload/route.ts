import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { uploadWithProvider } from "@/lib/media/providers";
import { normalizeFolder } from "@/lib/media/normalize-folders";
import { createMediaAsset } from "@/lib/services/media"; // <-- ajustá el path real
import { MediaProvider } from "@/generated/prisma/enums";

export const runtime = "nodejs";

const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);

function isMediaProvider(value: unknown): value is MediaProvider {
    return value === "cloudinary" || value === "imagekit";
}

export async function POST(req: Request) {
    try {
        // 1) Auth + RBAC
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const roles = session.roles || [];
        if (!checkApiAuth(roles, ["admin", "editor"])) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 2) Parse formData
        const form = await req.formData();

        const rawProvider = form.get("provider")?.toString() ?? "imagekit";
        if (!isMediaProvider(rawProvider)) {
            return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
        }
        const provider: MediaProvider = rawProvider;

        // normalize for using on provider paths; service will also normalize for DB
        const rawFolder = form.get("folder")?.toString();
        const folder = normalizeFolder(rawFolder) || "general";

        const files = form.getAll("files") as File[];
        if (!files.length) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }

        // 3) Upload each file + save DB via service (audit included)
        const created = [];
        for (const file of files) {
            if (!(file instanceof File)) continue;

            if (!ALLOWED_MIME.has(file.type)) {
                return NextResponse.json(
                    { error: `Unsupported file type: ${file.type}` },
                    { status: 400 }
                );
            }

            const buffer = Buffer.from(await file.arrayBuffer());

            const uploaded = await uploadWithProvider({
                provider, // <-- enum compatible (same string)
                fileBuffer: buffer,
                originalName: file.name,
                mimeType: file.type,
                folder,
            });

            console.log(session.user.name);

            const row = await createMediaAsset(
                {
                    url: uploaded.url,
                    filename: uploaded.filename,
                    mimeType: uploaded.mimeType,
                    size: uploaded.size,
                    width: uploaded.width ?? undefined,
                    height: uploaded.height ?? undefined,
                    folder: uploaded.folder, // service normalizes again
                    provider: uploaded.provider,
                    providerFileId: uploaded.providerFileId ?? undefined,
                    providerPath: uploaded.providerPath ?? undefined,
                    thumbnailUrl: uploaded.thumbnailUrl ?? undefined,
                },
                session.user.id
            );

            created.push(row);
        }

        return NextResponse.json({ data: created }, { status: 201 });
    } catch (error) {
        console.error("POST /api/admin/media/upload error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
