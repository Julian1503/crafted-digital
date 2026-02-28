import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { toggleFeatured } from "@/lib/services/case-studies";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin", "editor"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const study = await toggleFeatured(id, session.user.id);
    return NextResponse.json(study);
  } catch (error) {
    console.error("POST /api/admin/case-studies/[id]/featured error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
