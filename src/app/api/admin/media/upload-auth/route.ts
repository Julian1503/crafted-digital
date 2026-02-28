import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import ImageKit from "imagekit";

export async function POST() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const roles = session.roles || [];
        if (!checkApiAuth(roles, ["admin", "editor"])) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

        if (!publicKey || !privateKey || !urlEndpoint) {
            return NextResponse.json(
                { error: "ImageKit credentials not configured" },
                { status: 500 }
            );
        }

        const imagekit = new ImageKit({
            publicKey,
            privateKey,
            urlEndpoint,
        });

        // Generates: { token, expire, signature }
        const authParams = imagekit.getAuthenticationParameters();

        return NextResponse.json({
            ...authParams,
            publicKey,
            urlEndpoint,
            folder: process.env.IMAGEKIT_FOLDER || "crafted-digital",
        });
    } catch (error) {
        console.error("POST /api/admin/media/upload-auth error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
