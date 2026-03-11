"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  UserPlus, Search, Download, Edit, Trash2, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import {LEAD_STATUS_BADGE, LeadStatusType} from "@/lib/types/enums";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";
import type { Lead, PaginatedLeads } from "./_components/lead.types";
import { LeadFormDialog } from "./_components/LeadFormDialog";
import { LeadDetailDrawer } from "./_components/LeadDetailDrawer";

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

  // Detail drawer state
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

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
      return fetchLeads(1, value, statusFilter);
    }, 400);
  };

  /* ---------- Fetch lead detail ---------- */

  const refreshDrawerLead = useCallback(async (leadId: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`);
      if (res.ok) {
        const data: Lead = await res.json();
        setDrawerLead(data);
      }
    } catch {
      /* handled by caller */
    }
  }, []);

  const openDrawer = async (lead: Lead) => {
    setDrawerLead(lead);
    setDrawerLoading(true);
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

  const closeDrawer = useCallback(() => {
    setDrawerLead(null);
  }, []);

  /* ---------- Status transition ---------- */

  const handleStatusTransition = useCallback(async (lead: Lead, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast({ title: `Status updated to ${newStatus}`, variant: "success" });
      await fetchLeads(page, search, statusFilter);
      await refreshDrawerLead(lead.id);
    } catch {
      toast({ title: "Failed to update status", variant: "error" });
    }
  }, [fetchLeads, page, search, statusFilter, refreshDrawerLead]);

  const handleNoteAdded = useCallback(() => {
    if (drawerLead) return refreshDrawerLead(drawerLead.id);
  }, [drawerLead, refreshDrawerLead]);

  /* ---------- Open dialog ---------- */

  const openCreate = () => {
    setEditingLead(null);
    setDialogOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setEditingLead(lead);
    setDialogOpen(true);
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
      await fetchLeads(page, search, statusFilter);
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
                          LEAD_STATUS_BADGE[lead.status as LeadStatusType] ?? "bg-gray-100 text-gray-700"
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
      <LeadDetailDrawer
        lead={drawerLead}
        loading={drawerLoading}
        onClose={closeDrawer}
        onStatusChange={handleStatusTransition}
        onNoteAdded={handleNoteAdded}
      />

      {/* Add / Edit Dialog */}
      <LeadFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editingLead={editingLead}
        onSaved={() => fetchLeads(page, search, statusFilter)}
      />
    </div>
  );
}
