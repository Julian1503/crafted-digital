import { describe, it, expect } from "vitest";
import { formSchema } from "@/components/sections/Contact/contact-data";

const valid = {
  name: "Jane Citizen",
  email: "jane@example.com",
  message: "I need a booking system for my clinic in Toowoomba.",
  topics: ["Website"],
};

describe("contact formSchema", () => {
  it("accepts a minimal valid submission", () => {
    expect(formSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects oversized and malformed input", () => {
    expect(formSchema.safeParse({ ...valid, name: "x".repeat(121) }).success).toBe(false);
    expect(formSchema.safeParse({ ...valid, message: "x".repeat(4001) }).success).toBe(false);
    expect(formSchema.safeParse({ ...valid, topics: Array(9).fill("Other") }).success).toBe(false);
    expect(formSchema.safeParse({ ...valid, website: "javascript:alert(1)" }).success).toBe(false);
    expect(formSchema.safeParse({ ...valid, name: "Jane\u0000" }).success).toBe(false);
  });

  it("allows an empty website and an https one", () => {
    expect(formSchema.safeParse({ ...valid, website: "" }).success).toBe(true);
    expect(formSchema.safeParse({ ...valid, website: "https://example.com.au" }).success).toBe(true);
  });

  it("keeps the honeypot optional and bounded", () => {
    expect(formSchema.safeParse({ ...valid, hp: "" }).success).toBe(true);
    expect(formSchema.safeParse({ ...valid, hp: "x".repeat(501) }).success).toBe(false);
  });
});
