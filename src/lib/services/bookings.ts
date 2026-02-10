import { prisma } from "@/lib/db/prisma";
import { logAudit } from "@/lib/services/audit";

interface BookingPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export async function getBookings(params: BookingPaginationParams = {}) {
  const { page = 1, limit = 20, search, sortBy = "date", sortDir = "desc", status, dateFrom, dateTo } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { deleted: false };
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { customerName: { contains: search } },
      { customerEmail: { contains: search } },
    ];
  }
  if (dateFrom || dateTo) {
    where.date = {
      ...(dateFrom && { gte: dateFrom }),
      ...(dateTo && { lte: dateTo }),
    };
  }

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortDir },
      include: { bookingNotes: { orderBy: { createdAt: "desc" }, take: 1 } },
    }),
    prisma.booking.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getBooking(id: string) {
  return prisma.booking.findUniqueOrThrow({
    where: { id },
    include: {
      bookingNotes: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { id: true, name: true, email: true } } },
      },
    },
  });
}

export async function createBooking(
  data: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    date: Date;
    duration?: number;
    status?: string;
    notes?: string;
  },
  actorId?: string
) {
  const booking = await prisma.booking.create({
    data: {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      date: data.date,
      duration: data.duration,
      status: data.status ?? "pending",
      notes: data.notes,
    },
  });

  await logAudit({ actorId, action: "create", entity: "Booking", entityId: booking.id });
  return booking;
}

export async function updateBooking(
  id: string,
  data: {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    date?: Date;
    duration?: number;
    status?: string;
    notes?: string;
  },
  actorId?: string
) {
  const booking = await prisma.booking.update({
    where: { id },
    data,
  });

  await logAudit({ actorId, action: "update", entity: "Booking", entityId: id });
  return booking;
}

export async function deleteBooking(id: string, actorId?: string) {
  const booking = await prisma.booking.update({
    where: { id },
    data: { deleted: true },
  });
  await logAudit({ actorId, action: "delete", entity: "Booking", entityId: id });
  return booking;
}

export async function addBookingNote(
  data: { bookingId: string; content: string },
  actorId?: string
) {
  const note = await prisma.bookingNote.create({
    data: {
      bookingId: data.bookingId,
      content: data.content,
      authorId: actorId,
    },
    include: { author: { select: { id: true, name: true, email: true } } },
  });

  await logAudit({ actorId, action: "add_note", entity: "Booking", entityId: data.bookingId });
  return note;
}
