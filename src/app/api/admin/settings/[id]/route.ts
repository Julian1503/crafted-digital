import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = (session as any).roles || [];
    if (!checkApiAuth(roles, ["admin"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const setting = await prisma.siteSetting.findUnique({ where: { id } });
    if (!setting) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.siteSetting.delete({ where: { id } });

    await logAudit({
      actorId: session.user.id,
      action: "delete",
      entity: "siteSetting",
      entityId: id,
      metadata: { key: setting.key, group: setting.group },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/settings/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
