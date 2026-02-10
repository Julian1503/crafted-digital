"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  UserPlus, Search, Download, Edit, Trash2, Eye, MessageSquare, X, ArrowRight,
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

interface LeadNote {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string | null; email: string } | null;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  message: string | null;
  status: string;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
  notes?: LeadNote[];
}

interface PaginatedLeads {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ------------------------------------------------------------------ */
/*  Status helpers                                                     */
/* ------------------------------------------------------------------ */

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  contacted: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  qualified: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  won: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusTransitions: Record<string, { label: string; next: string }> = {
  new: { label: "Mark as Contacted", next: "contacted" },
  contacted: { label: "Mark as Qualified", next: "qualified" },
  qualified: { label: "Mark as Won", next: "won" },
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

export default function LeadsPage() {
  const [leads, setLeads] = useState<PaginatedLeads | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSource, setFormSource] = useState("website");
  const [formMessage, setFormMessage] = useState("");
  const [formStatus, setFormStatus] = useState("new");
  const [formTags, setFormTags] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Detail drawer state
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  /* ---------- Fetch leads ---------- */

  const fetchLeads = useCallback(
    async (p: number, q: string, status: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: "20",
        });
        if (q) params.set("search", q);
        if (status !== "all") params.set("status", status);

        const res = await fetch(`/api/admin/leads?${params}`);
        if (!res.ok) throw new Error("Failed to load leads");
        const data: PaginatedLeads = await res.json();
        setLeads(data);
      } catch {
        toast({ title: "Failed to load leads", variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchLeads(page, search, statusFilter);
  }, [page, statusFilter, fetchLeads]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchLeads(1, value, statusFilter);
    }, 400);
  };

  /* ---------- Fetch lead detail ---------- */

  const openDrawer = async (lead: Lead) => {
    setDrawerLead(lead);
    setDrawerLoading(true);
    setNoteContent("");
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`);
      if (!res.ok) throw new Error();
      const data: Lead = await res.json();
      setDrawerLead(data);
    } catch {
      toast({ title: "Failed to load lead details", variant: "error" });
    } finally {
      setDrawerLoading(false);
    }
  };

  const closeDrawer = () => {
    setDrawerLead(null);
  };

  // Close drawer on escape
  useEffect(() => {
    if (!drawerLead) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerLead]);

  /* ---------- Add note ---------- */

  const handleAddNote = async () => {
    if (!drawerLead || !noteContent.trim()) return;
    setAddingNote(true);
    try {
      const res = await fetch("/api/admin/leads/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: drawerLead.id, content: noteContent.trim() }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Note added", variant: "success" });
      setNoteContent("");
      // Refresh drawer
      const detailRes = await fetch(`/api/admin/leads/${drawerLead.id}`);
      if (detailRes.ok) {
        const data: Lead = await detailRes.json();
        setDrawerLead(data);
      }
    } catch {
      toast({ title: "Failed to add note", variant: "error" });
    } finally {
      setAddingNote(false);
    }
  };

  /* ---------- Status transition ---------- */

  const handleStatusTransition = async (lead: Lead, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast({ title: `Status updated to ${newStatus}`, variant: "success" });
      fetchLeads(page, search, statusFilter);
      // Refresh drawer if open
      if (drawerLead?.id === lead.id) {
        const detailRes = await fetch(`/api/admin/leads/${lead.id}`);
        if (detailRes.ok) {
          const data: Lead = await detailRes.json();
          setDrawerLead(data);
        }
      }
    } catch {
      toast({ title: "Failed to update status", variant: "error" });
    }
  };

  /* ---------- Open dialog ---------- */

  const openCreate = () => {
    setEditingLead(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormSource("website");
    setFormMessage("");
    setFormStatus("new");
    setFormTags("");
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormName(lead.name);
    setFormEmail(lead.email);
    setFormPhone(lead.phone ?? "");
    setFormSource(lead.source);
    setFormMessage(lead.message ?? "");
    setFormStatus(lead.status);
    setFormTags(lead.tags ?? "");
    setFormErrors({});
    setDialogOpen(true);
  };

  /* ---------- Submit ---------- */

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
      setDialogOpen(false);
      fetchLeads(page, search, statusFilter);
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Something went wrong",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Delete ---------- */

  const handleDelete = async (lead: Lead) => {
    if (!window.confirm(`Delete lead "${lead.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast({ title: "Lead deleted", variant: "success" });
      fetchLeads(page, search, statusFilter);
    } catch {
      toast({ title: "Failed to delete lead", variant: "error" });
    }
  };

  /* ---------- Export CSV ---------- */

  const handleExport = async () => {
    try {
      const res = await fetch("/api/admin/leads/export");
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-export-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "CSV exported", variant: "success" });
    } catch {
      toast({ title: "Export failed", variant: "error" });
    }
  };

  /* ---------- Filter by date (client-side) ---------- */

  const filteredLeads = leads?.data.filter((lead) => {
    if (dateFrom && new Date(lead.createdAt) < new Date(dateFrom)) return false;
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (new Date(lead.createdAt) > to) return false;
    }
    return true;
  });

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserPlus className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="mr-2 size-4" />
            Export CSV
          </Button>
          <Button size="sm" onClick={openCreate}>
            <UserPlus className="mr-2 size-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name or email…"
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
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-9 rounded-md border bg-background px-3 text-sm"
          placeholder="From"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="h-9 rounded-md border bg-background px-3 text-sm"
          placeholder="To"
        />
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={7} />
      ) : !leads || (filteredLeads && filteredLeads.length === 0) ? (
        <AdminEmptyState
          icon={UserPlus}
          title="No leads found"
          description="Adjust your filters or add a new lead."
          action={{ label: "Add Lead", onClick: openCreate }}
        />
      ) : (
        <>
          <div className="w-full overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left">
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Name</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Email</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Phone</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Source</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Created</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads?.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b transition-colors hover:bg-muted/20 last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium">
                      {lead.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{lead.email}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {lead.phone ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 capitalize">
                      {lead.source}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                          statusColors[lead.status] ?? "bg-gray-100 text-gray-700"
                        )}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => openDrawer(lead)}
                          title="View"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => openEdit(lead)}
                          title="Edit"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleDelete(lead)}
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
              Page {leads.page} of {leads.totalPages} ({leads.total} total)
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
                disabled={page >= leads.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Lead Detail Drawer */}
      {drawerLead && (
        <>
          {/* Backdrop */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={closeDrawer}
          />
          {/* Panel */}
          <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col border-l bg-background shadow-xl animate-[slideIn_0.3s_ease-out_both]">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold">{drawerLead.name}</h2>
              <Button size="icon-sm" variant="ghost" onClick={closeDrawer}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {drawerLoading ? (
                <TableSkeleton rows={3} columns={2} />
              ) : (
                <>
                  {/* Lead Info */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Details</h3>
                    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                      <dt className="font-medium">Name</dt>
                      <dd>{drawerLead.name}</dd>
                      <dt className="font-medium">Email</dt>
                      <dd>{drawerLead.email}</dd>
                      <dt className="font-medium">Phone</dt>
                      <dd>{drawerLead.phone ?? "—"}</dd>
                      <dt className="font-medium">Source</dt>
                      <dd className="capitalize">{drawerLead.source}</dd>
                      {drawerLead.message && (
                        <>
                          <dt className="font-medium">Message</dt>
                          <dd className="whitespace-pre-wrap">{drawerLead.message}</dd>
                        </>
                      )}
                    </dl>
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <span
                      className={cn(
                        "inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                        statusColors[drawerLead.status] ?? "bg-gray-100 text-gray-700"
                      )}
                    >
                      {drawerLead.status}
                    </span>
                    {statusTransitions[drawerLead.status] && (
                      <div className="mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusTransition(
                              drawerLead,
                              statusTransitions[drawerLead.status].next
                            )
                          }
                        >
                          <ArrowRight className="mr-2 size-4" />
                          {statusTransitions[drawerLead.status].label}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                    {drawerLead.notes && drawerLead.notes.length > 0 ? (
                      <div className="space-y-3">
                        {[...drawerLead.notes]
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                          )
                          .map((note) => (
                            <div
                              key={note.id}
                              className="rounded-md border bg-muted/20 p-3 text-sm"
                            >
                              <p className="whitespace-pre-wrap">{note.content}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {note.author?.name ?? note.author?.email ?? "System"} ·{" "}
                                {new Date(note.createdAt).toLocaleString()}
                              </p>
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
      )}

      {/* Add / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
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
              onClick={() => setDialogOpen(false)}
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
      </Dialog>

      <style>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
