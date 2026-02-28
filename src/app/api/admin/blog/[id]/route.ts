import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/services/blog";
import { blogPostUpdateSchema } from "@/lib/validations";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin", "editor", "viewer"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const post = await getBlogPost(id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/admin/blog/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin", "editor"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = blogPostUpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const post = await updateBlogPost(id, parsed.data, session.user.id);
    return NextResponse.json(post);
  } catch (error) {
    console.error("PATCH /api/admin/blog/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin", "editor"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await deleteBlogPost(id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/blog/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
