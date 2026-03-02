"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { MediaPicker, type MediaAsset } from "@/components/admin/MediaPicker";
import { makePseudoAssetFromUrl } from "@/lib/media/make-pseudo-asset";
import { toast } from "@/hooks/use-sonner";
import { cn, slugify } from "@/lib/utils";
import type { CaseStudy } from "./case-study.types";

interface CaseStudyFormDialogProps {
  open: boolean;
  onClose: () => void;
  editingStudy: CaseStudy | null;
  onSaved: () => void;
}

export function CaseStudyFormDialog({
  open,
  onClose,
  editingStudy,
  onSaved,
}: CaseStudyFormDialogProps) {
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [formSummary, setFormSummary] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formStatus, setFormStatus] = useState<"draft" | "published" | "scheduled">("draft");
  const [formPublishedAt, setFormPublishedAt] = useState("");
  const [coverAsset, setCoverAsset] = useState<MediaAsset[]>([]);
  const [galleryAssets, setGalleryAssets] = useState<MediaAsset[]>([]);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formMetaTitle, setFormMetaTitle] = useState("");
  const [formMetaDesc, setFormMetaDesc] = useState("");
  const [formOgImage, setFormOgImage] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* Reset form when dialog opens */
  const parseGalleryUrls = (gallery: string | null | undefined): string[] => {
    if (!gallery) return [];
    return gallery
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((u, i, arr) => arr.indexOf(u) === i);
  };

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
    setFormFeatured(study?.featured ?? false);
    setFormMetaTitle(study?.metaTitle ?? "");
    setFormMetaDesc(study?.metaDesc ?? "");
    setFormOgImage(study?.ogImage ?? "");
    const coverUrl = (study?.coverImage ?? "").trim();
    setCoverAsset(coverUrl ? [makePseudoAssetFromUrl(coverUrl)] : []);
    const galleryUrls = parseGalleryUrls(study?.gallery);
    setGalleryAssets(galleryUrls.map(makePseudoAssetFromUrl));
    setSeoOpen(false);
  };

  /* Initialize form when dialog becomes visible (prevOpen pattern) */
  const [prevOpen, setPrevOpen] = useState(false);
  if (open && !prevOpen) {
    resetForm(editingStudy ?? undefined);
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  const handleTitleChange = (value: string) => {
    setFormTitle(value);
    if (!slugManual) setFormSlug(slugify(value));
  };

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
        coverImage: coverAsset[0]?.url ?? null,
        gallery: galleryAssets.length ? galleryAssets.map(a => a.url).join(", ") : null,
        featured: formFeatured,
        metaTitle: formMetaTitle || null,
        metaDesc: formMetaDesc || null,
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
          err?.error != null ? err.error.messages : "Request failed"
        );
      }

      toast({
        title: editingStudy ? "Case study updated" : "Case study created",
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
            <MediaPicker
              label="Cover Image"
              mode="single"
              value={coverAsset}
              onChange={setCoverAsset}
            />
          </div>
          <div>
            <MediaPicker
              label="Gallery"
              mode="multi"
              value={galleryAssets}
              onChange={setGalleryAssets}
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
                value={formMetaDesc}
                onChange={(e) => setFormMetaDesc(e.target.value)}
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
        <Button variant="outline" size="sm" onClick={onClose}>
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
    </AdminDialog>
  );
}
