import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";

export async function getPlans() {
  return prisma.plan.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getPlan(id: string) {
  return prisma.plan.findUniqueOrThrow({ where: { id } });
}

export async function createPlan(
  data: {
    name: string;
    description?: string;
    price?: number;
    currency?: string;
    interval?: string;
    features?: string;
    sortOrder?: number;
    active?: boolean;
    highlighted?: boolean;
  },
  actorId?: string
) {
  const plan = await prisma.plan.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price ?? 0,
      currency: data.currency ?? "AUD",
      interval: data.interval ?? "one-time",
      features: data.features,
      sortOrder: data.sortOrder ?? 0,
      active: data.active ?? true,
      highlighted: data.highlighted ?? false,
    },
  });

  await logAudit({ actorId, action: "create", entity: "Plan", entityId: plan.id });
  return plan;
}

export async function updatePlan(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    currency?: string;
    interval?: string;
    features?: string;
    sortOrder?: number;
    active?: boolean;
    highlighted?: boolean;
  },
  actorId?: string
) {
  const plan = await prisma.plan.update({
    where: { id },
    data,
  });

  await logAudit({ actorId, action: "update", entity: "Plan", entityId: id });
  return plan;
}

export async function deletePlan(id: string, actorId?: string) {
  const plan = await prisma.plan.delete({ where: { id } });
  await logAudit({ actorId, action: "delete", entity: "Plan", entityId: id });
  return plan;
}

export async function reorderPlans(items: { id: string; sortOrder: number }[], actorId?: string) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.plan.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
    )
  );
  await logAudit({ actorId, action: "reorder", entity: "Plan", metadata: { count: items.length } });
}
