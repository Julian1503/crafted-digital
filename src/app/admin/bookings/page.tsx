"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Calendar, Plus, Search, Edit, Trash2, Eye, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";
import { BOOKING_STATUS_COLORS } from "@/lib/constants";
import { BookingFormDialog } from "./_components/BookingFormDialog";
import { BookingDetailDrawer } from "./_components/BookingDetailDrawer";
import type { Booking, PaginatedBookings } from "./_components/booking.types";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BookingsPage() {
  const [bookings, setBookings] = useState<PaginatedBookings | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Create / Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Detail drawer state
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Delete confirmation dialog state
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ---------- Fetch bookings ---------- */

  const fetchBookings = useCallback(
    async (p: number, q: string, status: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: "20",
        });
        if (q) params.set("search", q);
        if (status !== "all") params.set("status", status);

        const res = await fetch(`/api/admin/bookings?${params}`);
        if (!res.ok) throw new Error("Failed to load bookings");
        const data: PaginatedBookings = await res.json();
        setBookings(data);
      } catch {
        toast({ title: "Failed to load bookings", variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchBookings(page, search, statusFilter);
  }, [page, statusFilter, fetchBookings]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchBookings(1, value, statusFilter);
    }, 400);
  };

  /* ---------- Fetch booking detail ---------- */

  const refreshDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`);
      if (!res.ok) throw new Error();
      const data: Booking = await res.json();
      setDetailBooking(data);
    } catch {
      toast({ title: "Failed to load booking details", variant: "error" });
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const openDetail = async (booking: Booking) => {
    setDetailBooking(booking);
    refreshDetail(booking.id);
  };

  const closeDetail = () => {
    setDetailBooking(null);
  };

  /* ---------- Open create / edit dialog ---------- */

  const openCreate = () => {
    setEditingBooking(null);
    setDialogOpen(true);
  };

  const openEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setDialogOpen(true);
  };

  /* ---------- Delete (soft) ---------- */

  const confirmDelete = (booking: Booking) => {
    setDeleteTarget(booking);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/bookings/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast({ title: "Booking deleted", variant: "success" });
      setDeleteTarget(null);
      fetchBookings(page, search, statusFilter);
    } catch {
      toast({ title: "Failed to delete booking", variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  /* ---------- Filter by date (client-side) ---------- */

  const filteredBookings = bookings?.data.filter((booking) => {
    if (dateFrom && new Date(booking.date) < new Date(dateFrom)) return false;
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (new Date(booking.date) > to) return false;
    }
    return true;
  });

  /* ---------- Helpers ---------- */

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  };

  /* ---------- Handle status change from drawer ---------- */

  const handleStatusChange = async (booking: Booking, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Status updated", variant: "success" });
      refreshDetail(booking.id);
      fetchBookings(page, search, statusFilter);
    } catch {
      toast({ title: "Failed to update status", variant: "error" });
    }
  };

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          New Booking
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-9 rounded-md border bg-background px-3 text-sm"
          aria-label="From date"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="h-9 rounded-md border bg-background px-3 text-sm"
          aria-label="To date"
        />
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={7} />
      ) : !bookings || (filteredBookings && filteredBookings.length === 0) ? (
        <AdminEmptyState
          icon={Calendar}
          title="No bookings found"
          description="Adjust your filters or create a new booking."
          action={{ label: "New Booking", onClick: openCreate }}
        />
      ) : (
        <>
          <div className="w-full overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left">
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Customer Name
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Email
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Phone
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Date / Time
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Duration
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings?.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b transition-colors hover:bg-muted/20 last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium">
                      {booking.customerName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {booking.customerEmail}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {booking.customerPhone ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDateTime(booking.date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Clock className="size-3.5" />
                        {formatDuration(booking.duration)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                          BOOKING_STATUS_COLORS[booking.status] ??
                            "bg-gray-100 text-gray-700"
                        )}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => openDetail(booking)}
                          title="View"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => openEdit(booking)}
                          title="Edit"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => confirmDelete(booking)}
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {bookings.page} of {bookings.totalPages} ({bookings.total}{" "}
              total)
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= bookings.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Detail Drawer */}
      <BookingDetailDrawer
        booking={detailBooking}
        loading={detailLoading}
        onClose={closeDetail}
        onStatusChange={handleStatusChange}
        onNoteAdded={() => {
          if (detailBooking) refreshDetail(detailBooking.id);
        }}
      />

      {/* Create / Edit Dialog */}
      <BookingFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editingBooking={editingBooking}
        onSaved={() => fetchBookings(page, search, statusFilter)}
      />

      {/* Delete Confirmation Dialog */}
      <AdminDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Booking"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete the booking for{" "}
            <span className="font-medium text-foreground">
              {deleteTarget?.customerName}
            </span>
            ? This is a soft delete and can be restored by an administrator.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </div>
      </AdminDialog>
    </div>
  );
}
