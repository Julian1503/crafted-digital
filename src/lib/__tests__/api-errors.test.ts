import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  ApiError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  BadRequestError,
  InternalServerError,
  isApiError,
  getErrorMessage,
} from "../errors/api-error";

describe("ValidationError.fromZodError", () => {
  it("converts a ZodError to a structured validation error", () => {
    const schema = z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email"),
    });
    const result = schema.safeParse({ name: "", email: "bad" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = ValidationError.fromZodError(result.error);
      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.statusCode).toBe(400);
      expect(error.message).toBeTruthy();
      const json = error.toJSON();
      expect(json.error.fieldErrors).toBeDefined();
      expect(json.error.issues).toBeDefined();
      expect(json.error.issues!.length).toBeGreaterThan(0);
    }
  });

  it("groups errors by field path", () => {
    const schema = z.object({
      age: z.number().min(0, "Must be positive").max(150, "Too large"),
    });
    const result = schema.safeParse({ age: -1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = ValidationError.fromZodError(result.error);
      const json = error.toJSON();
      expect(json.error.fieldErrors!["age"]).toBeDefined();
      expect(json.error.fieldErrors!["age"].length).toBeGreaterThan(0);
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
      const error = ValidationError.fromZodError(result.error);
      expect(error.message).toContain("+");
    }
  });
});

describe("Error classes", () => {
  it("UnauthorizedError has correct status and code", () => {
    const error = new UnauthorizedError();
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe("UNAUTHORIZED");
  });

  it("ForbiddenError has correct status and code", () => {
    const error = new ForbiddenError();
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe("FORBIDDEN");
  });

  it("NotFoundError has correct status and code", () => {
    const error = new NotFoundError("User", "123");
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toContain("123");
  });

  it("BadRequestError has correct status and code", () => {
    const error = new BadRequestError("Invalid input");
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe("BAD_REQUEST");
  });

  it("InternalServerError has correct status and code", () => {
    const error = new InternalServerError();
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe("INTERNAL_ERROR");
  });
});

describe("isApiError", () => {
  it("returns true for ApiError instances", () => {
    expect(isApiError(new UnauthorizedError())).toBe(true);
    expect(isApiError(new ForbiddenError())).toBe(true);
  });

  it("returns false for non-ApiError", () => {
    expect(isApiError(new Error("test"))).toBe(false);
    expect(isApiError("string")).toBe(false);
  });
});

describe("getErrorMessage", () => {
  it("extracts message from Error instances", () => {
    expect(getErrorMessage(new Error("test"))).toBe("test");
  });

  it("returns strings as-is", () => {
    expect(getErrorMessage("hello")).toBe("hello");
  });

  it("returns fallback for unknown types", () => {
    expect(getErrorMessage(42)).toBe("An unknown error occurred");
  });
});
