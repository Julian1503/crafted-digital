"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { toast } from "@/hooks/use-sonner";
import type { Lead } from "./lead.types";

interface LeadFormDialogProps {
  open: boolean;
  onClose: () => void;
  editingLead: Lead | null;
  onSaved: () => void;
}

export function LeadFormDialog({
  open,
  onClose,
  editingLead,
  onSaved,
}: LeadFormDialogProps) {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSource, setFormSource] = useState("website");
  const [formMessage, setFormMessage] = useState("");
  const [formStatus, setFormStatus] = useState("new");
  const [formTags, setFormTags] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  /* Reset form when dialog opens */
  const resetForm = (lead?: Lead) => {
    setFormName(lead?.name ?? "");
    setFormEmail(lead?.email ?? "");
    setFormPhone(lead?.phone ?? "");
    setFormSource(lead?.source ?? "website");
    setFormMessage(lead?.message ?? "");
    setFormStatus(lead?.status ?? "new");
    setFormTags(lead?.tags ?? "");
    setFormErrors({});
  };

  /* Initialize form when dialog becomes visible (same prevOpen pattern as BlogFormDialog) */
  const [prevOpen, setPrevOpen] = useState(false);
  if (open && !prevOpen) {
    resetForm(editingLead ?? undefined);
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  const handleSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = "Name is required";
    if (!formEmail.trim()) errors.email = "Email is required";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim() || undefined,
        source: formSource,
        message: formMessage.trim() || undefined,
        tags: formTags.trim() || undefined,
      };
      if (editingLead) {
        body.status = formStatus;
      }

      const url = editingLead
        ? `/api/admin/leads/${editingLead.id}`
        : "/api/admin/leads";
      const method = editingLead ? "PATCH" : "POST";

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
        title: editingLead ? "Lead updated" : "Lead created",
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
      title={editingLead ? "Edit Lead" : "Add Lead"}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="lead-name" className="mb-1 block text-sm font-medium">Name</label>
          <Input
            id="lead-name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Full name"
          />
          {formErrors.name && (
            <p className="mt-1 text-xs text-destructive">{formErrors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="lead-email" className="mb-1 block text-sm font-medium">Email</label>
          <Input
            id="lead-email"
            type="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            placeholder="email@example.com"
          />
          {formErrors.email && (
            <p className="mt-1 text-xs text-destructive">{formErrors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="lead-phone" className="mb-1 block text-sm font-medium">Phone</label>
          <Input
            id="lead-phone"
            value={formPhone}
            onChange={(e) => setFormPhone(e.target.value)}
            placeholder="Phone number"
          />
        </div>
        <div>
          <label htmlFor="lead-source" className="mb-1 block text-sm font-medium">Source</label>
          <select
            id="lead-source"
            value={formSource}
            onChange={(e) => setFormSource(e.target.value)}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="social">Social</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="lead-message" className="mb-1 block text-sm font-medium">Message</label>
          <textarea
            id="lead-message"
            value={formMessage}
            onChange={(e) => setFormMessage(e.target.value)}
            placeholder="Message"
            rows={3}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {editingLead && (
          <div>
            <label htmlFor="lead-status" className="mb-1 block text-sm font-medium">Status</label>
            <select
              id="lead-status"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        )}
        <div>
          <label htmlFor="lead-tags" className="mb-1 block text-sm font-medium">Tags</label>
          <Input
            id="lead-tags"
            value={formTags}
            onChange={(e) => setFormTags(e.target.value)}
            placeholder="Comma-separated tags"
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
              : editingLead
                ? "Update Lead"
                : "Create Lead"}
          </Button>
        </div>
      </div>
    </AdminDialog>
  );
}
