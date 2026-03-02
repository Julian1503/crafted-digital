"use client";

import { useEffect, useState } from "react";
import { X, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import { BOOKING_STATUS_COLORS } from "@/lib/constants";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";
import type { Booking } from "./booking.types";

interface BookingDetailDrawerProps {
  booking: Booking | null;
  loading: boolean;
  onClose: () => void;
  onStatusChange: (booking: Booking, newStatus: string) => void;
  onNoteAdded: () => void;
}

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

const parseNotes = (raw: string | null) => {
  if (!raw) return [];
  // Split on timestamps like [1/1/2025, 12:00:00 PM]
  const parts = raw.split(/(?=\[[\d/,: APMapm]+\])/);
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .reverse();
};

const statusTransitions: Record<string, { label: string; next: string }> = {
  pending: { label: "Confirm", next: "confirmed" },
  confirmed: { label: "Mark Completed", next: "completed" },
};

export function BookingDetailDrawer({
  booking,
  loading,
  onClose,
  onStatusChange,
  onNoteAdded,
}: BookingDetailDrawerProps) {
  const [noteContent, setNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  // Reset note content when booking changes
  useEffect(() => {
    setNoteContent("");
  }, [booking?.id]);

  // Close drawer on escape
  useEffect(() => {
    if (!booking) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [booking, onClose]);

  const handleAddNote = async () => {
    if (!booking || !noteContent.trim()) return;
    setAddingNote(true);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: booking.notes
            ? `${booking.notes}\n\n[${new Date().toLocaleString()}]\n${noteContent.trim()}`
            : `[${new Date().toLocaleString()}]\n${noteContent.trim()}`,
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Note added", variant: "success" });
      setNoteContent("");
      onNoteAdded();
    } catch {
      toast({ title: "Failed to add note", variant: "error" });
    } finally {
      setAddingNote(false);
    }
  };

  if (!booking) return null;

  return (
    <>
      {/* Backdrop */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col border-l bg-background shadow-xl animate-[slideIn_0.3s_ease-out_both]">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">{booking.customerName}</h2>
          <Button size="icon-sm" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {loading ? (
            <TableSkeleton rows={3} columns={2} />
          ) : (
            <>
              {/* Booking Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Details
                </h3>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                  <dt className="font-medium">Customer</dt>
                  <dd>{booking.customerName}</dd>
                  <dt className="font-medium">Email</dt>
                  <dd>{booking.customerEmail}</dd>
                  <dt className="font-medium">Phone</dt>
                  <dd>{booking.customerPhone ?? "—"}</dd>
                  <dt className="font-medium">Date / Time</dt>
                  <dd>{formatDateTime(booking.date)}</dd>
                  <dt className="font-medium">Duration</dt>
                  <dd className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {formatDuration(booking.duration)}
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
                    BOOKING_STATUS_COLORS[booking.status] ??
                      "bg-gray-100 text-gray-700"
                  )}
                >
                  {booking.status}
                </span>
                {statusTransitions[booking.status] && (
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onStatusChange(
                          booking,
                          statusTransitions[booking.status].next
                        )
                      }
                    >
                      {statusTransitions[booking.status].label}
                    </Button>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Notes
                </h3>
                {parseNotes(booking.notes).length > 0 ? (
                  <div className="space-y-3">
                    {parseNotes(booking.notes).map((entry, i) => (
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
            </>
          )}
        </div>

        {/* Add Note */}
        <div className="border-t px-6 py-4 space-y-2">
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
    </>
  );
}
