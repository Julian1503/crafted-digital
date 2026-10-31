import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getIntegrationWithSecrets, updateIntegration } from "@/lib/services/integrations";
import { withErrorHandling, successResponse } from "@/lib/http/api-handler";
import { UnauthorizedError, ForbiddenError, NotFoundError } from "@/lib/errors/api-error";

type RouteContext = { params: Promise<{ id: string }> };

export const POST = withErrorHandling(async (_req: NextRequest, ctx?: unknown) => {
  const { id } = await (ctx as RouteContext).params;
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  if (!checkApiAuth(session.roles || [], ["admin"])) throw new ForbiddenError();

  const integration = await getIntegrationWithSecrets(id);
  if (!integration) throw new NotFoundError("Integration", id);

  // Placeholder connection test: a real check would call the provider with
  // `integration.config`. Until then the status follows the enabled flag.
  const newStatus = integration.enabled ? "connected" : "disconnected";
  await updateIntegration(id, { status: newStatus }, session.user.id);

  return successResponse({ status: newStatus });
});
