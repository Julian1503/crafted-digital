"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Calendar, Plus, Search, Edit, Trash2, Eye, X, MessageSquare, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  date: string;
  duration: number;
  status: string;
  notes: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedBookings {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ------------------------------------------------------------------ */
/*  Status helpers                                                     */
/* ------------------------------------------------------------------ */

const statusColors: Record<string, string> = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  completed:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

/* ------------------------------------------------------------------ */
/*  Dialog                                                             */
/* ------------------------------------------------------------------ */

function Dialog({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const timer = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("input")?.focus();
    }, 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={cn(
          "w-full rounded-lg border bg-background p-6 shadow-xl animate-[dialogIn_0.2s_ease-out_both]",
          wide ? "max-w-3xl" : "max-w-lg"
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button size="icon-sm" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

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
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formDuration, setFormDuration] = useState("60");
  const [formStatus, setFormStatus] = useState("pending");
  const [formNotes, setFormNotes] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Detail dialog state
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);

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

  const openDetail = async (booking: Booking) => {
    setDetailBooking(booking);
    setDetailLoading(true);
    setNoteContent("");
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`);
      if (!res.ok) throw new Error();
      const data: Booking = await res.json();
      setDetailBooking(data);
    } catch {
      toast({ title: "Failed to load booking details", variant: "error" });
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setDetailBooking(null);
  };

  /* ---------- Add note ---------- */

  const handleAddNote = async () => {
    if (!detailBooking || !noteContent.trim()) return;
    setAddingNote(true);
    try {
      const res = await fetch(`/api/admin/bookings/${detailBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: detailBooking.notes
            ? `${detailBooking.notes}\n\n[${new Date().toLocaleString()}]\n${noteContent.trim()}`
            : `[${new Date().toLocaleString()}]\n${noteContent.trim()}`,
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Note added", variant: "success" });
      setNoteContent("");
      // Refresh detail
      const detailRes = await fetch(
        `/api/admin/bookings/${detailBooking.id}`
      );
      if (detailRes.ok) {
        const data: Booking = await detailRes.json();
        setDetailBooking(data);
      }
    } catch {
      toast({ title: "Failed to add note", variant: "error" });
    } finally {
      setAddingNote(false);
    }
  };

  /* ---------- Open create / edit dialog ---------- */

  const openCreate = () => {
    setEditingBooking(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormDate("");
    setFormDuration("60");
    setFormStatus("pending");
    setFormNotes("");
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setFormName(booking.customerName);
    setFormEmail(booking.customerEmail);
    setFormPhone(booking.customerPhone ?? "");
    // Convert ISO string to datetime-local value
    setFormDate(
      booking.date
        ? new Date(booking.date).toISOString().slice(0, 16)
        : ""
    );
    setFormDuration(String(booking.duration));
    setFormStatus(booking.status);
    setFormNotes(booking.notes ?? "");
    setFormErrors({});
    setDialogOpen(true);
  };

  /* ---------- Submit create / edit ---------- */

  const handleSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = "Customer name is required";
    if (!formEmail.trim()) errors.email = "Email is required";
    if (!formDate) errors.date = "Date and time are required";
    if (!formDuration || Number(formDuration) <= 0)
      errors.duration = "Duration must be greater than 0";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        customerName: formName.trim(),
        customerEmail: formEmail.trim(),
        customerPhone: formPhone.trim() || undefined,
        date: new Date(formDate).toISOString(),
        duration: Number(formDuration),
        status: formStatus,
        notes: formNotes.trim() || undefined,
      };

      const url = editingBooking
        ? `/api/admin/bookings/${editingBooking.id}`
        : "/api/admin/bookings";
      const method = editingBooking ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          typeof err?.error === "string" ? err.error : "Request failed"
        );
      }

      toast({
        title: editingBooking ? "Booking updated" : "Booking created",
        variant: "success",
      });
      setDialogOpen(false);
      fetchBookings(page, search, statusFilter);
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Something went wrong",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
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

  /* ---------- Parse notes into entries ---------- */

  const parseNotes = (raw: string | null) => {
    if (!raw) return [];
    // Split on timestamps like [1/1/2025, 12:00:00 PM]
    const parts = raw.split(/(?=\[[\d/,: APMapm]+\])/);
    return parts
      .map((part) => part.trim())
      .filter(Boolean)
      .reverse();
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
                          statusColors[booking.status] ??
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

      {/* View / Detail Dialog */}
      <Dialog
        open={!!detailBooking}
        onClose={closeDetail}
        title="Booking Details"
        wide
      >
        {detailLoading ? (
          <TableSkeleton rows={3} columns={2} />
        ) : detailBooking ? (
          <div className="space-y-6">
            {/* Booking Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Details
              </h3>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="font-medium">Customer</dt>
                <dd>{detailBooking.customerName}</dd>
                <dt className="font-medium">Email</dt>
                <dd>{detailBooking.customerEmail}</dd>
                <dt className="font-medium">Phone</dt>
                <dd>{detailBooking.customerPhone ?? "—"}</dd>
                <dt className="font-medium">Date / Time</dt>
                <dd>{formatDateTime(detailBooking.date)}</dd>
                <dt className="font-medium">Duration</dt>
                <dd className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {formatDuration(detailBooking.duration)}
                </dd>
              </dl>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Status
              </h3>
              <span
                className={cn(
                  "inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                  statusColors[detailBooking.status] ??
                    "bg-gray-100 text-gray-700"
                )}
              >
                {detailBooking.status}
              </span>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Notes
              </h3>
              {parseNotes(detailBooking.notes).length > 0 ? (
                <div className="space-y-3">
                  {parseNotes(detailBooking.notes).map((entry, i) => (
                    <div
                      key={i}
                      className="rounded-md border bg-muted/20 p-3 text-sm whitespace-pre-wrap"
                    >
                      {entry}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No notes yet.</p>
              )}
            </div>

            {/* Add Note */}
            <div className="space-y-2 border-t pt-4">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add a note…"
                rows={3}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={addingNote || !noteContent.trim()}
              >
                <MessageSquare className="mr-2 size-4" />
                {addingNote ? "Adding…" : "Add Note"}
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingBooking ? "Edit Booking" : "New Booking"}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="booking-name" className="mb-1 block text-sm font-medium">
              Customer Name
            </label>
            <Input
              id="booking-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Full name"
            />
            {formErrors.name && (
              <p className="mt-1 text-xs text-destructive">{formErrors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="booking-email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <Input
              id="booking-email"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="email@example.com"
            />
            {formErrors.email && (
              <p className="mt-1 text-xs text-destructive">
                {formErrors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="booking-phone" className="mb-1 block text-sm font-medium">
              Phone
            </label>
            <Input
              id="booking-phone"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="Phone number"
            />
          </div>
          <div>
            <label htmlFor="booking-date" className="mb-1 block text-sm font-medium">
              Date &amp; Time
            </label>
            <input
              id="booking-date"
              type="datetime-local"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {formErrors.date && (
              <p className="mt-1 text-xs text-destructive">{formErrors.date}</p>
            )}
          </div>
          <div>
            <label htmlFor="booking-duration" className="mb-1 block text-sm font-medium">
              Duration (minutes)
            </label>
            <Input
              id="booking-duration"
              type="number"
              min={1}
              value={formDuration}
              onChange={(e) => setFormDuration(e.target.value)}
              placeholder="60"
            />
            {formErrors.duration && (
              <p className="mt-1 text-xs text-destructive">
                {formErrors.duration}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="booking-status" className="mb-1 block text-sm font-medium">
              Status
            </label>
            <select
              id="booking-status"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label htmlFor="booking-notes" className="mb-1 block text-sm font-medium">
              Notes
            </label>
            <textarea
              id="booking-notes"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Optional notes…"
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>
              {submitting
                ? "Saving…"
                : editingBooking
                  ? "Update Booking"
                  : "Create Booking"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
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
      </Dialog>
    </div>
  );
}
