import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getPermissions } from "@/lib/services/roles";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data = await getPermissions();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/admin/permissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
