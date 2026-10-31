import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";
import { BadRequestError } from "@/lib/errors/api-error";

const ADMIN_ROLE = "admin";

/** True when `id` is an active user holding the admin role. */
async function isActiveAdmin(id: string): Promise<boolean> {
  const count = await prisma.user.count({
    where: { id, active: true, roleAssigns: { some: { role: { name: ADMIN_ROLE } } } },
  });
  return count > 0;
}

async function countActiveAdmins(): Promise<number> {
  return prisma.user.count({
    where: { active: true, roleAssigns: { some: { role: { name: ADMIN_ROLE } } } },
  });
}

/**
 * Refuses a change that would leave the site without an active admin, or
 * that would lock the acting admin out of their own session.
 */
async function assertAdminRemains(targetId: string, actorId: string | undefined, losesAdmin: boolean) {
  if (!losesAdmin) return;
  if (!(await isActiveAdmin(targetId))) return;
  if (actorId && actorId === targetId) {
    throw new BadRequestError("You cannot remove your own admin access or deactivate yourself");
  }
  if ((await countActiveAdmins()) <= 1) {
    throw new BadRequestError("At least one active admin must remain");
  }
}

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  active?: boolean;
}

/** Columns that must never leave the server. */
const USER_OMIT = { hashedPassword: true } as const;

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
      omit: USER_OMIT,
      include: { roleAssigns: { include: { role: true } } },
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getUser(id: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id },
    omit: USER_OMIT,
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
    omit: USER_OMIT,
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
  let losesAdmin = data.active === false;
  if (data.roleIds) {
    const adminRole = await prisma.role.findUnique({ where: { name: ADMIN_ROLE }, select: { id: true } });
    if (adminRole && !data.roleIds.includes(adminRole.id)) losesAdmin = true;
  }
  await assertAdminRemains(id, actorId, losesAdmin);

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
      omit: USER_OMIT,
      include: { roleAssigns: { include: { role: true } } },
    });
  });

  await logAudit({ actorId, action: "update", entity: "User", entityId: id });
  return user;
}

export async function deleteUser(id: string, actorId?: string) {
  await assertAdminRemains(id, actorId, true);
  const user = await prisma.user.update({
    where: { id },
    data: { active: false },
    omit: USER_OMIT,
  });
  await logAudit({ actorId, action: "delete", entity: "User", entityId: id });
  return user;
}

export async function toggleUser(id: string, actorId?: string) {
  const existing = await prisma.user.findUniqueOrThrow({ where: { id } });
  await assertAdminRemains(id, actorId, existing.active);
  const user = await prisma.user.update({
    where: { id },
    data: { active: !existing.active },
    omit: USER_OMIT,
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
