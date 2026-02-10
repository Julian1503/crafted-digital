import { prisma } from "@/lib/db/prisma";

export async function getDashboardMetrics() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    publishedPosts,
    draftPosts,
    scheduledPosts,
    totalCaseStudies,
    leadsThisMonth,
    upcomingBookings,
  ] = await Promise.all([
    prisma.blogPost.count({ where: { status: "published", deleted: false } }),
    prisma.blogPost.count({ where: { status: "draft", deleted: false } }),
    prisma.blogPost.count({ where: { status: "scheduled", deleted: false } }),
    prisma.caseStudy.count({ where: { deleted: false } }),
    prisma.lead.count({ where: { deleted: false, createdAt: { gte: startOfMonth } } }),
    prisma.booking.count({ where: { deleted: false, date: { gte: now }, status: { not: "cancelled" } } }),
  ]);

  return {
    publishedPosts,
    draftPosts,
    scheduledPosts,
    totalCaseStudies,
    leadsThisMonth,
    upcomingBookings,
  };
}

export async function getRecentActivity(limit: number = 20) {
  return prisma.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { actor: { select: { id: true, name: true, email: true } } },
  });
}
