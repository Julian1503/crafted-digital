import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getSettings, bulkUpsertSettings } from "@/lib/services/settings";
import { siteSettingSchema } from "@/lib/validations";
import {
  withErrorHandling,
  successResponse,
  validateRequestBody,
} from "@/lib/http/api-handler";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors/api-error";

export const GET = withErrorHandling(async (req) => {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin"]))
    throw new ForbiddenError();

  const group = req.nextUrl.searchParams.get("group") || undefined;
  const data = await getSettings(group);
  return successResponse(data);
});

export const POST = withErrorHandling(async (req) => {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin"]))
    throw new ForbiddenError();

  const data = await validateRequestBody(req, z.array(siteSettingSchema));
  await bulkUpsertSettings(data, session.user.id);
  return successResponse({ success: true });
});
