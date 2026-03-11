"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  GripVertical,
  Star,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import SortableList from "@/components/admin/SortableList";
import { toast } from "@/hooks/use-sonner";
import { useReorder } from "@/hooks/use-reorder";
import { cn } from "@/lib/utils";
import { CONTENT_STATUS_BADGE } from "@/lib/types/enums";
import { CaseStudyFormDialog } from "./_components/CaseStudyFormDialog";
import type { CaseStudy, PaginatedCaseStudies } from "./_components/case-study.types";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CaseStudiesPage() {
  const [studies, setStudies] = useState<PaginatedCaseStudies | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published" | "scheduled"
  >("all");
  const [featuredFilter, setFeaturedFilter] = useState<
    "all" | "featured" | "not-featured"
  >("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Reorder mode
  const reorder = useReorder({
    endpoint: "/api/admin/case-studies/reorder",
    mode: "fractional",
    onSaved: () => fetchStudies(page, search, statusFilter, featuredFilter),
  });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null);

  /* ---------- Fetch ---------- */

  const fetchStudies = useCallback(
    async (p: number, q: string, status: string, featured: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: "20",
        });
        if (q) params.set("search", q);
        if (status !== "all") params.set("status", status);
        if (featured === "featured") params.set("featured", "true");
        if (featured === "not-featured") params.set("featured", "false");

        const res = await fetch(`/api/admin/case-studies?${params}`);
        if (!res.ok) throw new Error("Failed to load case studies");
        const data: PaginatedCaseStudies = await res.json();
        setStudies(data);
      } catch {
        toast({ title: "Failed to load case studies", variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchStudies(page, search, statusFilter, featuredFilter);
  }, [page, statusFilter, featuredFilter, fetchStudies]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchStudies(1, value, statusFilter, featuredFilter);
    }, 400);
  };

  /* ---------- Dialog helpers ---------- */

  const openCreate = () => {
    setEditingStudy(null);
    setDialogOpen(true);
  };

  const openEdit = (study: CaseStudy) => {
    setEditingStudy(study);
    setDialogOpen(true);
  };

  /* ---------- Delete ---------- */

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/case-studies/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast({ title: "Case study deleted", variant: "success" });
      fetchStudies(page, search, statusFilter, featuredFilter);
    } catch {
      toast({ title: "Failed to delete case study", variant: "error" });
    }
  };

  /* ---------- Toggle featured ---------- */

  const toggleFeatured = async (study: CaseStudy) => {
    try {
      const res = await fetch(
        `/api/admin/case-studies/${study.id}/featured`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ featured: !study.featured }),
        }
      );
      if (!res.ok) throw new Error();
      toast({
        title: study.featured ? "Removed from featured" : "Marked as featured",
        variant: "success",
      });
      fetchStudies(page, search, statusFilter, featuredFilter);
    } catch {
      toast({ title: "Failed to update featured status", variant: "error" });
    }
  };

  /* ---------- Reorder ---------- */

  const enterReorderMode = () => {
    if (!studies) return;
    reorder.enterReorderMode(
      studies.data.map((s) => ({ id: s.id, title: s.title, sortOrder: s.sortOrder }))
    );
  };

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Case Studies</h1>
        </div>
        <div className="flex gap-2">
          {!reorder.reorderMode && (
            <Button size="sm" variant="outline" onClick={enterReorderMode}>
              <GripVertical className="mr-2 size-4" />
              Reorder Mode
            </Button>
          )}
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            New Case Study
          </Button>
        </div>
      </div>

      {/* Reorder mode */}
      {reorder.reorderMode ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Drag items to reorder, then save.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={reorder.cancelReorder}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={reorder.saveOrder} disabled={reorder.savingOrder}>
                <Save className="mr-2 size-4" />
                {reorder.savingOrder ? "Saving…" : "Save Order"}
              </Button>
            </div>
          </div>
          <SortableList items={reorder.reorderItems} onReorder={reorder.setReorderItems} />
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search case studies…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(
                    e.target.value as
                      | "all"
                      | "draft"
                      | "published"
                      | "scheduled"
                  );
                  setPage(1);
                }}
                className="h-9 rounded-md border bg-background px-3 text-sm"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <select
                value={featuredFilter}
                onChange={(e) => {
                  setFeaturedFilter(
                    e.target.value as "all" | "featured" | "not-featured"
                  );
                  setPage(1);
                }}
                className="h-9 rounded-md border bg-background px-3 text-sm"
              >
                <option value="all">All</option>
                <option value="featured">Featured</option>
                <option value="not-featured">Not Featured</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <TableSkeleton rows={5} columns={7} />
          ) : !studies || studies.data.length === 0 ? (
            <AdminEmptyState
              icon={BookOpen}
              title="No case studies found"
              description="Adjust your filters or create a new case study."
              action={{ label: "New Case Study", onClick: openCreate }}
            />
          ) : (
            <>
              <div className="w-full overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30 text-left">
                      <th className="whitespace-nowrap px-4 py-3">
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        Title
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        Status
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        Featured
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        Author
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {studies.data.map((study, index) => (
                      <tr
                        key={study.id}
                        className="border-b transition-colors hover:bg-muted/20 last:border-b-0"
                      >
                        <td className="px-4 py-3">
                          {index+1}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="font-medium">{study.title}</span>
                            <span className="block text-xs text-muted-foreground">
                              /{study.slug}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className={cn(
                              "inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                              CONTENT_STATUS_BADGE[study.status]
                            )}
                          >
                            {study.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <button
                            type="button"
                            onClick={() => toggleFeatured(study)}
                            title={
                              study.featured
                                ? "Remove from featured"
                                : "Mark as featured"
                            }
                          >
                            <Star
                              className={cn(
                                "size-5 transition-colors",
                                study.featured
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground hover:text-yellow-400"
                              )}
                            />
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                          {study.author?.name ?? "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex gap-1">
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => openEdit(study)}
                              title="Edit"
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => handleDelete(study.id)}
                              title="Delete"
                            >
                              <Trash2 className="size-4 text-destructive" />
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
                  Page {studies.page} of {studies.totalPages} ({studies.total}{" "}
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
                    disabled={page >= studies.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Create / Edit Dialog */}
      <CaseStudyFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editingStudy={editingStudy}
        onSaved={() => fetchStudies(page, search, statusFilter, featuredFilter)}
      />
    </div>
  );
}