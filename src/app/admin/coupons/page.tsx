"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Tag,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  ToggleLeft,
  ToggleRight,
  Clock,
  Ban,
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

interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  amount: number;
  maxRedemptions: number | null;
  timesRedeemed: number;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedCoupons {
  data: Coupon[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

function formatAmount(coupon: Coupon): string {
  if (coupon.type === "percent") return `${coupon.amount}%`;
  return `$${coupon.amount.toFixed(2)}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString();
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString();
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
        className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-xl animate-[dialogIn_0.2s_ease-out_both]"
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

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<PaginatedCoupons | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [expiredFilter, setExpiredFilter] = useState<
    "all" | "expired" | "valid"
  >("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Create / Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formCode, setFormCode] = useState("");
  const [formType, setFormType] = useState<"percent" | "fixed">("percent");
  const [formAmount, setFormAmount] = useState("");
  const [formMaxRedemptions, setFormMaxRedemptions] = useState("");
  const [formExpiresAt, setFormExpiresAt] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  /* ---------- Fetch coupons ---------- */

  const fetchCoupons = useCallback(
    async (
      p: number,
      q: string,
      status: "all" | "active" | "inactive",
      expired: "all" | "expired" | "valid"
    ) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: "20",
        });
        if (q) params.set("search", q);
        if (status === "active") params.set("active", "true");
        if (status === "inactive") params.set("active", "false");
        if (expired === "expired") params.set("expired", "true");
        if (expired === "valid") params.set("expired", "false");

        const res = await fetch(`/api/admin/coupons?${params}`);
        if (!res.ok) throw new Error("Failed to load coupons");
        const data: PaginatedCoupons = await res.json();
        setCoupons(data);
      } catch {
        toast({ title: "Failed to load coupons", variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCoupons(page, search, statusFilter, expiredFilter);
  }, [page, statusFilter, expiredFilter, fetchCoupons]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchCoupons(1, value, statusFilter, expiredFilter);
    }, 400);
  };

  /* ---------- Open create dialog ---------- */

  const openCreate = () => {
    setEditingCoupon(null);
    setFormCode("");
    setFormType("percent");
    setFormAmount("");
    setFormMaxRedemptions("");
    setFormExpiresAt("");
    setFormActive(true);
    setFormErrors({});
    setDialogOpen(true);
  };

  /* ---------- Open edit dialog ---------- */

  const openEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormCode(coupon.code);
    setFormType(coupon.type);
    setFormAmount(String(coupon.amount));
    setFormMaxRedemptions(
      coupon.maxRedemptions != null ? String(coupon.maxRedemptions) : ""
    );
    setFormExpiresAt(
      coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().slice(0, 16)
        : ""
    );
    setFormActive(coupon.active);
    setFormErrors({});
    setDialogOpen(true);
  };

  /* ---------- Submit create / edit ---------- */

  const handleSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!formCode.trim()) errors.code = "Code is required";
    if (!formAmount || isNaN(Number(formAmount)) || Number(formAmount) <= 0)
      errors.amount = "Amount must be greater than 0";
    if (
      formType === "percent" &&
      formAmount &&
      (Number(formAmount) < 1 || Number(formAmount) > 100)
    )
      errors.amount = "Percent must be between 1 and 100";
    if (
      formMaxRedemptions &&
      (isNaN(Number(formMaxRedemptions)) || Number(formMaxRedemptions) < 1)
    )
      errors.maxRedemptions = "Must be a positive number";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        code: formCode.trim().toUpperCase(),
        type: formType,
        amount: Number(formAmount),
        active: formActive,
      };
      if (formMaxRedemptions)
        body.maxRedemptions = Number(formMaxRedemptions);
      else body.maxRedemptions = null;
      if (formExpiresAt)
        body.expiresAt = new Date(formExpiresAt).toISOString();
      else body.expiresAt = null;

      const isEdit = !!editingCoupon;
      const url = isEdit
        ? `/api/admin/coupons/${editingCoupon.id}`
        : "/api/admin/coupons";
      const method = isEdit ? "PATCH" : "POST";

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
        title: isEdit ? "Coupon updated" : "Coupon created",
        variant: "success",
      });
      setDialogOpen(false);
      fetchCoupons(page, search, statusFilter, expiredFilter);
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

  const handleToggle = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !coupon.active }),
      });
      if (!res.ok) throw new Error();
      toast({
        title: `Coupon ${coupon.active ? "deactivated" : "activated"}`,
        variant: "success",
      });
      fetchCoupons(page, search, statusFilter, expiredFilter);
    } catch {
      toast({ title: "Failed to update coupon", variant: "error" });
    }
  };

  /* ---------- Delete ---------- */

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/admin/coupons/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast({ title: "Coupon deleted", variant: "success" });
      setDeleteTarget(null);
      fetchCoupons(page, search, statusFilter, expiredFilter);
    } catch {
      toast({ title: "Failed to delete coupon", variant: "error" });
    }
  };

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tag className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          New Coupon
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by code…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(
              e.target.value as "all" | "active" | "inactive"
            );
            setPage(1);
          }}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={expiredFilter}
          onChange={(e) => {
            setExpiredFilter(
              e.target.value as "all" | "expired" | "valid"
            );
            setPage(1);
          }}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All Expiry</option>
          <option value="valid">Valid</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={8} />
      ) : !coupons || coupons.data.length === 0 ? (
        <AdminEmptyState
          icon={Tag}
          title="No coupons found"
          description="Adjust your filters or create a new coupon."
          action={{ label: "New Coupon", onClick: openCreate }}
        />
      ) : (
        <>
          <div className="w-full overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left">
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Code
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Type
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Amount
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Max Redemptions
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Times Redeemed
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Expires At
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {coupons.data.map((coupon) => {
                  const expired = isExpired(coupon.expiresAt);
                  return (
                    <tr
                      key={coupon.id}
                      className="border-b transition-colors hover:bg-muted/20 last:border-b-0"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono font-bold">
                        {coupon.code}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {coupon.type === "percent"
                            ? "Percent"
                            : "Fixed"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {formatAmount(coupon)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {coupon.maxRedemptions ?? "∞"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {coupon.timesRedeemed}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {coupon.expiresAt ? (
                          <span className="inline-flex items-center gap-1">
                            {expired ? (
                              <Ban className="size-3.5 text-red-500" />
                            ) : (
                              <Clock className="size-3.5 text-muted-foreground" />
                            )}
                            <span
                              className={cn(
                                expired
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-muted-foreground"
                              )}
                            >
                              {formatDateTime(coupon.expiresAt)}
                            </span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Never
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={cn(
                            "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                            coupon.active
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          )}
                        >
                          {coupon.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => openEdit(coupon)}
                            title="Edit"
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleToggle(coupon)}
                            title={
                              coupon.active
                                ? "Deactivate"
                                : "Activate"
                            }
                          >
                            {coupon.active ? (
                              <ToggleRight className="size-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="size-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => setDeleteTarget(coupon)}
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {coupons.page} of {coupons.totalPages} ({coupons.total}{" "}
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
                disabled={page >= coupons.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingCoupon ? "Edit Coupon" : "New Coupon"}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="coupon-code"
              className="mb-1 block text-sm font-medium"
            >
              Code <span className="text-destructive">*</span>
            </label>
            <Input
              id="coupon-code"
              value={formCode}
              onChange={(e) => setFormCode(e.target.value.toUpperCase())}
              placeholder="e.g. SAVE20"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Letters, numbers, and hyphens. Auto-uppercased.
            </p>
            {formErrors.code && (
              <p className="mt-1 text-xs text-destructive">
                {formErrors.code}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="coupon-type"
                className="mb-1 block text-sm font-medium"
              >
                Type <span className="text-destructive">*</span>
              </label>
              <select
                id="coupon-type"
                value={formType}
                onChange={(e) =>
                  setFormType(e.target.value as "percent" | "fixed")
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="percent">Percent (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="coupon-amount"
                className="mb-1 block text-sm font-medium"
              >
                Amount <span className="text-destructive">*</span>
              </label>
              <Input
                id="coupon-amount"
                type="number"
                min="0"
                step="0.01"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder={formType === "percent" ? "1–100" : "0.00"}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {formType === "percent"
                  ? "1–100 for percent"
                  : "Greater than 0 for fixed amount"}
              </p>
              {formErrors.amount && (
                <p className="mt-1 text-xs text-destructive">
                  {formErrors.amount}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="coupon-max"
              className="mb-1 block text-sm font-medium"
            >
              Max Redemptions{" "}
              <span className="text-xs text-muted-foreground">
                (optional)
              </span>
            </label>
            <Input
              id="coupon-max"
              type="number"
              min="1"
              value={formMaxRedemptions}
              onChange={(e) => setFormMaxRedemptions(e.target.value)}
              placeholder="Unlimited"
            />
            {formErrors.maxRedemptions && (
              <p className="mt-1 text-xs text-destructive">
                {formErrors.maxRedemptions}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="coupon-expires"
              className="mb-1 block text-sm font-medium"
            >
              Expires At{" "}
              <span className="text-xs text-muted-foreground">
                (optional)
              </span>
            </label>
            <Input
              id="coupon-expires"
              type="datetime-local"
              value={formExpiresAt}
              onChange={(e) => setFormExpiresAt(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <button
                type="button"
                role="switch"
                aria-checked={formActive}
                onClick={() => setFormActive(!formActive)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
                  formActive
                    ? "bg-green-500"
                    : "bg-gray-300 dark:bg-gray-600"
                )}
              >
                <span
                  className={cn(
                    "inline-block size-3.5 rounded-full bg-white transition-transform",
                    formActive ? "translate-x-4" : "translate-x-1"
                  )}
                />
              </button>
              Active
            </label>
          </div>
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
                : editingCoupon
                  ? "Update Coupon"
                  : "Create Coupon"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Coupon"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete coupon{" "}
            <span className="font-mono font-medium text-foreground">
              {deleteTarget?.code}
            </span>
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
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
