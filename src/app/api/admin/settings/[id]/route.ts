import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { checkApiAuth } from "@/lib/auth/rbac";
import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";
import { withErrorHandling, successResponse } from "@/lib/http/api-handler";
import { UnauthorizedError, ForbiddenError, NotFoundError } from "@/lib/errors/api-error";

type RouteContext = { params: Promise<{ id: string }> };

export const DELETE = withErrorHandling(async (req: NextRequest, ctx?: unknown) => {
  const { id } = await (ctx as RouteContext).params;
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const roles = session.roles || [];
  if (!checkApiAuth(roles, ["admin"]))
    throw new ForbiddenError();

  const setting = await prisma.siteSetting.findUnique({ where: { id } });
  if (!setting) throw new NotFoundError("Setting", id);

  await prisma.siteSetting.delete({ where: { id } });

  await logAudit({
    actorId: session.user.id,
    action: "delete",
    entity: "siteSetting",
    entityId: id,
    metadata: { key: setting.key, group: setting.group },
  });

  return successResponse({ success: true });
});
