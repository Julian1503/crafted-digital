import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getCaseStudies, createCaseStudy } from "@/lib/services/case-studies";
import { paginationSchema, caseStudyCreateSchema } from "@/lib/validations";
import {
  withErrorHandling,
  successResponse,
  validateSearchParams,
  validateRequestBody,
} from "@/lib/http/api-handler";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors/api-error";

export const GET = withErrorHandling(async (req) => {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();

  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin", "editor", "viewer"]))
    throw new ForbiddenError();

  const params = validateSearchParams(req, paginationSchema);
  const result = await getCaseStudies(params);
  return successResponse(result);
});

export const POST = withErrorHandling(async (req) => {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();

  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin", "editor"]))
    throw new ForbiddenError();

  const data = await validateRequestBody(req, caseStudyCreateSchema);
  const study = await createCaseStudy(data, session.user.id);
  return successResponse(study, 201);
});
