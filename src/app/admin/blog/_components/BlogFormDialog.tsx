"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { MediaPicker, type MediaAsset } from "@/components/admin/MediaPicker";
import { makePseudoAssetFromUrl } from "@/lib/media/make-pseudo-asset";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";
import { generateSlug } from "@/lib/utils/slug";
import type { BlogPost } from "./blog.types";

interface BlogFormDialogProps {
  open: boolean;
  onClose: () => void;
  editingPost: BlogPost | null;
  onSaved: () => void;
}

export function BlogFormDialog({
  open,
  onClose,
  editingPost,
  onSaved,
}: BlogFormDialogProps) {
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [formContent, setFormContent] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formStatus, setFormStatus] = useState<"draft" | "published" | "scheduled">("draft");
  const [formPublishedAt, setFormPublishedAt] = useState("");
  const [coverAsset, setCoverAsset] = useState<MediaAsset[]>([]);
  const [formTags, setFormTags] = useState("");
  const [formCategories, setFormCategories] = useState("");
  const [formMetaTitle, setFormMetaTitle] = useState("");
  const [formMetaDesc, setFormMetaDesc] = useState("");
  const [formOgImage, setFormOgImage] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* Reset form when dialog opens */
  const resetForm = (post?: BlogPost) => {
    setFormTitle(post?.title ?? "");
    setFormSlug(post?.slug ?? "");
    setSlugManual(!!post);
    setFormContent(post?.content ?? "");
    setFormExcerpt(post?.excerpt ?? "");
    setFormStatus(post?.status ?? "draft");
    setFormPublishedAt(post?.publishedAt ? post.publishedAt.substring(0, 10) : "");
    const coverUrl = (post?.coverImage ?? "").trim();
    setCoverAsset(coverUrl ? [makePseudoAssetFromUrl(coverUrl)] : []);
    setFormTags(post?.tags ?? "");
    setFormCategories(post?.categories ?? "");
    setFormMetaTitle(post?.metaTitle ?? "");
    setFormMetaDesc(post?.metaDesc ?? "");
    setFormOgImage(post?.ogImage ?? "");
    setSeoOpen(false);
  };

  /* Initialize form when dialog becomes visible */
  // We use a simple effect-like pattern: compare open state
  const [prevOpen, setPrevOpen] = useState(false);
  if (open && !prevOpen) {
    resetForm(editingPost ?? undefined);
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  const handleTitleChange = (value: string) => {
    setFormTitle(value);
    if (!slugManual) setFormSlug(generateSlug(value));
  };

  const handleSubmit = async (asDraft?: boolean) => {
    if (!formTitle.trim()) {
      toast({ title: "Title is required", variant: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        title: formTitle.trim(),
        slug: formSlug || generateSlug(formTitle),
        content: formContent,
        excerpt: formExcerpt,
        status: asDraft ? "draft" : formStatus,
        publishedAt: formPublishedAt || null,
        coverImage: coverAsset[0]?.url ?? null,
        tags: formTags || null,
        categories: formCategories || null,
        metaTitle: formMetaTitle || null,
        metaDesc: formMetaDesc || null,
        ogImage: formOgImage || null,
      };

      const url = editingPost
        ? `/api/admin/blog/${editingPost.id}`
        : "/api/admin/blog";
      const method = editingPost ? "PATCH" : "POST";

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
        title: editingPost ? "Post updated" : "Post created",
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
      title={editingPost ? "Edit Post" : "New Post"}
      wide
    >
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column – 2/3 */}
        <div className="space-y-4 md:col-span-2">
          <div>
            <label htmlFor="post-title" className="mb-1 block text-sm font-medium">
              Title
            </label>
            <Input
              id="post-title"
              value={formTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title"
            />
          </div>
          <div>
            <label htmlFor="post-slug" className="mb-1 block text-sm font-medium">
              Slug
            </label>
            <Input
              id="post-slug"
              value={formSlug}
              onChange={(e) => {
                setSlugManual(true);
                setFormSlug(e.target.value);
              }}
              placeholder="auto-generated-slug"
            />
          </div>
          <div>
            <label htmlFor="post-content" className="mb-1 block text-sm font-medium">
              Content
            </label>
            <textarea
              id="post-content"
              rows={12}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Write your content…"
            />
          </div>
          <div>
            <label htmlFor="post-excerpt" className="mb-1 block text-sm font-medium">
              Excerpt
            </label>
            <textarea
              id="post-excerpt"
              rows={3}
              value={formExcerpt}
              onChange={(e) => setFormExcerpt(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Short description…"
            />
          </div>
        </div>

        {/* Right column – 1/3 */}
        <div className="space-y-4">
          <div>
            <label htmlFor="post-status" className="mb-1 block text-sm font-medium">
              Status
            </label>
            <select
              id="post-status"
              value={formStatus}
              onChange={(e) =>
                setFormStatus(e.target.value as "draft" | "published" | "scheduled")
              }
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <div>
            <label htmlFor="post-published" className="mb-1 block text-sm font-medium">
              Published At
            </label>
            <Input
              id="post-published"
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
            <label htmlFor="post-tags" className="mb-1 block text-sm font-medium">
              Tags
            </label>
            <Input
              id="post-tags"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
            />
          </div>
          <div>
            <label htmlFor="post-categories" className="mb-1 block text-sm font-medium">
              Categories
            </label>
            <Input
              id="post-categories"
              value={formCategories}
              onChange={(e) => setFormCategories(e.target.value)}
              placeholder="cat1, cat2"
            />
          </div>
          <div>
            <span className="mb-1 block text-sm font-medium">Author</span>
            <p className="text-sm text-muted-foreground">
              {editingPost?.author?.name ?? "Current user"}
            </p>
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
              <label htmlFor="post-meta-title" className="mb-1 block text-sm font-medium">
                Meta Title
              </label>
              <Input
                id="post-meta-title"
                value={formMetaTitle}
                onChange={(e) => setFormMetaTitle(e.target.value)}
                placeholder="SEO title"
              />
            </div>
            <div>
              <label htmlFor="post-meta-desc" className="mb-1 block text-sm font-medium">
                Meta Description
              </label>
              <textarea
                id="post-meta-desc"
                rows={2}
                value={formMetaDesc}
                onChange={(e) => setFormMetaDesc(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="SEO description"
              />
            </div>
            <div>
              <label htmlFor="post-og" className="mb-1 block text-sm font-medium">
                OG Image URL
              </label>
              <Input
                id="post-og"
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
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleSubmit(true)}
          disabled={submitting}
        >
          Save as Draft
        </Button>
        <Button size="sm" onClick={() => handleSubmit()} disabled={submitting}>
          {submitting
            ? "Saving…"
            : editingPost
              ? "Update Post"
              : "Publish"}
        </Button>
      </div>
    </AdminDialog>
  );
}
