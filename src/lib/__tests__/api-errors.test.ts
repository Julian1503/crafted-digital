import { describe, it, expect } from "vitest";
import { z } from "zod";
import { toValidationError, simpleError } from "../http/api-errors";

describe("toValidationError", () => {
  it("converts a ZodError to a structured validation error", () => {
    const schema = z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email"),
    });
    const result = schema.safeParse({ name: "", email: "bad" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = toValidationError(result.error);
      expect(error.error.code).toBe("VALIDATION_ERROR");
      expect(error.error.message).toBeTruthy();
      expect(error.error.fieldErrors).toBeDefined();
      expect(error.error.issues).toBeDefined();
      expect(error.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("groups errors by field path", () => {
    const schema = z.object({
      age: z.number().min(0, "Must be positive").max(150, "Too large"),
    });
    const result = schema.safeParse({ age: -1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = toValidationError(result.error);
      expect(error.error.fieldErrors["age"]).toBeDefined();
      expect(error.error.fieldErrors["age"].length).toBeGreaterThan(0);
    }
  });

  it("handles summary with multiple unique messages", () => {
    const schema = z.object({
      a: z.string().min(1, "A required"),
      b: z.string().min(1, "B required"),
      c: z.string().min(1, "C required"),
      d: z.string().min(1, "D required"),
    });
    const result = schema.safeParse({ a: "", b: "", c: "", d: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = toValidationError(result.error);
      expect(error.error.message).toContain("+");
    }
  });
});

describe("simpleError", () => {
  it("creates a simple error response", () => {
    const result = simpleError("UNAUTHORIZED", "Not authenticated");
    expect(result.error.code).toBe("UNAUTHORIZED");
    expect(result.error.message).toBe("Not authenticated");
  });

  it("supports all error codes", () => {
    const codes = ["UNAUTHORIZED", "FORBIDDEN", "BAD_REQUEST", "INTERNAL_ERROR"] as const;
    for (const code of codes) {
      const result = simpleError(code, "Test");
      expect(result.error.code).toBe(code);
    }
  });
});
