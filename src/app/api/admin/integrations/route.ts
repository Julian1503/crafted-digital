import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getIntegrations } from "@/lib/services/integrations";
import { withErrorHandling, successResponse } from "@/lib/http/api-handler";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors/api-error";

export const GET = withErrorHandling(async () => {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  if (!checkApiAuth(session.roles || [], ["admin"])) throw new ForbiddenError();

  return successResponse(await getIntegrations());
});
