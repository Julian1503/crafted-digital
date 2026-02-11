"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Image,
  Upload,
  Search,
  Edit,
  Trash2,
  FileVideo,
  FileText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  title: string | null;
  tags: string | null;
  folder: string;
  createdBy: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedMedia {
  data: MediaAsset[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getTypeFilter(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "document";
}

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

export default function MediaPage() {
  const [assets, setAssets] = useState<PaginatedMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [folders, setFolders] = useState<string[]>([]);

  // Upload dialog state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cloudinary upload state
  const [dragActive, setDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, { status: "pending" | "uploading" | "done" | "error"; progress: number; url?: string }>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editFolder, setEditFolder] = useState("");

  /* ---------- Fetch assets ---------- */

  const fetchAssets = useCallback(
    async (p: number, q: string, folder: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: "20",
        });
        if (q) params.set("search", q);
        if (folder && folder !== "all") params.set("folder", folder);

        const res = await fetch(`/api/admin/media?${params}`);
        if (!res.ok) throw new Error("Failed to load media");
        const data: PaginatedMedia = await res.json();
        setAssets(data);
      } catch {
        toast({ title: "Failed to load media", variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media/folders");
      if (!res.ok) return;
      const data: string[] = await res.json();
      setFolders(data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchAssets(page, search, folderFilter);
  }, [page, folderFilter, fetchAssets]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  // Debounced search
  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchAssets(1, value, folderFilter);
    }, 400);
  };

  /* ---------- Filtered assets (client-side type filter) ---------- */

  const filteredAssets =
    assets?.data.filter(
      (a) => typeFilter === "all" || getTypeFilter(a.mimeType) === typeFilter
    ) ?? [];

  /* ---------- Open upload dialog ---------- */

  const openUpload = () => {
    setUploadFiles([]);
    setUploadProgress({});
    setUploadDialogOpen(true);
  };

  /* ---------- Drag & drop handlers ---------- */

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      ["image/png", "image/jpeg", "image/webp"].includes(f.type)
    );
    if (files.length) setUploadFiles((prev) => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter((f) =>
      ["image/png", "image/jpeg", "image/webp"].includes(f.type)
    );
    if (files.length) setUploadFiles((prev) => [...prev, ...files]);
    if (e.target) e.target.value = "";
  };

  const removeUploadFile = (index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- Cloudinary upload ---------- */

  const uploadToCloudinary = async () => {
    if (!uploadFiles.length) return;

    // Get signature
    let signData: { signature: string; timestamp: number; cloudName: string; apiKey: string; folder: string };
    try {
      const signRes = await fetch("/api/admin/media/sign", { method: "POST" });
      if (!signRes.ok) {
        const err = await signRes.json().catch(() => null);
        toast({ title: err?.error || "Failed to get upload signature", variant: "error" });
        return;
      }
      signData = await signRes.json();
    } catch {
      toast({ title: "Failed to get upload signature", variant: "error" });
      return;
    }

    const initialProgress: Record<string, { status: "pending" | "uploading" | "done" | "error"; progress: number }> = {};
    uploadFiles.forEach((f, i) => {
      initialProgress[`${f.name}-${i}`] = { status: "uploading", progress: 0 };
    });
    setUploadProgress(initialProgress);

    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];
      const key = `${file.name}-${i}`;

      try {
        // Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signData.apiKey);
        formData.append("timestamp", String(signData.timestamp));
        formData.append("signature", signData.signature);
        formData.append("folder", signData.folder);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!cloudRes.ok) throw new Error("Cloudinary upload failed");
        const cloudData = await cloudRes.json();

        setUploadProgress((prev) => ({ ...prev, [key]: { status: "uploading", progress: 80 } }));

        // Save to DB
        const dbRes = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: cloudData.secure_url,
            filename: file.name,
            mimeType: file.type,
            size: cloudData.bytes || file.size,
            width: cloudData.width || null,
            height: cloudData.height || null,
            folder: signData.folder,
          }),
        });

        if (!dbRes.ok) throw new Error("Failed to save media record");

        setUploadProgress((prev) => ({ ...prev, [key]: { status: "done", progress: 100, url: cloudData.secure_url } }));
      } catch {
        setUploadProgress((prev) => ({ ...prev, [key]: { status: "error", progress: 0 } }));
      }
    }

    toast({ title: "Upload complete", variant: "success" });
    fetchAssets(page, search, folderFilter);
    fetchFolders();
  };

  /* ---------- Open edit dialog ---------- */

  const openEdit = (asset: MediaAsset) => {
    setEditingAsset(asset);
    setEditAlt(asset.alt ?? "");
    setEditTitle(asset.title ?? "");
    setEditTags(asset.tags ?? "");
    setEditFolder(asset.folder);
    setEditDialogOpen(true);
  };

  /* ---------- Submit edit ---------- */

  const handleEdit = async () => {
    if (!editingAsset) return;

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        alt: editAlt.trim(),
        title: editTitle.trim(),
        tags: editTags.trim(),
        folder: editFolder.trim() || "general",
      };

      const res = await fetch(`/api/admin/media/${editingAsset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          typeof err?.error === "string" ? err.error : "Request failed"
        );
      }

      toast({ title: "Media updated", variant: "success" });
      setEditDialogOpen(false);
      fetchAssets(page, search, folderFilter);
      fetchFolders();
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

  const handleDelete = async (asset: MediaAsset) => {
    if (!window.confirm(`Delete "${asset.filename}"?`)) return;

    try {
      const res = await fetch(`/api/admin/media/${asset.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast({ title: "Media deleted", variant: "success" });
      fetchAssets(page, search, folderFilter);
    } catch {
      toast({ title: "Failed to delete media", variant: "error" });
    }
  };

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
        </div>
        <Button size="sm" onClick={openUpload}>
          <Upload className="mr-2 size-4" />
          Upload Media
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search media…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={folderFilter}
          onChange={(e) => {
            setFolderFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All Folders</option>
          {folders.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredAssets.length === 0 ? (
        <AdminEmptyState
          icon={Image}
          title="No media found"
          description="Adjust your filters or upload new media."
          action={{ label: "Upload Media", onClick: openUpload }}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="group relative overflow-hidden rounded-lg border bg-background transition-colors hover:bg-muted/20"
              >
                {/* Thumbnail */}
                <div className="flex aspect-square items-center justify-center bg-muted/30">
                  {asset.mimeType.startsWith("image/") ? (
                    <img
                      src={asset.url}
                      alt={asset.alt ?? asset.filename}
                      className="size-full object-cover"
                    />
                  ) : asset.mimeType.startsWith("video/") ? (
                    <FileVideo className="size-12 text-muted-foreground" />
                  ) : (
                    <FileText className="size-12 text-muted-foreground" />
                  )}
                </div>

                {/* Info */}
                <div className="p-2">
                  <p className="truncate text-sm font-medium">
                    {asset.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(asset.size)} ·{" "}
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => openEdit(asset)}
                    title="Edit"
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => handleDelete(asset)}
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {assets!.page} of {assets!.totalPages} ({assets!.total} total)
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
                disabled={page >= assets!.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        title="Upload Media"
        wide
      >
        <div className="space-y-4">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
          >
            <Upload className="mb-3 size-10 text-muted-foreground" />
            <p className="mb-1 text-sm font-medium">
              Drag & drop images here
            </p>
            <p className="mb-3 text-xs text-muted-foreground">
              PNG, JPG, JPEG, WEBP accepted
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* File Previews */}
          {uploadFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {uploadFiles.length} file(s) selected
              </p>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {uploadFiles.map((file, i) => {
                  const key = `${file.name}-${i}`;
                  const prog = uploadProgress[key];
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 rounded-md border p-2"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="size-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatSize(file.size)}
                        </p>
                        {prog && (
                          <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                prog.status === "done"
                                  ? "bg-green-500"
                                  : prog.status === "error"
                                    ? "bg-red-500"
                                    : "bg-primary"
                              )}
                              style={{ width: `${prog.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {prog?.status === "done" && (
                          <span className="text-xs text-green-600">✓</span>
                        )}
                        {prog?.status === "error" && (
                          <span className="text-xs text-red-600">✗</span>
                        )}
                        {!prog && (
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => removeUploadFile(i)}
                          >
                            <X className="size-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUploadDialogOpen(false)}
            >
              {Object.values(uploadProgress).some((p) => p.status === "done")
                ? "Close"
                : "Cancel"}
            </Button>
            {uploadFiles.length > 0 &&
              !Object.values(uploadProgress).every((p) => p.status === "done" || p.status === "error") && (
                <Button
                  size="sm"
                  onClick={uploadToCloudinary}
                  disabled={submitting || Object.values(uploadProgress).some((p) => p.status === "uploading")}
                >
                  <Upload className="mr-2 size-4" />
                  Upload {uploadFiles.length} file(s)
                </Button>
              )}
          </div>
        </div>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title="Edit Media"
        wide
      >
        {editingAsset && (
          <div className="space-y-4">
            {/* Preview & info */}
            <div className="flex gap-4">
              <div className="flex size-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
                {editingAsset.mimeType.startsWith("image/") ? (
                  <img
                    src={editingAsset.url}
                    alt={editingAsset.alt ?? editingAsset.filename}
                    className="size-full object-cover"
                  />
                ) : editingAsset.mimeType.startsWith("video/") ? (
                  <FileVideo className="size-10 text-muted-foreground" />
                ) : (
                  <FileText className="size-10 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{editingAsset.filename}</p>
                <p className="text-muted-foreground">{editingAsset.mimeType}</p>
                <p className="text-muted-foreground">{formatSize(editingAsset.size)}</p>
                {editingAsset.width && editingAsset.height && (
                  <p className="text-muted-foreground">
                    {editingAsset.width} × {editingAsset.height}
                  </p>
                )}
              </div>
            </div>

            {/* Editable fields */}
            <div>
              <label htmlFor="edit-alt" className="mb-1 block text-sm font-medium">
                Alt Text
              </label>
              <Input
                id="edit-alt"
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
                placeholder="Descriptive alt text"
              />
            </div>
            <div>
              <label htmlFor="edit-title" className="mb-1 block text-sm font-medium">
                Title
              </label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Media title"
              />
            </div>
            <div>
              <label htmlFor="edit-tags" className="mb-1 block text-sm font-medium">
                Tags
              </label>
              <Input
                id="edit-tags"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div>
              <label htmlFor="edit-folder" className="mb-1 block text-sm font-medium">
                Folder
              </label>
              <Input
                id="edit-folder"
                value={editFolder}
                onChange={(e) => setEditFolder(e.target.value)}
                placeholder="general"
                list="edit-folder-options"
              />
              <datalist id="edit-folder-options">
                {folders.map((f) => (
                  <option key={f} value={f} />
                ))}
              </datalist>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleEdit} disabled={submitting}>
                {submitting ? "Saving…" : "Update Media"}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
