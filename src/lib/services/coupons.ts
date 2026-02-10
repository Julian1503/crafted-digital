import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";

interface CouponPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  active?: boolean;
}

export async function getCoupons(params: CouponPaginationParams = {}) {
  const { page = 1, limit = 20, search, sortBy = "createdAt", sortDir = "desc", active } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (typeof active === "boolean") where.active = active;
  if (search) where.code = { contains: search };

  const [data, total] = await Promise.all([
    prisma.coupon.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortDir },
    }),
    prisma.coupon.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getCoupon(id: string) {
  return prisma.coupon.findUniqueOrThrow({ where: { id } });
}

export async function createCoupon(
  data: {
    code: string;
    type?: string;
    amount: number;
    maxRedemptions?: number;
    expiresAt?: Date;
    active?: boolean;
  },
  actorId?: string
) {
  const coupon = await prisma.coupon.create({
    data: {
      code: data.code,
      type: data.type ?? "percent",
      amount: data.amount,
      maxRedemptions: data.maxRedemptions,
      expiresAt: data.expiresAt,
      active: data.active ?? true,
    },
  });

  await logAudit({ actorId, action: "create", entity: "Coupon", entityId: coupon.id });
  return coupon;
}

export async function updateCoupon(
  id: string,
  data: {
    code?: string;
    type?: string;
    amount?: number;
    maxRedemptions?: number | null;
    expiresAt?: Date | null;
    active?: boolean;
  },
  actorId?: string
) {
  const coupon = await prisma.coupon.update({
    where: { id },
    data,
  });

  await logAudit({ actorId, action: "update", entity: "Coupon", entityId: id });
  return coupon;
}

export async function deleteCoupon(id: string, actorId?: string) {
  const coupon = await prisma.coupon.delete({ where: { id } });
  await logAudit({ actorId, action: "delete", entity: "Coupon", entityId: id });
  return coupon;
}
