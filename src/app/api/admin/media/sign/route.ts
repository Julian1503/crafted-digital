import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import crypto from "crypto";
import { withErrorHandling, successResponse } from "@/lib/http/api-handler";
import { UnauthorizedError, ForbiddenError, InternalServerError } from "@/lib/errors/api-error";

export const POST = withErrorHandling(async () => {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin", "editor"]))
    throw new ForbiddenError();

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_FOLDER || "crafted-digital";

  if (!cloudName || !apiKey || !apiSecret)
    throw new InternalServerError("Cloudinary credentials not configured");

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  return successResponse({ signature, timestamp, cloudName, apiKey, folder });
});
