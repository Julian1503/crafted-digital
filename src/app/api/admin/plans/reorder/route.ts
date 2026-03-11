import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { reorderPlans } from "@/lib/services/plans";
import { reorderSchema } from "@/lib/validations";
import { withErrorHandling, successResponse, validateRequestBody } from "@/lib/http/api-handler";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors/api-error";

export const POST = withErrorHandling(async (req) => {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin"]))
    throw new ForbiddenError();

  const data = await validateRequestBody(req, reorderSchema);
  await reorderPlans(data, session.user.id);
  return successResponse({ success: true });
});
