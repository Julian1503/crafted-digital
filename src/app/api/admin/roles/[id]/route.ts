import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getRole, updateRole, deleteRole } from "@/lib/services/roles";
import { roleSchema } from "@/lib/validations";
import {
  withErrorHandling,
  successResponse,
  validateRequestBody,
} from "@/lib/http/api-handler";
import { UnauthorizedError, ForbiddenError, NotFoundError } from "@/lib/errors/api-error";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withErrorHandling(async (req: NextRequest, ctx?: unknown) => {
  const { id } = await (ctx as RouteContext).params;
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin", "editor", "viewer"]))
    throw new ForbiddenError();

  const role = await getRole(id);
  if (!role) throw new NotFoundError("Role", id);
  return successResponse(role);
});

export const PATCH = withErrorHandling(async (req: NextRequest, ctx?: unknown) => {
  const { id } = await (ctx as RouteContext).params;
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin"]))
    throw new ForbiddenError();

  const data = await validateRequestBody(req, roleSchema);
  const role = await updateRole(id, data, session.user.id);
  return successResponse(role);
});

export const DELETE = withErrorHandling(async (req: NextRequest, ctx?: unknown) => {
  const { id } = await (ctx as RouteContext).params;
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin"]))
    throw new ForbiddenError();

  await deleteRole(id, session.user.id);
  return successResponse({ success: true });
});
