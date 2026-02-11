import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";

interface LeadPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  status?: string;
  tags?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export async function getLeads(params: LeadPaginationParams = {}) {
  const { page = 1, limit = 20, search, sortBy = "createdAt", sortDir = "desc", status, tags, dateFrom, dateTo } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { deleted: false };
  if (status) where.status = status;
  if (tags) where.tags = { contains: tags };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (dateFrom || dateTo) {
    where.createdAt = {
      ...(dateFrom && { gte: dateFrom }),
      ...(dateTo && { lte: dateTo }),
    };
  }

  const [data, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortDir },
      include: { notes: { orderBy: { createdAt: "desc" }, take: 1 } },
    }),
    prisma.lead.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getLead(id: string) {
  return prisma.lead.findUniqueOrThrow({
    where: { id },
    include: {
      notes: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { id: true, name: true, email: true } } },
      },
    },
  });
}

export async function createLead(
  data: {
    source?: string;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    status?: string;
    tags?: string;
  },
  actorId?: string
) {
  const lead = await prisma.lead.create({
    data: {
      source: data.source ?? "website",
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      status: data.status ?? "new",
      tags: data.tags,
    },
  });

  await logAudit({ actorId, action: "create", entity: "Lead", entityId: lead.id });
  return lead;
}

export async function updateLead(
  id: string,
  data: {
    source?: string;
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    status?: string;
    tags?: string;
  },
  actorId?: string
) {
  const lead = await prisma.lead.update({
    where: { id },
    data,
  });

  await logAudit({ actorId, action: "update", entity: "Lead", entityId: id });
  return lead;
}

export async function deleteLead(id: string, actorId?: string) {
  const lead = await prisma.lead.update({
    where: { id },
    data: { deleted: true },
  });
  await logAudit({ actorId, action: "delete", entity: "Lead", entityId: id });
  return lead;
}

export async function addLeadNote(
  data: { leadId: string; content: string },
  actorId?: string
) {
  const note = await prisma.leadNote.create({
    data: {
      leadId: data.leadId,
      content: data.content,
      authorId: actorId,
    },
    include: { author: { select: { id: true, name: true, email: true } } },
  });

  await logAudit({ actorId, action: "add_note", entity: "Lead", entityId: data.leadId });
  return note;
}

export async function exportLeadsCsv(params: LeadPaginationParams = {}): Promise<string> {
  const { search, status, tags, dateFrom, dateTo } = params;

  const where: Record<string, unknown> = { deleted: false };
  if (status) where.status = status;
  if (tags) where.tags = { contains: tags };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (dateFrom || dateTo) {
    where.createdAt = {
      ...(dateFrom && { gte: dateFrom }),
      ...(dateTo && { lte: dateTo }),
    };
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const header = "ID,Source,Name,Email,Phone,Message,Status,Tags,Created At";
  const rows = leads.map((l: {
    id: string; source: string; name: string; email: string;
    phone: string | null; message: string | null; status: string;
    tags: string | null; createdAt: Date;
  }) =>
    [
      l.id,
      l.source,
      `"${(l.name ?? "").replace(/"/g, '""')}"`,
      l.email,
      l.phone ?? "",
      `"${(l.message ?? "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      l.status,
      l.tags ?? "",
      l.createdAt.toISOString(),
    ].join(",")
  );

  return [header, ...rows].join("\n");
}
