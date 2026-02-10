"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Users,
  Plus,
  Search,
  Edit,
  ToggleLeft,
  ToggleRight,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  active: boolean;
  createdAt: string;
  roleAssigns: { role: Role }[];
}

interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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
    // Focus first input
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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function UsersPage() {
  const [users, setUsers] = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formRoleIds, setFormRoleIds] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [allRoles, setAllRoles] = useState<Role[]>([]);

  /* ---------- Fetch users ---------- */

  const fetchUsers = useCallback(
    async (p: number, q: string, status: "all" | "active" | "inactive") => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: "20",
        });
        if (q) params.set("search", q);
        if (status === "active") params.set("active", "true");
        if (status === "inactive") params.set("active", "false");

        const res = await fetch(`/api/admin/users?${params}`);
        if (!res.ok) throw new Error("Failed to load users");
        const data: PaginatedUsers = await res.json();
        setUsers(data);
      } catch {
        toast({ title: "Failed to load users", variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers(page, search, statusFilter);
  }, [page, statusFilter, fetchUsers]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchUsers(1, value, statusFilter);
    }, 400);
  };

  /* ---------- Fetch roles for dialog ---------- */

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/admin/roles");
      if (!res.ok) return;
      const data = await res.json();
      setAllRoles(data.map((r: { id: string; name: string }) => ({ id: r.id, name: r.name })));
    } catch {
      /* ignore */
    }
  };

  /* ---------- Open dialog ---------- */

  const openCreate = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormActive(true);
    setFormRoleIds([]);
    setFormErrors({});
    fetchRoles();
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormName(user.name ?? "");
    setFormEmail(user.email);
    setFormPassword("");
    setFormActive(user.active);
    setFormRoleIds(user.roleAssigns.map((ra) => ra.role.id));
    setFormErrors({});
    fetchRoles();
    setDialogOpen(true);
  };

  /* ---------- Submit ---------- */

  const handleSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = "Name is required";
    if (!formEmail.trim()) errors.email = "Email is required";
    if (!editingUser && !formPassword) errors.password = "Password is required";
    if (formPassword && formPassword.length < 8)
      errors.password = "Password must be at least 8 characters";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        name: formName.trim(),
        email: formEmail.trim(),
        active: formActive,
        roleIds: formRoleIds,
      };
      if (formPassword) body.password = formPassword;

      const url = editingUser
        ? `/api/admin/users/${editingUser.id}`
        : "/api/admin/users";
      const method = editingUser ? "PATCH" : "POST";

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
        title: editingUser ? "User updated" : "User created",
        variant: "success",
      });
      setDialogOpen(false);
      fetchUsers(page, search, statusFilter);
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

  const handleToggle = async (user: User) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active }),
      });
      if (!res.ok) throw new Error();
      toast({
        title: `User ${user.active ? "deactivated" : "activated"}`,
        variant: "success",
      });
      fetchUsers(page, search, statusFilter);
    } catch {
      toast({ title: "Failed to update user", variant: "error" });
    }
  };

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as "all" | "active" | "inactive");
            setPage(1);
          }}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : !users || users.data.length === 0 ? (
        <AdminEmptyState
          icon={Users}
          title="No users found"
          description="Adjust your filters or add a new user."
          action={{ label: "Add User", onClick: openCreate }}
        />
      ) : (
        <>
          <div className="w-full overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left">
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Name</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Email</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Roles</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Created</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.data.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b transition-colors hover:bg-muted/20 last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium">
                      {user.name ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {user.roleAssigns.length === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          user.roleAssigns.map((ra) => (
                            <span
                              key={ra.role.id}
                              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                            >
                              <Shield className="size-3" />
                              {ra.role.name}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                          user.active
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => openEdit(user)}
                          title="Edit"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleToggle(user)}
                          title={user.active ? "Deactivate" : "Activate"}
                        >
                          {user.active ? (
                            <ToggleRight className="size-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="size-4 text-muted-foreground" />
                          )}
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
              Page {users.page} of {users.totalPages} ({users.total} total)
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
                disabled={page >= users.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Add / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingUser ? "Edit User" : "Add User"}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="user-name" className="mb-1 block text-sm font-medium">Name</label>
            <Input
              id="user-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Full name"
            />
            {formErrors.name && (
              <p className="mt-1 text-xs text-destructive">{formErrors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="user-email" className="mb-1 block text-sm font-medium">Email</label>
            <Input
              id="user-email"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="email@example.com"
            />
            {formErrors.email && (
              <p className="mt-1 text-xs text-destructive">{formErrors.email}</p>
            )}
          </div>
          {!editingUser && (
            <div>
              <label htmlFor="user-password" className="mb-1 block text-sm font-medium">Password</label>
              <Input
                id="user-password"
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder="Min 8 characters"
              />
              {formErrors.password && (
                <p className="mt-1 text-xs text-destructive">
                  {formErrors.password}
                </p>
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              id="user-active"
              type="checkbox"
              checked={formActive}
              onChange={(e) => setFormActive(e.target.checked)}
              className="size-4 rounded border"
            />
            <label htmlFor="user-active" className="text-sm font-medium">
              Active
            </label>
          </div>

          {/* Role checkboxes */}
          {allRoles.length > 0 && (
            <div>
              <span className="mb-1 block text-sm font-medium">Roles</span>
              <div className="flex flex-wrap gap-3">
                {allRoles.map((role) => (
                  <label
                    key={role.id}
                    className="flex items-center gap-1.5 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formRoleIds.includes(role.id)}
                      onChange={(e) => {
                        setFormRoleIds((prev) =>
                          e.target.checked
                            ? [...prev, role.id]
                            : prev.filter((id) => id !== role.id)
                        );
                      }}
                      className="size-4 rounded border"
                    />
                    {role.name}
                  </label>
                ))}
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
                : editingUser
                  ? "Update User"
                  : "Create User"}
            </Button>
          </div>
        </div>
      </Dialog>

      <style>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
