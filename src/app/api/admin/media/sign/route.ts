import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import crypto from "crypto";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = (session as any).roles || [];
    if (!checkApiAuth(roles, ["admin", "editor"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const folder = process.env.CLOUDINARY_FOLDER || "crafted-digital";

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: "Cloudinary credentials not configured" }, { status: 500 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    return NextResponse.json({
      signature,
      timestamp,
      cloudName,
      apiKey,
      folder,
    });
  } catch (error) {
    console.error("POST /api/admin/media/sign error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
