import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";

export async function getRoles() {
  return prisma.role.findMany({
    include: { permissions: { include: { permission: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getRole(id: string) {
  return prisma.role.findUniqueOrThrow({
    where: { id },
    include: { permissions: { include: { permission: true } } },
  });
}

export async function createRole(
  data: { name: string; description?: string; permissionIds?: string[] },
  actorId?: string
) {
  const role = await prisma.role.create({
    data: {
      name: data.name,
      description: data.description,
      permissions: data.permissionIds?.length
        ? { create: data.permissionIds.map((permissionId) => ({ permissionId })) }
        : undefined,
    },
    include: { permissions: { include: { permission: true } } },
  });

  await logAudit({ actorId, action: "create", entity: "Role", entityId: role.id });
  return role;
}

export async function updateRole(
  id: string,
  data: { name?: string; description?: string; permissionIds?: string[] },
  actorId?: string
) {
  const role = await prisma.$transaction(async (tx) => {
    if (data.permissionIds) {
      await tx.rolePermission.deleteMany({ where: { roleId: id } });
      if (data.permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: data.permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
        });
      }
    }
    return tx.role.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
      },
      include: { permissions: { include: { permission: true } } },
    });
  });

  await logAudit({ actorId, action: "update", entity: "Role", entityId: id });
  return role;
}

export async function deleteRole(id: string, actorId?: string) {
  const role = await prisma.role.delete({ where: { id } });
  await logAudit({ actorId, action: "delete", entity: "Role", entityId: id });
  return role;
}

export async function getPermissions() {
  return prisma.permission.findMany({ orderBy: [{ module: "asc" }, { action: "asc" }] });
}

export async function assignRolesToUser(userId: string, roleIds: string[], actorId?: string) {
  await prisma.$transaction(async (tx) => {
    await tx.userRole.deleteMany({ where: { userId } });
    if (roleIds.length > 0) {
      await tx.userRole.createMany({
        data: roleIds.map((roleId) => ({ userId, roleId })),
      });
    }
  });

  await logAudit({
    actorId,
    action: "assign_roles",
    entity: "User",
    entityId: userId,
    metadata: { roleIds },
  });
}
