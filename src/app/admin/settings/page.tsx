"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Settings,
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { CardSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Lowercase letters/digits separated by dots, e.g. "seo.defaultTitle" */
const SETTING_KEY_PATTERN = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  group: string;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SiteSetting | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<SiteSetting | null>(null);

  // Form fields
  const [formKey, setFormKey] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formGroup, setFormGroup] = useState("general");

  // Inline editing
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineValue, setInlineValue] = useState("");

  // Dirty tracking for bulk save
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());

  /* ---------- Fetch settings ---------- */

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      const data: SiteSetting[] = await res.json();
      setSettings(data);
    } catch {
      toast({ title: "Failed to load settings", variant: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  /* ---------- Derived data ---------- */

  const groups = Array.from(new Set(settings.map((s) => s.group))).sort();

  const filtered = settings.filter((s) => {
    const matchesSearch =
      !search ||
      s.key.toLowerCase().includes(search.toLowerCase()) ||
      s.value.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = activeGroup === "all" || s.group === activeGroup;
    return matchesSearch && matchesGroup;
  });

  const groupedSettings: Record<string, SiteSetting[]> = {};
  for (const s of filtered) {
    if (!groupedSettings[s.group]) groupedSettings[s.group] = [];
    groupedSettings[s.group].push(s);
  }

  const sortedGroupKeys = Object.keys(groupedSettings).sort();

  /* ---------- Search ---------- */

  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // filtering is computed so no fetch needed
    }, 300);
  };

  /* ---------- Dialog helpers ---------- */

  const resetForm = (setting?: SiteSetting) => {
    setFormKey(setting?.key ?? "");
    setFormValue(setting?.value ?? "");
    setFormGroup(setting?.group ?? "general");
  };

  const openCreate = () => {
    setEditingSetting(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (setting: SiteSetting) => {
    setEditingSetting(setting);
    resetForm(setting);
    setDialogOpen(true);
  };

  /* ---------- Key validation ---------- */

  const isValidKey = (key: string) => SETTING_KEY_PATTERN.test(key);

  /* ---------- Submit (create/edit) ---------- */

  const handleSubmit = async () => {
    if (!formKey.trim()) {
      toast({ title: "Key is required", variant: "error" });
      return;
    }
    if (!isValidKey(formKey.trim())) {
      toast({
        title: "Key must be lowercase with dots (e.g. seo.defaultTitle)",
        variant: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = [
        {
          key: formKey.trim(),
          value: formValue,
          group: formGroup.trim() || "general",
        },
      ];

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          typeof err?.error === "string" ? err.error : "Request failed"
        );
      }

      toast({
        title: editingSetting ? "Setting updated" : "Setting created",
        variant: "success",
      });
      setDialogOpen(false);
      fetchSettings();
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Something went wrong",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Inline editing ---------- */

  const startInlineEdit = (setting: SiteSetting) => {
    setInlineEditId(setting.id);
    setInlineValue(setting.value);
  };

  const saveInlineEdit = (setting: SiteSetting) => {
    if (inlineValue !== setting.value) {
      setSettings((prev) =>
        prev.map((s) => (s.id === setting.id ? { ...s, value: inlineValue } : s))
      );
      setDirtyIds((prev) => new Set(prev).add(setting.id));
    }
    setInlineEditId(null);
  };

  const cancelInlineEdit = () => {
    setInlineEditId(null);
  };

  /* ---------- Bulk save ---------- */

  const handleBulkSave = async () => {
    const dirtySettings = settings.filter((s) => dirtyIds.has(s.id));
    if (dirtySettings.length === 0) return;

    setSubmitting(true);
    try {
      const payload = dirtySettings.map((s) => ({
        key: s.key,
        value: s.value,
        group: s.group,
      }));

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      toast({ title: "Settings saved", variant: "success" });
      setDirtyIds(new Set());
      fetchSettings();
    } catch {
      toast({ title: "Failed to save settings", variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Delete ---------- */

  const handleDelete = async (setting: SiteSetting) => {
    try {
      const res = await fetch(`/api/admin/settings/${setting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast({ title: "Setting deleted", variant: "success" });
      setDeleteTarget(null);
      fetchSettings();
    } catch {
      toast({ title: "Failed to delete setting", variant: "error" });
    }
  };

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Settings className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your site configuration
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {dirtyIds.size > 0 && (
            <Button size="sm" onClick={handleBulkSave} disabled={submitting}>
              <Save className="mr-2 size-4" />
              Save Changes ({dirtyIds.size})
            </Button>
          )}
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            New Setting
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search settings…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Group tabs */}
      {groups.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={activeGroup === "all" ? "default" : "outline"}
            onClick={() => setActiveGroup("all")}
          >
            All
          </Button>
          {groups.map((g) => (
            <Button
              key={g}
              size="sm"
              variant={activeGroup === g ? "default" : "outline"}
              onClick={() => setActiveGroup(g)}
            >
              {g}
            </Button>
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && settings.length === 0 && (
        <AdminEmptyState
          icon={FolderOpen}
          title="No settings yet"
          description="Create your first site setting to get started."
          action={{ label: "New Setting", onClick: openCreate }}
        />
      )}

      {/* No results for search/filter */}
      {!loading && settings.length > 0 && filtered.length === 0 && (
        <AdminEmptyState
          icon={Search}
          title="No matching settings"
          description="Try adjusting your search or group filter."
        />
      )}

      {/* Settings grouped by group */}
      {!loading &&
        sortedGroupKeys.map((group) => (
          <div key={group} className="rounded-lg border">
            <div className="border-b bg-muted/30 px-4 py-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {group}
              </h3>
            </div>
            <div className="divide-y">
              {groupedSettings[group].map((setting) => (
                <div
                  key={setting.id}
                  className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
                >
                  {/* Key */}
                  <div className="min-w-0 sm:w-1/3">
                    <code className="text-sm font-mono text-muted-foreground break-all">
                      {setting.key}
                    </code>
                  </div>

                  {/* Value */}
                  <div className="min-w-0 flex-1">
                    {inlineEditId === setting.id ? (
                      <textarea
                        className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={inlineValue}
                        onChange={(e) => setInlineValue(e.target.value)}
                        onBlur={() => saveInlineEdit(setting)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            saveInlineEdit(setting);
                          }
                          if (e.key === "Escape") cancelInlineEdit();
                        }}
                        rows={Math.min(
                          5,
                          Math.max(1, inlineValue.split("\n").length)
                        )}
                        autoFocus
                      />
                    ) : (
                      <button
                        type="button"
                        className={cn(
                          "w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50",
                          dirtyIds.has(setting.id) &&
                            "ring-2 ring-yellow-400/50 bg-yellow-50 dark:bg-yellow-900/10"
                        )}
                        onClick={() => startInlineEdit(setting)}
                        title="Click to edit"
                      >
                        <span className="line-clamp-2 break-all">
                          {setting.value || (
                            <span className="italic text-muted-foreground">
                              (empty)
                            </span>
                          )}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => openEdit(setting)}
                      title="Edit"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => setDeleteTarget(setting)}
                      title="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Create / Edit dialog */}
      <AdminDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingSetting ? "Edit Setting" : "New Setting"}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Key</label>
            <Input
              placeholder="e.g. seo.defaultTitle"
              value={formKey}
              onChange={(e) => setFormKey(e.target.value.toLowerCase())}
              disabled={!!editingSetting}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Lowercase letters and dots only (e.g. seo.defaultTitle)
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Value</label>
            <textarea
              className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Setting value"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Group</label>
            <Input
              placeholder="e.g. general, seo, contact"
              value={formGroup}
              onChange={(e) => setFormGroup(e.target.value.toLowerCase())}
              list="group-suggestions"
            />
            <datalist id="group-suggestions">
              {groups.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? "Saving…"
                : editingSetting
                  ? "Update"
                  : "Create"}
            </Button>
          </div>
        </div>
      </AdminDialog>

      {/* Delete confirmation dialog */}
      <AdminDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Setting"
      >
        <p className="mb-4 text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <code className="font-mono font-semibold text-foreground">
            {deleteTarget?.key}
          </code>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteTarget && handleDelete(deleteTarget)}
          >
            Delete
          </Button>
        </div>
      </AdminDialog>
    </div>
  );
}
