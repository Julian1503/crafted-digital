import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getDashboardMetrics, getRecentActivity } from "@/lib/services/dashboard";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin", "editor", "viewer"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [metrics, recentActivity] = await Promise.all([
      getDashboardMetrics(),
      getRecentActivity(),
    ]);
    return NextResponse.json({ metrics, recentActivity });
  } catch (error) {
    console.error("GET /api/admin/dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
