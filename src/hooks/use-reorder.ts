"use client";

import { useRef, useState } from "react";
import type { SortableListItem } from "@/components/admin/SortableList";
import { toast } from "@/hooks/use-sonner";

/* ------------------------------------------------------------------ */
/*  Pure logic – fractional indexing                                    */
/* ------------------------------------------------------------------ */

/**
 * Computes new sortOrder values using fractional indexing.
 * Only returns items whose order actually changed from the snapshot.
 */
export function computeFractionalChanges(
  currentItems: SortableListItem[],
  snapshot: SortableListItem[],
): { id: string; sortOrder: number }[] {
  const originalSortOrder = new Map(snapshot.map((i) => [i.id, i.sortOrder]));
  const effectiveOrder = new Map<string, number>(originalSortOrder);
  const currentIds = currentItems.map((i) => i.id);
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

  return currentIds
    .filter((id) => {
      const orig = originalSortOrder.get(id) ?? 0;
      const next = effectiveOrder.get(id) ?? 0;
      return Math.abs(orig - next) > 0.0001;
    })
    .map((id) => ({ id, sortOrder: effectiveOrder.get(id)! }));
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

type ReorderPayloadMode =
  | "fractional" // sends { items: [{ id, sortOrder }] }
  | "ids";       // sends { ids: string[] }

interface UseReorderOptions {
  /** API endpoint to POST reorder data to */
  endpoint: string;
  /** Payload format: "fractional" (blog/case-studies) or "ids" (content) */
  mode?: ReorderPayloadMode;
  /** Callback after a successful save */
  onSaved: () => void;
}

export function useReorder({ endpoint, mode = "fractional", onSaved }: UseReorderOptions) {
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderItems, setReorderItems] = useState<SortableListItem[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);
  const snapshotRef = useRef<SortableListItem[]>([]);

  const enterReorderMode = (items: SortableListItem[]) => {
    setReorderItems(items);
    snapshotRef.current = [...items];
    setReorderMode(true);
  };

  const cancelReorder = () => {
    setReorderMode(false);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      let body: unknown;

      if (mode === "fractional") {
        const changes = computeFractionalChanges(reorderItems, snapshotRef.current);
        if (changes.length === 0) {
          setReorderMode(false);
          return;
        }
        body = { items: changes };
      } else {
        body = { ids: reorderItems.map((i) => i.id) };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();

      toast({ title: "Order saved", variant: "success" });
      setReorderMode(false);
      onSaved();
    } catch {
      toast({ title: "Failed to save order", variant: "error" });
    } finally {
      setSavingOrder(false);
    }
  };

  return {
    reorderMode,
    reorderItems,
    setReorderItems,
    savingOrder,
    enterReorderMode,
    cancelReorder,
    saveOrder,
  };
}
