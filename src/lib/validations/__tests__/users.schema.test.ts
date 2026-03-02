import { describe, it, expect } from "vitest";
import { userCreateSchema, userUpdateSchema } from "../users.schema";

describe("userCreateSchema", () => {
  it("parses a valid user", () => {
    const result = userCreateSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "securepassword",
    });
    expect(result.success).toBe(true);
  });

  it("requires name", () => {
    const result = userCreateSchema.safeParse({
      email: "john@example.com",
      password: "securepassword",
    });
    expect(result.success).toBe(false);
  });

  it("requires valid email", () => {
    const result = userCreateSchema.safeParse({
      name: "John",
      email: "not-an-email",
      password: "securepassword",
    });
    expect(result.success).toBe(false);
  });

  it("requires password min 8 chars", () => {
    const result = userCreateSchema.safeParse({
      name: "John",
      email: "john@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional roleIds", () => {
    const result = userCreateSchema.safeParse({
      name: "John",
      email: "john@example.com",
      password: "securepassword",
      roleIds: ["role1", "role2"],
    });
    expect(result.success).toBe(true);
  });

  it("defaults active to true", () => {
    const result = userCreateSchema.safeParse({
      name: "John",
      email: "john@example.com",
      password: "securepassword",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.active).toBe(true);
    }
  });
});

describe("userUpdateSchema", () => {
  it("accepts empty object", () => {
    const result = userUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("validates email if provided", () => {
    const result = userUpdateSchema.safeParse({
      email: "not-valid",
    });
    expect(result.success).toBe(false);
  });

  it("validates password min length if provided", () => {
    const result = userUpdateSchema.safeParse({
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("accepts partial updates", () => {
    const result = userUpdateSchema.safeParse({
      name: "Updated Name",
      active: false,
    });
    expect(result.success).toBe(true);
  });
});
