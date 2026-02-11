import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";

export async function getContentBlocks(section?: string) {
  return prisma.contentBlock.findMany({
    where: section ? { section } : undefined,
    orderBy: { sortOrder: "asc" },
  });
}

export async function getContentBlock(id: string) {
  return prisma.contentBlock.findUniqueOrThrow({ where: { id } });
}

export async function createContentBlock(
  data: { section: string; title?: string; content?: string; sortOrder?: number; active?: boolean },
  actorId?: string
) {
  const block = await prisma.contentBlock.create({
    data: {
      section: data.section,
      title: data.title,
      content: data.content,
      sortOrder: data.sortOrder ?? 0,
      active: data.active ?? true,
    },
  });

  await logAudit({ actorId, action: "create", entity: "ContentBlock", entityId: block.id });
  return block;
}

export async function updateContentBlock(
  id: string,
  data: { section?: string; title?: string; content?: string; sortOrder?: number; active?: boolean },
  actorId?: string
) {
  const block = await prisma.contentBlock.update({
    where: { id },
    data,
  });

  await logAudit({ actorId, action: "update", entity: "ContentBlock", entityId: id });
  return block;
}

export async function deleteContentBlock(id: string, actorId?: string) {
  const block = await prisma.contentBlock.delete({ where: { id } });
  await logAudit({ actorId, action: "delete", entity: "ContentBlock", entityId: id });
  return block;
}

export async function reorderContentBlocks(items: { id: string; sortOrder: number }[], actorId?: string) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.contentBlock.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
    )
  );
  await logAudit({ actorId, action: "reorder", entity: "ContentBlock", metadata: { count: items.length } });
}
