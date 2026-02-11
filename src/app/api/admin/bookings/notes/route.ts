import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { addBookingNote } from "@/lib/services/bookings";
import { bookingNoteSchema } from "@/lib/validations/schemas";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const roles = (session as any).roles || [];
    if (!checkApiAuth(roles, ["admin"]))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = bookingNoteSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const note = await addBookingNote(parsed.data, session.user.id);
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/bookings/notes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
