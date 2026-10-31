import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";
import { maskIntegrationConfig, mergeMaskedConfig } from "@/lib/services/integration-config";

export { maskIntegrationConfig } from "@/lib/services/integration-config";

type IntegrationRow = NonNullable<Awaited<ReturnType<typeof prisma.integration.findUnique>>>;

function toPublic(row: IntegrationRow) {
  return { ...row, config: maskIntegrationConfig(row.config) };
}

/** Admin list with secrets masked. */
export async function getIntegrations() {
  const rows = await prisma.integration.findMany({ orderBy: { name: "asc" } });
  return rows.map(toPublic);
}

/** Admin read with secrets masked; null when missing. */
export async function getIntegration(id: string) {
  const row = await prisma.integration.findUnique({ where: { id } });
  return row ? toPublic(row) : null;
}

/** Server-side read with the real config, for connection tests and sync jobs. */
export async function getIntegrationWithSecrets(id: string) {
  return prisma.integration.findUnique({ where: { id } });
}

export async function updateIntegration(
  id: string,
  data: { name?: string; enabled?: boolean; config?: string; status?: string },
  actorId?: string
) {
  // Masked values coming back from the form must not overwrite the stored secrets.
  let config: string | undefined;
  if (data.config !== undefined) {
    const current = await prisma.integration.findUnique({ where: { id }, select: { config: true } });
    config = mergeMaskedConfig(current?.config ?? null, data.config);
  }
  const { config: _ignored, ...rest } = data;
  void _ignored;

  const integration = await prisma.integration.update({
    where: { id },
    data: config === undefined ? rest : { ...rest, config },
  });

  await logAudit({ actorId, action: "update", entity: "Integration", entityId: id });
  return toPublic(integration);
}
