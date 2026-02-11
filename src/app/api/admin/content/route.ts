import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getContentBlocks, createContentBlock } from "@/lib/services/content-blocks";
import { contentBlockSchema } from "@/lib/validations/schemas";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = (session as any).roles || [];
    if (!checkApiAuth(roles, ["admin", "editor", "viewer"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const section = req.nextUrl.searchParams.get("section") || undefined;
    const data = await getContentBlocks(section);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/admin/content error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = (session as any).roles || [];
    if (!checkApiAuth(roles, ["admin", "editor"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = contentBlockSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const block = await createContentBlock(parsed.data, session.user.id);
    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/content error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
