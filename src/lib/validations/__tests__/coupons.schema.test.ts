import { describe, it, expect } from "vitest";
import { couponCreateSchema, couponUpdateSchema } from "../coupons.schema";

describe("couponCreateSchema", () => {
  it("parses a valid coupon", () => {
    const result = couponCreateSchema.safeParse({
      code: "SAVE20",
      amount: 20,
    });
    expect(result.success).toBe(true);
  });

  it("requires code", () => {
    const result = couponCreateSchema.safeParse({ amount: 20 });
    expect(result.success).toBe(false);
  });

  it("requires non-negative amount", () => {
    const result = couponCreateSchema.safeParse({
      code: "TEST",
      amount: -5,
    });
    expect(result.success).toBe(false);
  });

  it("defaults type to percent", () => {
    const result = couponCreateSchema.safeParse({
      code: "TEST",
      amount: 10,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe("percent");
    }
  });

  it("accepts optional expiresAt as date string", () => {
    const result = couponCreateSchema.safeParse({
      code: "TEST",
      amount: 10,
      expiresAt: "2025-12-31T23:59:59Z",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.expiresAt).toBeInstanceOf(Date);
    }
  });
});

describe("couponUpdateSchema", () => {
  it("accepts empty object", () => {
    expect(couponUpdateSchema.safeParse({}).success).toBe(true);
  });

  it("allows null for nullable fields", () => {
    const result = couponUpdateSchema.safeParse({
      maxRedemptions: null,
      expiresAt: null,
    });
    expect(result.success).toBe(true);
  });
});
