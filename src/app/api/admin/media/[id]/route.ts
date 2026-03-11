import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { getMediaAsset, updateMediaAsset, deleteMediaAsset } from "@/lib/services/media";
import { mediaAssetSchema } from "@/lib/validations";
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

  const asset = await getMediaAsset(id);
  if (!asset) throw new NotFoundError("MediaAsset", id);
  return successResponse(asset);
});

export const PATCH = withErrorHandling(async (req: NextRequest, ctx?: unknown) => {
  const { id } = await (ctx as RouteContext).params;
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin", "editor"]))
    throw new ForbiddenError();

  const data = await validateRequestBody(req, mediaAssetSchema.partial());
  const asset = await updateMediaAsset(id, data, session.user.id);
  return successResponse(asset);
});

export const DELETE = withErrorHandling(async (req: NextRequest, ctx?: unknown) => {
  const { id } = await (ctx as RouteContext).params;
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin", "editor"]))
    throw new ForbiddenError();

  await deleteMediaAsset(id, session.user.id);
  return successResponse({ success: true });
});
