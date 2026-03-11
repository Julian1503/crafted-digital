"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, Upload, X, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";
import {Label} from "@/components/ui/label";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type UploadProvider = "imagekit" | "cloudinary";

export interface MediaAsset {
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
    provider?: string;
    providerFileId?: string;
    providerPath?: string;
    thumbnailUrl?: string;
}

interface PaginatedMedia {
    data: MediaAsset[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/* ------------------------------------------------------------------ */
/* MediaPicker                                                         */
/* ------------------------------------------------------------------ */

type MediaPickerMode = "single" | "multi";

export function MediaPicker({
                                label,
                                mode = "single",
                                value,
                                onChange,
                                placeholder = "Select media…",
                                folderDefault = "crafted-digital",
                                onlyImages = true,
                            }: {
    label: string;
    mode?: MediaPickerMode;
    value: MediaAsset[];
    onChange: (next: MediaAsset[]) => void;
    placeholder?: string;
    folderDefault?: string;
    onlyImages?: boolean;
}) {
    const [open, setOpen] = useState(false);

    // picker data
    const [assets, setAssets] = useState<PaginatedMedia | null>(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // upload
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [uploadProvider, setUploadProvider] = useState<UploadProvider>("imagekit");
    const [uploadFolder, setUploadFolder] = useState(folderDefault);
    const [submitting, setSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selectedIds = useMemo(() => new Set(value.map((v) => v.id)), [value]);

    const fetchAssets = useCallback(async (p: number, q: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(p),
                limit: "20",
            });
            if (q) params.set("search", q);

            const res = await fetch(`/api/admin/media?${params}`);
            if (!res.ok) throw new Error("Failed to load media");
            const data: PaginatedMedia = await res.json();

            const filtered = onlyImages
                ? { ...data, data: data.data.filter((a) => a.mimeType.startsWith("image/")) }
                : data; 

            setAssets(filtered);
        } catch {
            toast({ title: "Failed to load media", variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [onlyImages]);

    useEffect(() => {
        if (!open) return;
        fetchAssets(page, search);
    }, [open, page, fetchAssets]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearch = (val: string) => {
        setSearch(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setPage(1);
            fetchAssets(1, val);
        }, 350);
    };

    const toggleSelect = (asset: MediaAsset) => {
        if (mode === "single") {
            onChange([asset]);
            return;
        }
        if (selectedIds.has(asset.id)) {
            onChange(value.filter((v) => v.id !== asset.id));
        } else {
            onChange([...value, asset]);
        }
    };

    const clearSelection = () => onChange([]);

    const displayValue = useMemo(() => {
        if (value.length === 0) return "";
        if (mode === "single") return value[0]?.filename ?? "";
        return `${value.length} selected`;
    }, [value, mode]);

    /* ---------------- Upload helpers ---------------- */

    const openUpload = () => {
        setUploadFiles([]);
        setUploadProvider("imagekit");
        setUploadFolder(folderDefault);
        setUploadDialogOpen(true);
    };

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

    const uploadSelectedFiles = async () => {
        if (!uploadFiles.length) return;

        setSubmitting(true);
        try {
            const form = new FormData();
            form.append("provider", uploadProvider);
            form.append("folder", uploadFolder.trim() || folderDefault);
            uploadFiles.forEach((f) => form.append("files", f));

            const res = await fetch("/api/admin/media/upload", { method: "POST", body: form });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.error || "Upload failed");
            }

            toast({ title: "Upload complete", variant: "success" });
            setUploadDialogOpen(false);

            // refresh grid to include new items
            setPage(1);
            setSearch("");
            fetchAssets(1, "");
        } catch (e) {
            toast({
                title: e instanceof Error ? e.message : "Upload failed",
                variant: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------------- Render ---------------- */

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium">{label}</label>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className={cn(
                        "flex h-9 w-full items-center justify-between rounded-md border bg-background px-3 text-sm",
                        "hover:bg-muted/20"
                    )}
                >
          <span className={cn("truncate", !displayValue && "text-muted-foreground")}>
            {displayValue || placeholder}
          </span>
                    <span className="ml-2 text-xs text-muted-foreground">Browse</span>
                </button>

                {value.length > 0 && (
                    <Button type="button" variant="outline" size="sm" onClick={clearSelection}>
                        Clear
                    </Button>
                )}
            </div>

            {/* Selected preview (small) */}
            {value.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {value.slice(0, mode === "single" ? 1 : 6).map((v) => (
                        <div key={v.id} className="flex items-center gap-2 rounded-md border p-1 pr-2">
                            <Image
                                src={v.url}
                                alt={v.alt ?? v.filename}
                                width={40}
                                height={40}
                                className="size-10 rounded object-cover"
                            />
                            <div className="min-w-0">
                                <p className="max-w-[220px] truncate text-xs font-medium">{v.filename}</p>
                                <p className="text-[11px] text-muted-foreground">{v.folder}</p>
                            </div>
                            <button
                                type="button"
                                className="ml-1 text-muted-foreground hover:text-foreground"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(value.filter((x) => x.id !== v.id));
                                }}
                                title="Remove"
                            >
                                <X className="size-3" />
                            </button>
                        </div>
                    ))}
                    {mode === "multi" && value.length > 6 && (
                        <div className="flex items-center rounded-md border px-2 text-xs text-muted-foreground">
                            +{value.length - 6} more
                        </div>
                    )}
                </div>
            )}

            {/* Picker Dialog */}
            <AdminDialog
                open={open}
                onClose={() => setOpen(false)}
                title={mode === "single" ? "Select an image" : "Select images"}
                wide
            >
                <div className="space-y-4">
                    {/* top bar */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search media…"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={openUpload}>
                                <Upload className="mr-2 size-4" />
                                Upload
                            </Button>

                            {mode === "multi" && (
                                <div className="flex items-center rounded-md border px-3 text-sm text-muted-foreground">
                                    {value.length} selected
                                </div>
                            )}
                        </div>
                    </div>

                    {/* grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="aspect-square rounded-lg border bg-muted/20" />
                            ))}
                        </div>
                    ) : !assets || assets.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-10 text-center">
                            <ImageIcon className="size-10 text-muted-foreground" />
                            <p className="text-sm font-medium">No media found</p>
                            <p className="text-xs text-muted-foreground">Try a different search or upload.</p>
                            <Button type="button" size="sm" onClick={openUpload}>
                                <Upload className="mr-2 size-4" />
                                Upload
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {assets.data.map((asset) => {
                                    const active = selectedIds.has(asset.id);
                                    return (
                                        <button
                                            key={asset.id}
                                            type="button"
                                            onClick={() => toggleSelect(asset)}
                                            className={cn(
                                                "group relative overflow-hidden rounded-lg border bg-background text-left transition-colors hover:bg-muted/20",
                                                active && "ring-2 ring-primary"
                                            )}
                                        >
                                            <div className="flex aspect-square items-center justify-center bg-muted/30">
                                                <Image
                                                    src={asset.url}
                                                    alt={asset.alt ?? asset.filename}
                                                    fill
                                                    className="object-cover"
                                                />

                                            </div>

                                            <div className="p-2">
                                                <p className="truncate text-xs font-medium">{asset.filename}</p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    {asset.folder}
                                                </p>
                                            </div>

                                            {/* selected badge */}
                                            <div
                                                className={cn(
                                                    "absolute right-2 top-2 flex size-6 items-center justify-center rounded-full border bg-background/90 opacity-0 transition-opacity",
                                                    "group-hover:opacity-100",
                                                    active && "opacity-100"
                                                )}
                                            >
                                                {active && <Check className="size-4 text-primary" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* pagination */}
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Page {assets.page} of {assets.totalPages} ({assets.total} total)
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
                                        disabled={page >= assets.totalPages}
                                        onClick={() => setPage((p) => p + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>

                            {/* single mode action row */}
                            {mode === "single" && (
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                                        Close
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => setOpen(false)}
                                        disabled={value.length === 0}
                                    >
                                        Use selected
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </AdminDialog>

            {/* Upload Dialog (embedded) */}
            <AdminDialog
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                title="Upload Media"
                wide
            >
                <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Label className="block text-sm font-medium">Provider</Label>
                            <select
                                value={uploadProvider}
                                onChange={(e) => setUploadProvider(e.target.value as UploadProvider)}
                                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                                disabled={submitting}
                            >
                                <option value="imagekit">ImageKit</option>
                                <option value="cloudinary">Cloudinary</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <Label className="block text-sm font-medium">Folder</Label>
                            <Input
                                value={uploadFolder}
                                onChange={(e) => setUploadFolder(e.target.value)}
                                placeholder={folderDefault}
                                disabled={submitting}
                            />
                            <p className="text-xs text-muted-foreground">
                                Upload folder used for new assets.
                            </p>
                        </div>
                    </div>

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
                        <p className="mb-1 text-sm font-medium">Drag & drop images here</p>
                        <p className="mb-3 text-xs text-muted-foreground">PNG, JPG, JPEG, WEBP accepted</p>
                        <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
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

                    {uploadFiles.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">{uploadFiles.length} file(s) selected</p>
                            <div className="max-h-48 space-y-2 overflow-y-auto">
                                {uploadFiles.map((file, i) => (
                                    <div key={`${file.name}-${i}`} className="flex items-center gap-3 rounded-md border p-2">
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            width={40}
                                            height={40}
                                            unoptimized
                                            className="size-10 rounded object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
                                        </div>
                                        <Button size="icon-sm" variant="ghost" onClick={() => removeUploadFile(i)}>
                                            <X className="size-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => setUploadDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={uploadSelectedFiles} disabled={submitting || uploadFiles.length === 0}>
                            <Upload className="mr-2 size-4" />
                            {submitting ? "Uploading…" : `Upload ${uploadFiles.length} file(s)`}
                        </Button>
                    </div>
                </div>
            </AdminDialog>
        </div>
    );
}