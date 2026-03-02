import { describe, it, expect } from "vitest";
import {
  paginationSchema,
  reorderSchema,
} from "../utils.schema";

describe("paginationSchema", () => {
  it("parses valid pagination params", () => {
    const result = paginationSchema.safeParse({ page: "2", limit: "10" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(10);
    }
  });

  it("uses defaults when no params given", () => {
    const result = paginationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
      expect(result.data.sortDir).toBe("desc");
    }
  });

  it("rejects page less than 1", () => {
    const result = paginationSchema.safeParse({ page: "0" });
    expect(result.success).toBe(false);
  });

  it("rejects limit greater than 100", () => {
    const result = paginationSchema.safeParse({ limit: "200" });
    expect(result.success).toBe(false);
  });

  it("coerces string numbers to numbers", () => {
    const result = paginationSchema.safeParse({ page: "5", limit: "50" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.page).toBe("number");
      expect(typeof result.data.limit).toBe("number");
    }
  });

  it("accepts optional search, status, tags", () => {
    const result = paginationSchema.safeParse({
      search: "test",
      status: "published",
      tags: "news",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.search).toBe("test");
      expect(result.data.status).toBe("published");
      expect(result.data.tags).toBe("news");
    }
  });

  it("coerces boolean-like active from string", () => {
    const result = paginationSchema.safeParse({ active: "true" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.active).toBe(true);
    }
  });

  it("accepts sortDir asc and desc", () => {
    expect(paginationSchema.safeParse({ sortDir: "asc" }).success).toBe(true);
    expect(paginationSchema.safeParse({ sortDir: "desc" }).success).toBe(true);
    expect(paginationSchema.safeParse({ sortDir: "invalid" }).success).toBe(false);
  });
});

describe("reorderSchema", () => {
  it("parses valid reorder items", () => {
    const result = reorderSchema.safeParse([
      { id: "abc", sortOrder: 1 },
      { id: "def", sortOrder: 2 },
    ]);
    expect(result.success).toBe(true);
  });

  it("rejects items with empty id", () => {
    const result = reorderSchema.safeParse([{ id: "", sortOrder: 1 }]);
    expect(result.success).toBe(false);
  });

  it("rejects items with missing sortOrder", () => {
    const result = reorderSchema.safeParse([{ id: "abc" }]);
    expect(result.success).toBe(false);
  });

  it("accepts empty array", () => {
    const result = reorderSchema.safeParse([]);
    expect(result.success).toBe(true);
  });
});
