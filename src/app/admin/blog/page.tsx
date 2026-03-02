"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  GripVertical,
  Copy,
  Eye,
  Save,
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
import { STATUS_BADGE } from "@/lib/constants";
import { BlogFormDialog } from "./_components/BlogFormDialog";
import type { BlogPost, PaginatedPosts } from "./_components/blog.types";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BlogPage() {
  const [posts, setPosts] = useState<PaginatedPosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published" | "scheduled"
  >("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "title">(
    "createdAt"
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Reorder mode
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderItems, setReorderItems] = useState<SortableListItem[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);
  const reorderSnapshotRef = useRef<SortableListItem[]>([]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  /* ---------- Fetch posts ---------- */

  const fetchPosts = useCallback(
    async (
      p: number,
      q: string,
      status: string,
      sort: string
    ) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: "20",
          sortBy: sort,
        });
        if (q) params.set("search", q);
        if (status !== "all") params.set("status", status);

        const res = await fetch(`/api/admin/blog?${params}`);
        if (!res.ok) throw new Error("Failed to load posts");
        const data: PaginatedPosts = await res.json();
        setPosts(data);
      } catch {
        toast({ title: "Failed to load posts", variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPosts(page, search, statusFilter, sortBy);
  }, [page, statusFilter, sortBy, fetchPosts]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchPosts(1, value, statusFilter, sortBy);
    }, 400);
  };

  /* ---------- Dialog helpers ---------- */

  const openCreate = () => {
    setEditingPost(null);
    setDialogOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setDialogOpen(true);
  };

  /* ---------- Delete ---------- */

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Post deleted", variant: "success" });
      fetchPosts(page, search, statusFilter, sortBy);
    } catch {
      toast({ title: "Failed to delete post", variant: "error" });
    }
  };

  /* ---------- Duplicate ---------- */

  const handleDuplicate = async (post: BlogPost) => {
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${post.title} (Copy)`,
          slug: `${post.slug}-copy`,
          content: post.content,
          excerpt: post.excerpt,
          status: "draft",
          tags: post.tags,
          categories: post.categories,
          coverImage: post.coverImage,
          metaTitle: post.metaTitle,
          metaDesc: post.metaDesc,
          ogImage: post.ogImage,
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Post duplicated as draft", variant: "success" });
      fetchPosts(page, search, statusFilter, sortBy);
    } catch {
      toast({ title: "Failed to duplicate post", variant: "error" });
    }
  };

  /* ---------- Bulk actions ---------- */

  const toggleSelectAll = () => {
    if (!posts) return;
    if (selectedIds.size === posts.data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(posts.data.map((p) => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkAction = async (action: "publish" | "unpublish" | "delete") => {
    if (selectedIds.size === 0) return;
    try {
      const ids = Array.from(selectedIds);
      const promises = ids.map((id) => {
        if (action === "delete") {
          return fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
        }
        return fetch(`/api/admin/blog/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: action === "publish" ? "published" : "draft",
          }),
        });
      });
      await Promise.all(promises);
      toast({
        title: `${ids.length} post(s) ${action === "delete" ? "deleted" : action === "publish" ? "published" : "unpublished"}`,
        variant: "success",
      });
      setSelectedIds(new Set());
      fetchPosts(page, search, statusFilter, sortBy);
    } catch {
      toast({ title: "Bulk action failed", variant: "error" });
    }
  };

  /* ---------- Reorder ---------- */

  const enterReorderMode = () => {
    if (!posts) return;
    const items = posts.data.map((p) => ({
      id: p.id,
      title: p.title,
      sortOrder: p.sortOrder,
    }));
    setReorderItems(items);
    reorderSnapshotRef.current = [...items];
    setReorderMode(true);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      const snapshot = reorderSnapshotRef.current;
      const originalSortOrder = new Map(snapshot.map((i) => [i.id, i.sortOrder]));
      const effectiveOrder = new Map<string, number>(originalSortOrder);
      const currentIds = reorderItems.map((i) => i.id);
      const snapshotIds = snapshot.map((i) => i.id);

      for (let i = 0; i < currentIds.length; i++) {
        const id = currentIds[i];
        if (snapshotIds[i] === id) continue;

        const prevId = i > 0 ? currentIds[i - 1] : null;
        const nextId = i < currentIds.length - 1 ? currentIds[i + 1] : null;

        const prevOrder = prevId ? (effectiveOrder.get(prevId) ?? 0) : 0;
        const nextOrder = nextId
            ? (effectiveOrder.get(nextId) ?? prevOrder + 2000)
            : prevOrder + 2000;

        const newOrder = (prevOrder + nextOrder) / 2;
        effectiveOrder.set(id, newOrder);
      }

      const changes = currentIds
          .filter((id) => {
            const orig = originalSortOrder.get(id) ?? 0;
            const next = effectiveOrder.get(id) ?? 0;
            return Math.abs(orig - next) > 0.0001;
          })
          .map((id) => ({ id, sortOrder: effectiveOrder.get(id)! }));

      if (changes.length === 0) {
        setReorderMode(false);
        return;
      }

      const res = await fetch("/api/admin/blog/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: changes }),
      });
      if (!res.ok) throw new Error();

      toast({ title: "Order saved", variant: "success" });
      setReorderMode(false);
      fetchPosts(page, search, statusFilter, sortBy);
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
          <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
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
            New Post
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
                placeholder="Search posts…"
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
                    e.target.value as "all" | "draft" | "published" | "scheduled"
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
                value={sortBy}
                onChange={(e) => {
                  setSortBy(
                    e.target.value as "createdAt" | "updatedAt" | "title"
                  );
                  setPage(1);
                }}
                className="h-9 rounded-md border bg-background px-3 text-sm"
              >
                <option value="createdAt">Sort: Created</option>
                <option value="updatedAt">Sort: Updated</option>
                <option value="title">Sort: Title</option>
              </select>
            </div>
          </div>

          {/* Bulk actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-4 py-2">
              <span className="text-sm font-medium">
                {selectedIds.size} selected
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkAction("publish")}
              >
                <Eye className="mr-1 size-3" />
                Publish Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkAction("unpublish")}
              >
                Unpublish Selected
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => bulkAction("delete")}
              >
                <Trash2 className="mr-1 size-3" />
                Delete Selected
              </Button>
            </div>
          )}

          {/* Table */}
          {loading ? (
            <TableSkeleton rows={5} columns={7} />
          ) : !posts || posts.data.length === 0 ? (
            <AdminEmptyState
              icon={BookOpen}
              title="No posts found"
              description="Adjust your filters or create a new post."
              action={{ label: "New Post", onClick: openCreate }}
            />
          ) : (
            <>
              <div className="w-full overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30 text-left">
                      <th className="whitespace-nowrap px-4 py-3">
                      </th>
                      <th className="whitespace-nowrap px-4 py-3">
                        <input
                          type="checkbox"
                          checked={
                            posts.data.length > 0 &&
                            selectedIds.size === posts.data.length
                          }
                          onChange={toggleSelectAll}
                          className="size-4 rounded border"
                        />
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        Title
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        Status
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        Author
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        Published
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.data.map((post, index) => (
                      <tr
                        key={post.id}
                        className="border-b transition-colors hover:bg-muted/20 last:border-b-0"
                      >

                        <td className="px-4 py-3">
                          {index+1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(post.id)}
                            onChange={() => toggleSelect(post.id)}
                            className="size-4 rounded border"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="font-medium">{post.title}</span>
                            <span className="block text-xs text-muted-foreground">
                              /{post.slug}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className={cn(
                              "inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                              STATUS_BADGE[post.status]
                            )}
                          >
                            {post.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                          {post.author?.name ?? "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex gap-1">
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => openEdit(post)}
                              title="Edit"
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => handleDuplicate(post)}
                              title="Duplicate"
                            >
                              <Copy className="size-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => handleDelete(post.id)}
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
                  Page {posts.page} of {posts.totalPages} ({posts.total} total)
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
                    disabled={page >= posts.totalPages}
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
      <BlogFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editingPost={editingPost}
        onSaved={() => fetchPosts(page, search, statusFilter, sortBy)}
      />
    </div>
  );
}
