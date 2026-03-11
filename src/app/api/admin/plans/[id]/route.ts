import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getPlan, updatePlan, deletePlan } from "@/lib/services/plans";
import { planUpdateSchema } from "@/lib/validations";
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

  const plan = await getPlan(id);
  if (!plan) throw new NotFoundError("Plan", id);
  return successResponse(plan);
});

export const PATCH = withErrorHandling(async (req: NextRequest, ctx?: unknown) => {
  const { id } = await (ctx as RouteContext).params;
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin"]))
    throw new ForbiddenError();

  const data = await validateRequestBody(req, planUpdateSchema);
  const plan = await updatePlan(id, data, session.user.id);
  return successResponse(plan);
});

export const DELETE = withErrorHandling(async (req: NextRequest, ctx?: unknown) => {
  const { id } = await (ctx as RouteContext).params;
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin"]))
    throw new ForbiddenError();

  await deletePlan(id, session.user.id);
  return successResponse({ success: true });
});
