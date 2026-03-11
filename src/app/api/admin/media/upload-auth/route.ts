import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import ImageKit from "imagekit";
import { withErrorHandling, successResponse } from "@/lib/http/api-handler";
import { UnauthorizedError, ForbiddenError, InternalServerError } from "@/lib/errors/api-error";

export const POST = withErrorHandling(async () => {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const roles = session.roles || [];
    if (!checkApiAuth(roles, ["admin", "editor"]))
        throw new ForbiddenError();

    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint)
        throw new InternalServerError("ImageKit credentials not configured");

    const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });
    const authParams = imagekit.getAuthenticationParameters();

    return successResponse({
        ...authParams,
        publicKey,
        urlEndpoint,
        folder: process.env.IMAGEKIT_FOLDER || "crafted-digital",
    });
});
