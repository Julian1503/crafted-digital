import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getLeads, createLead } from "@/lib/services/leads";
import { paginationSchema, leadCreateSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin", "editor", "viewer"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const params = Object.fromEntries(req.nextUrl.searchParams);
    const parsed = paginationSchema.safeParse(params);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const result = await getLeads(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/admin/leads error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = leadCreateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const lead = await createLead(parsed.data, session.user.id);
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/leads error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
