import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getSettings, bulkUpsertSettings } from "@/lib/services/settings";
import { siteSettingSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const group = req.nextUrl.searchParams.get("group") || undefined;
    const data = await getSettings(group);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
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
    const parsed = z.array(siteSettingSchema).safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    await bulkUpsertSettings(parsed.data, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/admin/settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
