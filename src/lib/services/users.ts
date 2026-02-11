import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  active?: boolean;
}

export async function getUsers(params: PaginationParams = {}) {
  const { page = 1, limit = 20, search, sortBy = "createdAt", sortDir = "desc", active } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (typeof active === "boolean") where.active = active;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortDir },
      include: { roleAssigns: { include: { role: true } } },
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getUser(id: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id },
    include: { roleAssigns: { include: { role: true } } },
  });
}

export async function createUser(
  data: {
    name: string;
    email: string;
    password: string;
    image?: string;
    active?: boolean;
    roleIds?: string[];
  },
  actorId?: string
) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      hashedPassword,
      image: data.image || null,
      active: data.active ?? true,
      roleAssigns: data.roleIds?.length
        ? { create: data.roleIds.map((roleId) => ({ roleId })) }
        : undefined,
    },
    include: { roleAssigns: { include: { role: true } } },
  });

  await logAudit({ actorId, action: "create", entity: "User", entityId: user.id });
  return user;
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    image?: string;
    active?: boolean;
    roleIds?: string[];
  },
  actorId?: string
) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.image !== undefined) updateData.image = data.image || null;
  if (data.active !== undefined) updateData.active = data.active;
  if (data.password) updateData.hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.$transaction(async (tx) => {
    if (data.roleIds) {
      await tx.userRole.deleteMany({ where: { userId: id } });
      if (data.roleIds.length > 0) {
        await tx.userRole.createMany({
          data: data.roleIds.map((roleId) => ({ userId: id, roleId })),
        });
      }
    }
    return tx.user.update({
      where: { id },
      data: updateData,
      include: { roleAssigns: { include: { role: true } } },
    });
  });

  await logAudit({ actorId, action: "update", entity: "User", entityId: id });
  return user;
}

export async function deleteUser(id: string, actorId?: string) {
  const user = await prisma.user.update({
    where: { id },
    data: { active: false },
  });
  await logAudit({ actorId, action: "delete", entity: "User", entityId: id });
  return user;
}

export async function toggleUser(id: string, actorId?: string) {
  const existing = await prisma.user.findUniqueOrThrow({ where: { id } });
  const user = await prisma.user.update({
    where: { id },
    data: { active: !existing.active },
  });
  await logAudit({
    actorId,
    action: "toggle",
    entity: "User",
    entityId: id,
    metadata: { active: user.active },
  });
  return user;
}
