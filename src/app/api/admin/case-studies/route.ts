import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getCaseStudies, createCaseStudy } from "@/lib/services/case-studies";
import { paginationSchema, caseStudyCreateSchema } from "@/lib/validations";
import { ok, fail, validationFail } from "@/lib/http/api-response";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return fail("UNAUTHORIZED", "Unauthorized", 401);

    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin", "editor", "viewer"]))
      return fail("FORBIDDEN", "Forbidden", 403);

    const params = Object.fromEntries(req.nextUrl.searchParams);
    const parsed = paginationSchema.safeParse(params);
    if (!parsed.success) return validationFail(parsed.error);

    const result = await getCaseStudies(parsed.data);
    return ok(result);
  } catch (error) {
    console.error("GET /api/admin/case-studies error:", error);
    return fail("INTERNAL_ERROR", "Internal server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return fail("UNAUTHORIZED", "Unauthorized", 401);

    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin", "editor"]))
      return fail("FORBIDDEN", "Forbidden", 403);

    const body = await req.json();
    const parsed = caseStudyCreateSchema.safeParse(body);
    if (!parsed.success) return validationFail(parsed.error);

    const study = await createCaseStudy(parsed.data, session.user.id);
    return ok(study, 201);
  } catch (error) {
    console.error("POST /api/admin/case-studies error:", error);
    return fail("INTERNAL_ERROR", "Internal server error", 500);
  }
}