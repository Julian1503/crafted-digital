"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  FileText,
  Plus,
  GripVertical,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import SortableList, {
  type SortableListItem,
} from "@/components/admin/SortableList";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ContentBlock {
  id: string;
  section: string;
  title: string | null;
  content: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const sectionColors: Record<string, string> = {
  hero: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  cta: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  testimonials:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  highlights:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  services:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  pricing:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  faq: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const sectionOptions = [
  "hero",
  "cta",
  "testimonials",
  "highlights",
  "services",
  "pricing",
  "faq",
] as const;

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
      panelRef.current
        ?.querySelector<HTMLElement>("input,select,textarea")
        ?.focus();
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

export default function ContentPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionFilter, setSectionFilter] = useState("all");

  // Reorder mode
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderItems, setReorderItems] = useState<SortableListItem[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formSection, setFormSection] = useState("hero");
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formActive, setFormActive] = useState(true);

  /* ---------- Fetch blocks ---------- */

  const fetchBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (!res.ok) throw new Error("Failed to load content blocks");
      const data: ContentBlock[] = await res.json();
      setBlocks(data);
    } catch {
      toast({ title: "Failed to load content blocks", variant: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  /* ---------- Filtered blocks ---------- */

  const filtered =
    sectionFilter === "all"
      ? blocks
      : blocks.filter((b) => b.section === sectionFilter);

  /* ---------- Dialog helpers ---------- */

  const resetForm = (block?: ContentBlock) => {
    setFormSection(block?.section ?? "hero");
    setFormTitle(block?.title ?? "");
    setFormContent(block?.content ?? "");
    setFormActive(block?.active ?? true);
  };

  const openCreate = () => {
    setEditingBlock(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (block: ContentBlock) => {
    setEditingBlock(block);
    resetForm(block);
    setDialogOpen(true);
  };

  /* ---------- Submit ---------- */

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        section: formSection,
        title: formTitle || null,
        content: formContent || null,
        active: formActive,
      };

      const url = editingBlock
        ? `/api/admin/content/${editingBlock.id}`
        : "/api/admin/content";
      const method = editingBlock ? "PATCH" : "POST";

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
        title: editingBlock ? "Block updated" : "Block created",
        variant: "success",
      });
      setDialogOpen(false);
      fetchBlocks();
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Something went wrong",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Toggle active ---------- */

  const toggleActive = async (block: ContentBlock) => {
    try {
      const res = await fetch(`/api/admin/content/${block.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !block.active }),
      });
      if (!res.ok) throw new Error();
      toast({
        title: block.active ? "Block deactivated" : "Block activated",
        variant: "success",
      });
      fetchBlocks();
    } catch {
      toast({ title: "Failed to toggle block", variant: "error" });
    }
  };

  /* ---------- Delete ---------- */

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this block?")) return;
    try {
      const res = await fetch(`/api/admin/content/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast({ title: "Block deleted", variant: "success" });
      fetchBlocks();
    } catch {
      toast({ title: "Failed to delete block", variant: "error" });
    }
  };

  /* ---------- Reorder ---------- */

  const enterReorderMode = () => {
    setReorderItems(
      filtered.map((b) => ({ id: b.id, title: b.title || "Untitled" }))
    );
    setReorderMode(true);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      const res = await fetch("/api/admin/content/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: reorderItems.map((i) => i.id),
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Order saved", variant: "success" });
      setReorderMode(false);
      fetchBlocks();
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
          <FileText className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Content Blocks</h1>
        </div>
        <div className="flex gap-2">
          {!reorderMode && (
            <Button size="sm" variant="outline" onClick={enterReorderMode}>
              <GripVertical className="mr-2 size-4" />
              Reorder
            </Button>
          )}
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            Add Block
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Manage content sections for your landing pages
      </p>

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
          {/* Filter */}
          <div className="flex items-center gap-3">
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="h-9 rounded-md border bg-background px-3 text-sm"
            >
              <option value="all">All Sections</option>
              {sectionOptions.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filtered.length === 0 ? (
            <AdminEmptyState
              icon={FileText}
              title="No content blocks found"
              description="Adjust your filters or create a new content block."
              action={{ label: "Add Block", onClick: openCreate }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((block) => (
                <div
                  key={block.id}
                  className="rounded-lg border p-4 space-y-3"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          sectionColors[block.section] ??
                            "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                        )}
                      >
                        {block.section}
                      </span>
                      <span className="truncate font-medium">
                        {block.title || "Untitled"}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => toggleActive(block)}
                        title={block.active ? "Deactivate" : "Activate"}
                      >
                        {block.active ? (
                          <ToggleRight className="size-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="size-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => openEdit(block)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleDelete(block.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Order: {block.sortOrder}</span>
                    <span className="truncate max-w-[60%] text-right">
                      {block.content
                        ? block.content.length > 100
                          ? block.content.slice(0, 100) + "…"
                          : block.content
                        : "No content"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add / Edit dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingBlock ? "Edit Block" : "Add Block"}
        wide
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="block-section"
              className="mb-1 block text-sm font-medium"
            >
              Section
            </label>
            <select
              id="block-section"
              value={formSection}
              onChange={(e) => setFormSection(e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              {sectionOptions.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="block-title"
              className="mb-1 block text-sm font-medium"
            >
              Title
            </label>
            <Input
              id="block-title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Block title (optional)"
            />
          </div>
          <div>
            <label
              htmlFor="block-content"
              className="mb-1 block text-sm font-medium"
            >
              Content
            </label>
            <textarea
              id="block-content"
              rows={8}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="JSON or text content"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="block-active"
              type="checkbox"
              checked={formActive}
              onChange={(e) => setFormActive(e.target.checked)}
              className="size-4 rounded border"
            />
            <label htmlFor="block-active" className="text-sm font-medium">
              Active
            </label>
          </div>
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
              : editingBlock
                ? "Update Block"
                : "Create Block"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
