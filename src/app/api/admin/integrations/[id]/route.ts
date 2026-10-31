import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getIntegration, updateIntegration } from "@/lib/services/integrations";
import { integrationSchema } from "@/lib/validations";
import { withErrorHandling, successResponse, validateRequestBody } from "@/lib/http/api-handler";
import { UnauthorizedError, ForbiddenError, NotFoundError } from "@/lib/errors/api-error";

type RouteContext = { params: Promise<{ id: string }> };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  if (!checkApiAuth(session.roles || [], ["admin"])) throw new ForbiddenError();
  return session;
}

export const GET = withErrorHandling(async (_req: NextRequest, ctx?: unknown) => {
  const { id } = await (ctx as RouteContext).params;
  await requireAdmin();

  const integration = await getIntegration(id);
  if (!integration) throw new NotFoundError("Integration", id);
  return successResponse(integration);
});

export const PATCH = withErrorHandling(async (req: NextRequest, ctx?: unknown) => {
  const { id } = await (ctx as RouteContext).params;
  const session = await requireAdmin();

  const data = await validateRequestBody(req, integrationSchema.partial());
  if (!(await getIntegration(id))) throw new NotFoundError("Integration", id);

  const integration = await updateIntegration(id, data, session.user.id);
  return successResponse(integration);
});
