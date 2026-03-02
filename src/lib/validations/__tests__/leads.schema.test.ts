import { describe, it, expect } from "vitest";
import { leadCreateSchema, leadUpdateSchema, leadNoteSchema } from "../leads.schema";

describe("leadCreateSchema", () => {
  it("parses a valid lead", () => {
    const result = leadCreateSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("requires name", () => {
    const result = leadCreateSchema.safeParse({
      email: "jane@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("requires valid email", () => {
    const result = leadCreateSchema.safeParse({
      name: "Jane",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = leadCreateSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      phone: "+1234567890",
      message: "Interested in your services",
      source: "referral",
      status: "qualified",
      tags: "premium,enterprise",
    });
    expect(result.success).toBe(true);
  });
});

describe("leadUpdateSchema", () => {
  it("accepts empty object", () => {
    expect(leadUpdateSchema.safeParse({}).success).toBe(true);
  });

  it("validates email if provided", () => {
    expect(leadUpdateSchema.safeParse({ email: "bad" }).success).toBe(false);
  });
});

describe("leadNoteSchema", () => {
  it("parses a valid note", () => {
    const result = leadNoteSchema.safeParse({
      leadId: "lead123",
      content: "Called and left voicemail",
    });
    expect(result.success).toBe(true);
  });

  it("requires leadId", () => {
    const result = leadNoteSchema.safeParse({
      content: "Note content",
    });
    expect(result.success).toBe(false);
  });

  it("requires content", () => {
    const result = leadNoteSchema.safeParse({
      leadId: "lead123",
    });
    expect(result.success).toBe(false);
  });
});
