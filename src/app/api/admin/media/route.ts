import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getMediaAssets, createMediaAsset } from "@/lib/services/media";
import { paginationSchema, mediaAssetSchema } from "@/lib/validations";
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
  const result = await getMediaAssets({ ...params, folder: req.nextUrl.searchParams.get("folder") || undefined });
  return successResponse(result);
});

export const POST = withErrorHandling(async (req) => {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin", "editor"]))
    throw new ForbiddenError();

  const data = await validateRequestBody(req, mediaAssetSchema);
  const asset = await createMediaAsset(data, session.user.id);
  return successResponse(asset, 201);
});
