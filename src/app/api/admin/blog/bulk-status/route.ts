import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { bulkUpdateStatus } from "@/lib/services/blog";

const bulkStatusSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  status: z.enum(["draft", "published", "scheduled"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin", "editor"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = bulkStatusSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    await bulkUpdateStatus(parsed.data.ids, parsed.data.status, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/admin/blog/bulk-status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
