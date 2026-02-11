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
  Filter,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import SortableList, {
  type SortableListItem,
} from "@/components/admin/SortableList";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
  status: "draft" | "published" | "scheduled";
  featured: boolean;
  publishedAt: string | null;
  coverImage: string | null;
  gallery: string | null;
  author: string | null;
  sortOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedCaseStudies {
  data: CaseStudy[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

const statusBadge: Record<string, string> = {
  published:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  draft:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  scheduled:
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
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderItems, setReorderItems] = useState<SortableListItem[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [formSummary, setFormSummary] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formStatus, setFormStatus] = useState<
    "draft" | "published" | "scheduled"
  >("draft");
  const [formPublishedAt, setFormPublishedAt] = useState("");
  const [formCoverImage, setFormCoverImage] = useState("");
  const [formGallery, setFormGallery] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formMetaTitle, setFormMetaTitle] = useState("");
  const [formMetaDescription, setFormMetaDescription] = useState("");
  const [formOgImage, setFormOgImage] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);

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

  const resetForm = (study?: CaseStudy) => {
    setFormTitle(study?.title ?? "");
    setFormSlug(study?.slug ?? "");
    setSlugManual(!!study);
    setFormSummary(study?.summary ?? "");
    setFormBody(study?.body ?? "");
    setFormStatus(study?.status ?? "draft");
    setFormPublishedAt(
      study?.publishedAt ? study.publishedAt.substring(0, 10) : ""
    );
    setFormCoverImage(study?.coverImage ?? "");
    setFormGallery(study?.gallery ?? "");
    setFormFeatured(study?.featured ?? false);
    setFormMetaTitle(study?.metaTitle ?? "");
    setFormMetaDescription(study?.metaDescription ?? "");
    setFormOgImage(study?.ogImage ?? "");
    setSeoOpen(false);
  };

  const openCreate = () => {
    setEditingStudy(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (study: CaseStudy) => {
    setEditingStudy(study);
    resetForm(study);
    setDialogOpen(true);
  };

  /* ---------- Auto-slug ---------- */

  const handleTitleChange = (value: string) => {
    setFormTitle(value);
    if (!slugManual) setFormSlug(slugify(value));
  };

  /* ---------- Submit ---------- */

  const handleSubmit = async () => {
    if (!formTitle.trim()) {
      toast({ title: "Title is required", variant: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        title: formTitle.trim(),
        slug: formSlug || slugify(formTitle),
        summary: formSummary || null,
        body: formBody || null,
        status: formStatus,
        publishedAt: formPublishedAt || null,
        coverImage: formCoverImage || null,
        gallery: formGallery || null,
        featured: formFeatured,
        metaTitle: formMetaTitle || null,
        metaDescription: formMetaDescription || null,
        ogImage: formOgImage || null,
      };

      const url = editingStudy
        ? `/api/admin/case-studies/${editingStudy.id}`
        : "/api/admin/case-studies";
      const method = editingStudy ? "PATCH" : "POST";

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
        title: editingStudy ? "Case study updated" : "Case study created",
        variant: "success",
      });
      setDialogOpen(false);
      fetchStudies(page, search, statusFilter, featuredFilter);
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
    setReorderItems(
      studies.data.map((s) => ({ id: s.id, title: s.title }))
    );
    setReorderMode(true);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      const res = await fetch("/api/admin/case-studies/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: reorderItems.map((i) => i.id),
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Order saved", variant: "success" });
      setReorderMode(false);
      fetchStudies(page, search, statusFilter, featuredFilter);
    } catch {
      toast({ title: "Failed to save order", variant: "error" });
    } finally {
      setSavingOrder(false);
    }
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
          {!reorderMode && (
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
      {reorderMode ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Drag items to reorder, then save.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setReorderMode(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={saveOrder} disabled={savingOrder}>
                <Save className="mr-2 size-4" />
                {savingOrder ? "Saving…" : "Save Order"}
              </Button>
            </div>
          </div>
          <SortableList items={reorderItems} onReorder={setReorderItems} />
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
                        Sort Order
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {studies.data.map((study) => (
                      <tr
                        key={study.id}
                        className="border-b transition-colors hover:bg-muted/20 last:border-b-0"
                      >
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
                              statusBadge[study.status]
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
                          {study.author ?? "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-center text-muted-foreground">
                          {study.sortOrder}
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
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingStudy ? "Edit Case Study" : "New Case Study"}
        wide
      >
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left column – 2/3 */}
          <div className="space-y-4 md:col-span-2">
            <div>
              <label htmlFor="cs-title" className="mb-1 block text-sm font-medium">
                Title
              </label>
              <Input
                id="cs-title"
                value={formTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Case study title"
              />
            </div>
            <div>
              <label htmlFor="cs-slug" className="mb-1 block text-sm font-medium">
                Slug
              </label>
              <Input
                id="cs-slug"
                value={formSlug}
                onChange={(e) => {
                  setSlugManual(true);
                  setFormSlug(e.target.value);
                }}
                placeholder="auto-generated-slug"
              />
            </div>
            <div>
              <label htmlFor="cs-summary" className="mb-1 block text-sm font-medium">
                Summary
              </label>
              <textarea
                id="cs-summary"
                rows={3}
                value={formSummary}
                onChange={(e) => setFormSummary(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Brief summary…"
              />
            </div>
            <div>
              <label htmlFor="cs-body" className="mb-1 block text-sm font-medium">
                Body
              </label>
              <textarea
                id="cs-body"
                rows={12}
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Full case study content…"
              />
            </div>
          </div>

          {/* Right column – 1/3 */}
          <div className="space-y-4">
            <div>
              <label htmlFor="cs-status" className="mb-1 block text-sm font-medium">
                Status
              </label>
              <select
                id="cs-status"
                value={formStatus}
                onChange={(e) =>
                  setFormStatus(
                    e.target.value as "draft" | "published" | "scheduled"
                  )
                }
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div>
              <label htmlFor="cs-published" className="mb-1 block text-sm font-medium">
                Published At
              </label>
              <Input
                id="cs-published"
                type="date"
                value={formPublishedAt}
                onChange={(e) => setFormPublishedAt(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="cs-cover" className="mb-1 block text-sm font-medium">
                Cover Image URL
              </label>
              <Input
                id="cs-cover"
                value={formCoverImage}
                onChange={(e) => setFormCoverImage(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div>
              <label htmlFor="cs-gallery" className="mb-1 block text-sm font-medium">
                Gallery
              </label>
              <Input
                id="cs-gallery"
                value={formGallery}
                onChange={(e) => setFormGallery(e.target.value)}
                placeholder="url1, url2, url3"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="cs-featured"
                type="checkbox"
                checked={formFeatured}
                onChange={(e) => setFormFeatured(e.target.checked)}
                className="size-4 rounded border"
              />
              <label htmlFor="cs-featured" className="text-sm font-medium">
                Featured
              </label>
            </div>
          </div>
        </div>

        {/* SEO section */}
        <div className="mt-6 rounded-md border">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
            onClick={() => setSeoOpen(!seoOpen)}
          >
            <span>SEO Settings</span>
            <Filter
              className={cn(
                "size-4 transition-transform",
                seoOpen && "rotate-180"
              )}
            />
          </button>
          {seoOpen && (
            <div className="space-y-4 border-t px-4 py-4">
              <div>
                <label htmlFor="cs-meta-title" className="mb-1 block text-sm font-medium">
                  Meta Title
                </label>
                <Input
                  id="cs-meta-title"
                  value={formMetaTitle}
                  onChange={(e) => setFormMetaTitle(e.target.value)}
                  placeholder="SEO title"
                />
              </div>
              <div>
                <label htmlFor="cs-meta-desc" className="mb-1 block text-sm font-medium">
                  Meta Description
                </label>
                <textarea
                  id="cs-meta-desc"
                  rows={2}
                  value={formMetaDescription}
                  onChange={(e) => setFormMetaDescription(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="SEO description"
                />
              </div>
              <div>
                <label htmlFor="cs-og" className="mb-1 block text-sm font-medium">
                  OG Image URL
                </label>
                <Input
                  id="cs-og"
                  value={formOgImage}
                  onChange={(e) => setFormOgImage(e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
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
              : editingStudy
                ? "Update Case Study"
                : "Create Case Study"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}