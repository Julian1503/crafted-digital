import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getIntegration, updateIntegration } from "@/lib/services/integrations";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const integration = await getIntegration(id);
    if (!integration) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Simulate connection test — in production, this would verify
    // credentials / connectivity for the specific integration.
    const newStatus = integration.enabled ? "connected" : "disconnected";
    await updateIntegration(id, { status: newStatus }, session.user.id);

    return NextResponse.json({ status: newStatus });
  } catch (error) {
    console.error("POST /api/admin/integrations/[id]/test error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
