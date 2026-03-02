import { describe, it, expect } from "vitest";
import { planCreateSchema, planUpdateSchema } from "../plans.schema";

describe("planCreateSchema", () => {
  it("parses a valid plan", () => {
    const result = planCreateSchema.safeParse({
      name: "Basic Plan",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(0);
      expect(result.data.currency).toBe("AUD");
      expect(result.data.interval).toBe("one-time");
      expect(result.data.active).toBe(true);
      expect(result.data.highlighted).toBe(false);
    }
  });

  it("requires name", () => {
    const result = planCreateSchema.safeParse({
      price: 100,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = planCreateSchema.safeParse({
      name: "Plan",
      price: -50,
    });
    expect(result.success).toBe(false);
  });

  it("accepts all optional fields", () => {
    const result = planCreateSchema.safeParse({
      name: "Pro Plan",
      description: "Best plan ever",
      price: 99.99,
      currency: "USD",
      interval: "monthly",
      features: "Feature 1, Feature 2",
      sortOrder: 2,
      active: true,
      highlighted: true,
    });
    expect(result.success).toBe(true);
  });
});

describe("planUpdateSchema", () => {
  it("accepts empty object", () => {
    expect(planUpdateSchema.safeParse({}).success).toBe(true);
  });

  it("accepts partial update", () => {
    const result = planUpdateSchema.safeParse({
      name: "Updated Plan",
      price: 149.99,
    });
    expect(result.success).toBe(true);
  });
});
