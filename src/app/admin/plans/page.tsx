"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Star,
  ToggleLeft,
  ToggleRight,
  Check,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { CardSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { toast } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";
import {Label} from "@/components/ui/label";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  interval: "one-time" | "monthly" | "yearly";
  features: string | null;
  sortOrder: number;
  active: boolean;
  highlighted: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

function intervalLabel(interval: string): string {
  switch (interval) {
    case "monthly":
      return "/mo";
    case "yearly":
      return "/yr";
    default:
      return "";
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  // Create / Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCurrency, setFormCurrency] = useState("AUD");
  const [formInterval, setFormInterval] = useState<string>("one-time");
  const [formFeatures, setFormFeatures] = useState("");
  const [formSortOrder, setFormSortOrder] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formHighlighted, setFormHighlighted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null);

  /* ---------- Fetch plans ---------- */

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/plans");
      if (!res.ok) throw new Error("Failed to load plans");
      const data: Plan[] = await res.json();
      data.sort((a, b) => a.sortOrder - b.sortOrder);
      setPlans(data);
    } catch {
      toast({ title: "Failed to load plans", variant: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  /* ---------- Open create dialog ---------- */

  const openCreate = () => {
    setEditingPlan(null);
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormCurrency("AUD");
    setFormInterval("one-time");
    setFormFeatures("");
    setFormSortOrder(String(plans.length));
    setFormActive(true);
    setFormHighlighted(false);
    setDialogOpen(true);
  };

  /* ---------- Open edit dialog ---------- */

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormName(plan.name);
    setFormDescription(plan.description ?? "");
    setFormPrice(String(plan.price));
    setFormCurrency(plan.currency);
    setFormInterval(plan.interval);
    setFormFeatures(plan.features ?? "");
    setFormSortOrder(String(plan.sortOrder));
    setFormActive(plan.active);
    setFormHighlighted(plan.highlighted);
    setDialogOpen(true);
  };

  /* ---------- Submit create / edit ---------- */

  const handleSubmit = async () => {
    if (!formName.trim()) {
      toast({ title: "Name is required", variant: "error" });
      return;
    }
    if (!formPrice || isNaN(Number(formPrice)) || Number(formPrice) < 0) {
      toast({ title: "A valid price is required", variant: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        name: formName.trim(),
        description: formDescription.trim() || null,
        price: Number(formPrice),
        currency: formCurrency.trim().toUpperCase() || "AUD",
        interval: formInterval,
        features: formFeatures.trim() || null,
        sortOrder: formSortOrder ? Number(formSortOrder) : 0,
        active: formActive,
        highlighted: formHighlighted,
      };

      const isEdit = !!editingPlan;
      const url = isEdit
        ? `/api/admin/plans/${editingPlan.id}`
        : "/api/admin/plans";
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
        title: isEdit ? "Plan updated" : "Plan created",
        variant: "success",
      });
      setDialogOpen(false);
      fetchPlans();
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Something went wrong",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Toggle active / highlighted ---------- */

  const toggleField = async (
    plan: Plan,
    field: "active" | "highlighted"
  ) => {
    try {
      const res = await fetch(`/api/admin/plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !plan[field] }),
      });
      if (!res.ok) throw new Error();
      toast({
        title: `Plan ${field === "active" ? (plan.active ? "deactivated" : "activated") : (plan.highlighted ? "unhighlighted" : "highlighted")}`,
        variant: "success",
      });
      fetchPlans();
    } catch {
      toast({ title: `Failed to update plan`, variant: "error" });
    }
  };

  /* ---------- Delete ---------- */

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/admin/plans/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast({ title: "Plan deleted", variant: "success" });
      setDeleteTarget(null);
      fetchPlans();
    } catch {
      toast({ title: "Failed to delete plan", variant: "error" });
    }
  };

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Plans</h1>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          New Plan
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <AdminEmptyState
          icon={CreditCard}
          title="No plans yet"
          description="Create your first pricing plan to get started."
          action={{ label: "New Plan", onClick: openCreate }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const featuresList = plan.features
              ? plan.features.split("\n").filter(Boolean)
              : [];

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-lg border bg-background p-5 transition-shadow hover:shadow-md",
                  plan.highlighted && "ring-2 ring-yellow-400"
                )}
              >
                {/* Badges row */}
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      plan.active
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    )}
                  >
                    {plan.active ? "Active" : "Inactive"}
                  </span>
                  {plan.highlighted && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <Star className="size-3" />
                      Highlighted
                    </span>
                  )}
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {plan.interval}
                  </span>
                </div>

                {/* Name & Price */}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    {formatPrice(plan.price, plan.currency)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {intervalLabel(plan.interval)}
                  </span>
                </div>

                {/* Description */}
                {plan.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                )}

                {/* Features */}
                {featuresList.length > 0 && (
                  <ul className="mt-3 flex-1 space-y-1">
                    {featuresList.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-3.5 shrink-0 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Sort order indicator */}
                <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <ChevronUp className="size-3" />
                  <ChevronDown className="size-3" />
                  Order: {plan.sortOrder}
                </p>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-1 border-t pt-3">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => toggleField(plan, "active")}
                    title={plan.active ? "Deactivate" : "Activate"}
                  >
                    {plan.active ? (
                      <ToggleRight className="size-4 text-green-500" />
                    ) : (
                      <ToggleLeft className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => toggleField(plan, "highlighted")}
                    title={plan.highlighted ? "Remove highlight" : "Highlight"}
                  >
                    <Star
                      className={cn(
                        "size-4",
                        plan.highlighted
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      )}
                    />
                  </Button>
                  <div className="flex-1" />
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => openEdit(plan)}
                    title="Edit"
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setDeleteTarget(plan)}
                    title="Delete"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <AdminDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingPlan ? "Edit Plan" : "New Plan"}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="plan-name" className="mb-1 block text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="plan-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Pro Plan"
            />
          </div>
          <div>
            <label htmlFor="plan-description" className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="plan-description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Brief plan description…"
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="plan-price" className="mb-1 block text-sm font-medium">
                Price <span className="text-destructive">*</span>
              </label>
              <Input
                id="plan-price"
                type="number"
                min="0"
                step="0.01"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="plan-currency" className="mb-1 block text-sm font-medium">
                Currency
              </label>
              <Input
                id="plan-currency"
                value={formCurrency}
                onChange={(e) => setFormCurrency(e.target.value)}
                placeholder="AUD"
                maxLength={3}
              />
            </div>
            <div>
              <label htmlFor="plan-interval" className="mb-1 block text-sm font-medium">
                Interval
              </label>
              <select
                id="plan-interval"
                value={formInterval}
                onChange={(e) => setFormInterval(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="one-time">One-time</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="plan-features" className="mb-1 block text-sm font-medium">
              Features <span className="text-xs text-muted-foreground">(one per line)</span>
            </label>
            <textarea
              id="plan-features"
              value={formFeatures}
              onChange={(e) => setFormFeatures(e.target.value)}
              placeholder={"Unlimited projects\nPriority support\nCustom domain"}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div>
            <label htmlFor="plan-sort" className="mb-1 block text-sm font-medium">
              Sort Order
            </label>
            <Input
              id="plan-sort"
              type="number"
              value={formSortOrder}
              onChange={(e) => setFormSortOrder(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="flex items-center gap-6">
            <Label className="flex items-center gap-2 text-sm">
              <button
                type="button"
                role="switch"
                aria-checked={formActive}
                onClick={() => setFormActive(!formActive)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
                  formActive ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
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
            </Label>
            <Label className="flex items-center gap-2 text-sm">
              <button
                type="button"
                role="switch"
                aria-checked={formHighlighted}
                onClick={() => setFormHighlighted(!formHighlighted)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
                  formHighlighted
                    ? "bg-yellow-400"
                    : "bg-gray-300 dark:bg-gray-600"
                )}
              >
                <span
                  className={cn(
                    "inline-block size-3.5 rounded-full bg-white transition-transform",
                    formHighlighted ? "translate-x-4" : "translate-x-1"
                  )}
                />
              </button>
              Highlighted
            </Label>
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
                : editingPlan
                  ? "Update Plan"
                  : "Create Plan"}
            </Button>
          </div>
        </div>
      </AdminDialog>

      {/* Delete Confirmation Dialog */}
      <AdminDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Plan"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {deleteTarget?.name}
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
      </AdminDialog>
    </div>
  );
}
