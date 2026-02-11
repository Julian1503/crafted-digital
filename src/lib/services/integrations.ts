import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";

export async function getIntegrations() {
  return prisma.integration.findMany({ orderBy: { name: "asc" } });
}

export async function getIntegration(id: string) {
  return prisma.integration.findUniqueOrThrow({ where: { id } });
}

export async function updateIntegration(
  id: string,
  data: { name?: string; enabled?: boolean; config?: string; status?: string },
  actorId?: string
) {
  const integration = await prisma.integration.update({
    where: { id },
    data,
  });

  await logAudit({ actorId, action: "update", entity: "Integration", entityId: id });
  return integration;
}
