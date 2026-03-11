import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getRoles, createRole } from "@/lib/services/roles";
import { roleSchema } from "@/lib/validations";
import {
  withErrorHandling,
  successResponse,
  validateRequestBody,
} from "@/lib/http/api-handler";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors/api-error";

export const GET = withErrorHandling(async () => {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin", "editor", "viewer"]))
    throw new ForbiddenError();

  const data = await getRoles();
  return successResponse(data);
});

export const POST = withErrorHandling(async (req) => {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin"]))
    throw new ForbiddenError();

  const data = await validateRequestBody(req, roleSchema);
  const role = await createRole(data, session.user.id);
  return successResponse(role, 201);
});
