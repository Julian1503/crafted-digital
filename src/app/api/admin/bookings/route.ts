import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getBookings, createBooking } from "@/lib/services/bookings";
import { paginationSchema, bookingCreateSchema } from "@/lib/validations";

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

    const result = await getBookings(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/admin/bookings error:", error);
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
    const parsed = bookingCreateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const booking = await createBooking(parsed.data, session.user.id);
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
