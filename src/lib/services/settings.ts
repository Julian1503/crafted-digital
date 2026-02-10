import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";

export async function getSettings(group?: string) {
  return prisma.siteSetting.findMany({
    where: group ? { group } : undefined,
    orderBy: { key: "asc" },
  });
}

export async function getSetting(key: string) {
  return prisma.siteSetting.findUniqueOrThrow({ where: { key } });
}

export async function upsertSetting(key: string, value: string, group: string = "general", actorId?: string) {
  const setting = await prisma.siteSetting.upsert({
    where: { key },
    update: { value, group },
    create: { key, value, group },
  });

  await logAudit({ actorId, action: "upsert", entity: "SiteSetting", entityId: setting.id, metadata: { key } });
  return setting;
}

export async function bulkUpsertSettings(
  settings: { key: string; value: string; group?: string }[],
  actorId?: string
) {
  const results = await prisma.$transaction(
    settings.map((s) =>
      prisma.siteSetting.upsert({
        where: { key: s.key },
        update: { value: s.value, group: s.group ?? "general" },
        create: { key: s.key, value: s.value, group: s.group ?? "general" },
      })
    )
  );

  await logAudit({
    actorId,
    action: "bulk_upsert",
    entity: "SiteSetting",
    metadata: { keys: settings.map((s) => s.key) },
  });
  return results;
}
