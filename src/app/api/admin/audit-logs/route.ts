import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getAuditLogs } from "@/lib/services/audit";
import { paginationSchema } from "@/lib/validations/schemas";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = (session as any).roles || [];
    if (!checkApiAuth(roles, ["admin"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const searchParams = req.nextUrl.searchParams;
    const paginationParsed = paginationSchema.safeParse(Object.fromEntries(searchParams));
    if (!paginationParsed.success)
      return NextResponse.json({ error: paginationParsed.error.flatten() }, { status: 400 });

    const result = await getAuditLogs({
      page: paginationParsed.data.page,
      limit: paginationParsed.data.limit,
      entity: searchParams.get("entity") || undefined,
      action: searchParams.get("action") || undefined,
      actorId: searchParams.get("actorId") || undefined,
      from: searchParams.get("from") || undefined,
      to: searchParams.get("to") || undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/admin/audit-logs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
