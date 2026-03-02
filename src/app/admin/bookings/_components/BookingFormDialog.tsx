"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { toast } from "@/hooks/use-sonner";
import type { Booking } from "./booking.types";

interface BookingFormDialogProps {
  open: boolean;
  onClose: () => void;
  editingBooking: Booking | null;
  onSaved: () => void;
}

export function BookingFormDialog({
  open,
  onClose,
  editingBooking,
  onSaved,
}: BookingFormDialogProps) {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formDuration, setFormDuration] = useState("60");
  const [formStatus, setFormStatus] = useState("pending");
  const [formNotes, setFormNotes] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  /* Reset form when dialog opens */
  const resetForm = (booking?: Booking) => {
    setFormName(booking?.customerName ?? "");
    setFormEmail(booking?.customerEmail ?? "");
    setFormPhone(booking?.customerPhone ?? "");
    setFormDate(
      booking?.date
        ? new Date(booking.date).toISOString().slice(0, 16)
        : ""
    );
    setFormDuration(booking ? String(booking.duration) : "60");
    setFormStatus(booking?.status ?? "pending");
    setFormNotes(booking?.notes ?? "");
    setFormErrors({});
  };

  /* Initialize form when dialog becomes visible (prevOpen pattern) */
  const [prevOpen, setPrevOpen] = useState(false);
  if (open && !prevOpen) {
    resetForm(editingBooking ?? undefined);
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

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
      onClose();
      onSaved();
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Something went wrong",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminDialog
      open={open}
      onClose={onClose}
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
            onClick={onClose}
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
    </AdminDialog>
  );
}
