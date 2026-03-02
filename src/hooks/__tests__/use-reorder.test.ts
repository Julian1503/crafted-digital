import { describe, it, expect } from "vitest";
import { computeFractionalChanges } from "../use-reorder";

describe("computeFractionalChanges", () => {
  it("returns empty array when order is unchanged", () => {
    const items = [
      { id: "a", title: "A", sortOrder: 100 },
      { id: "b", title: "B", sortOrder: 200 },
      { id: "c", title: "C", sortOrder: 300 },
    ];
    const result = computeFractionalChanges(items, items);
    expect(result).toEqual([]);
  });

  it("computes new order when items are swapped", () => {
    const snapshot = [
      { id: "a", title: "A", sortOrder: 100 },
      { id: "b", title: "B", sortOrder: 200 },
      { id: "c", title: "C", sortOrder: 300 },
    ];
    const current = [
      { id: "b", title: "B", sortOrder: 200 },
      { id: "a", title: "A", sortOrder: 100 },
      { id: "c", title: "C", sortOrder: 300 },
    ];
    const result = computeFractionalChanges(current, snapshot);
    expect(result.length).toBeGreaterThan(0);
    // "b" moved to first position: should get sortOrder between 0 and 100
    const bChange = result.find((r) => r.id === "b");
    expect(bChange).toBeDefined();
    expect(bChange!.sortOrder).toBeLessThan(100);
    expect(bChange!.sortOrder).toBeGreaterThan(0);
  });

  it("places item at end when moved to last position", () => {
    const snapshot = [
      { id: "a", title: "A", sortOrder: 100 },
      { id: "b", title: "B", sortOrder: 200 },
      { id: "c", title: "C", sortOrder: 300 },
    ];
    const current = [
      { id: "b", title: "B", sortOrder: 200 },
      { id: "c", title: "C", sortOrder: 300 },
      { id: "a", title: "A", sortOrder: 100 },
    ];
    const result = computeFractionalChanges(current, snapshot);
    const aChange = result.find((r) => r.id === "a");
    expect(aChange).toBeDefined();
    // "a" moved to end: should get sortOrder > 300
    expect(aChange!.sortOrder).toBeGreaterThan(300);
  });

  it("handles single item (no changes)", () => {
    const items = [{ id: "a", title: "A", sortOrder: 100 }];
    const result = computeFractionalChanges(items, items);
    expect(result).toEqual([]);
  });

  it("handles empty arrays", () => {
    const result = computeFractionalChanges([], []);
    expect(result).toEqual([]);
  });

  it("only returns items whose order actually changed", () => {
    const snapshot = [
      { id: "a", title: "A", sortOrder: 100 },
      { id: "b", title: "B", sortOrder: 200 },
      { id: "c", title: "C", sortOrder: 300 },
    ];
    // Move "c" to position 1 (between a and b)
    const current = [
      { id: "a", title: "A", sortOrder: 100 },
      { id: "c", title: "C", sortOrder: 300 },
      { id: "b", title: "B", sortOrder: 200 },
    ];
    const result = computeFractionalChanges(current, snapshot);
    // "a" stays at position 0 with same predecessor — should not change
    const aChange = result.find((r) => r.id === "a");
    expect(aChange).toBeUndefined();
    // "c" moved — should change
    const cChange = result.find((r) => r.id === "c");
    expect(cChange).toBeDefined();
    expect(cChange!.sortOrder).toBeGreaterThan(100);
    expect(cChange!.sortOrder).toBeLessThan(200);
  });
});
