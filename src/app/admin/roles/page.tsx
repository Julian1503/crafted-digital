"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Shield, Plus, Edit, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { toast } from "@/hooks/use-sonner";
/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Permission {
  id: string;
  module: string;
  action: string;
}

interface RolePermission {
  permissionId: string;
  permission: Permission;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: RolePermission[];
}

const MODULES = ["content", "crm", "billing", "system"];
const ACTIONS = ["read", "create", "update", "delete"];

/* ------------------------------------------------------------------ */
/*  Dialog                                                             */
/* ------------------------------------------------------------------ */

function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
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
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-xl animate-[dialogIn_0.2s_ease-out_both]"
      >
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Confirm dialog                                                     */
/* ------------------------------------------------------------------ */

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  loading?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-lg border bg-background p-6 shadow-xl animate-[dialogIn_0.2s_ease-out_both]">
        <h2 className="mb-2 text-lg font-semibold">{title}</h2>
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPermIds, setFormPermIds] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ---------- Fetch ---------- */

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        fetch("/api/admin/roles"),
        fetch("/api/admin/permissions"),
      ]);
      if (!rolesRes.ok) throw new Error("Failed to load roles");
      // Permissions may 403 for non-admin
      const rolesData = await rolesRes.json();
      const permsData = permsRes.ok ? await permsRes.json() : [];
      setRoles(rolesData);
      setPermissions(permsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------- Permission helpers ---------- */

  const permByModuleAction = (module: string, action: string) =>
    permissions.find((p) => p.module === module && p.action === action);

  const togglePerm = (id: string) => {
    setFormPermIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ---------- Dialog open ---------- */

  const openCreate = () => {
    setEditingRole(null);
    setFormName("");
    setFormDesc("");
    setFormPermIds([]);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setFormName(role.name);
    setFormDesc(role.description ?? "");
    setFormPermIds(role.permissions.map((rp) => rp.permissionId));
    setFormErrors({});
    setDialogOpen(true);
  };

  /* ---------- Submit ---------- */

  const handleSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = "Role name is required";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        name: formName.trim(),
        description: formDesc.trim() || undefined,
        permissionIds: formPermIds,
      };

      const url = editingRole
        ? `/api/admin/roles/${editingRole.id}`
        : "/api/admin/roles";
      const method = editingRole ? "PATCH" : "POST";

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
        title: editingRole ? "Role updated" : "Role created",
        variant: "success",
      });
      setDialogOpen(false);
      fetchData();
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/roles/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete role");
      toast({ title: "Role deleted", variant: "success" });
      setDeleteTarget(null);
      fetchData();
    } catch {
      toast({ title: "Failed to delete role", variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  /* ---------- Group permissions by module for display ---------- */

  const groupPermissions = (perms: RolePermission[]) => {
    const grouped: Record<string, string[]> = {};
    for (const rp of perms) {
      const mod = rp.permission.module;
      if (!grouped[mod]) grouped[mod] = [];
      grouped[mod].push(rp.permission.action);
    }
    return grouped;
  };

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">
            Roles &amp; Permissions
          </h1>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          Add Role
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : roles.length === 0 ? (
        <AdminEmptyState
          icon={Shield}
          title="No roles yet"
          description="Create a role to manage user access."
          action={{ label: "Add Role", onClick: openCreate }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map((role) => {
            const grouped = groupPermissions(role.permissions);
            return (
              <div
                key={role.id}
                className="rounded-lg border bg-card p-5 shadow-sm"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{role.name}</h3>
                    {role.description && (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => openEdit(role)}
                      title="Edit"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => setDeleteTarget(role)}
                      title="Delete"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {/* Permission badges grouped by module */}
                {Object.keys(grouped).length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No permissions assigned
                  </p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(grouped).map(([mod, actions]) => (
                      <div key={mod}>
                        <span className="text-xs font-medium uppercase text-muted-foreground">
                          {mod}
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {actions.map((action) => (
                            <span
                              key={action}
                              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                            >
                              <Check className="size-3" />
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingRole ? "Edit Role" : "Add Role"}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="role-name" className="mb-1 block text-sm font-medium">Name</label>
            <Input
              id="role-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Editor"
            />
            {formErrors.name && (
              <p className="mt-1 text-xs text-destructive">{formErrors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="role-desc" className="mb-1 block text-sm font-medium">
              Description
            </label>
            <Input
              id="role-desc"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          {/* Permissions grid */}
          {permissions.length > 0 && (
            <div>
              <span className="mb-2 block text-sm font-medium">
                Permissions
              </span>
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="px-3 py-2 text-left font-medium">
                        Module
                      </th>
                      {ACTIONS.map((a) => (
                        <th
                          key={a}
                          className="px-3 py-2 text-center font-medium capitalize"
                        >
                          {a}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MODULES.map((mod) => (
                      <tr key={mod} className="border-b last:border-b-0">
                        <td className="px-3 py-2 font-medium capitalize">
                          {mod}
                        </td>
                        {ACTIONS.map((action) => {
                          const perm = permByModuleAction(mod, action);
                          return (
                            <td key={action} className="px-3 py-2 text-center">
                              {perm ? (
                                <input
                                  type="checkbox"
                                  checked={formPermIds.includes(perm.id)}
                                  onChange={() => togglePerm(perm.id)}
                                  className="size-4 rounded border"
                                />
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
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
                : editingRole
                  ? "Update Role"
                  : "Create Role"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Role"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />

      <style>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
