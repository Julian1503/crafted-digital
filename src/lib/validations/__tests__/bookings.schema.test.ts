import { describe, it, expect } from "vitest";
import {
  bookingCreateSchema,
  bookingUpdateSchema,
  bookingNoteSchema,
} from "../bookings.schema";

describe("bookingCreateSchema", () => {
  it("parses a valid booking", () => {
    const result = bookingCreateSchema.safeParse({
      customerName: "John Doe",
      customerEmail: "john@example.com",
      date: "2025-06-15T14:00:00Z",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.date).toBeInstanceOf(Date);
    }
  });

  it("requires customerName", () => {
    const result = bookingCreateSchema.safeParse({
      customerEmail: "john@example.com",
      date: "2025-06-15T14:00:00Z",
    });
    expect(result.success).toBe(false);
  });

  it("requires valid email", () => {
    const result = bookingCreateSchema.safeParse({
      customerName: "John",
      customerEmail: "bad-email",
      date: "2025-06-15T14:00:00Z",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional duration and notes", () => {
    const result = bookingCreateSchema.safeParse({
      customerName: "John",
      customerEmail: "john@example.com",
      date: "2025-06-15T14:00:00Z",
      duration: 60,
      notes: "Prefers morning call",
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative duration", () => {
    const result = bookingCreateSchema.safeParse({
      customerName: "John",
      customerEmail: "john@example.com",
      date: "2025-06-15T14:00:00Z",
      duration: -30,
    });
    expect(result.success).toBe(false);
  });
});

describe("bookingUpdateSchema", () => {
  it("accepts empty object", () => {
    expect(bookingUpdateSchema.safeParse({}).success).toBe(true);
  });

  it("accepts partial updates", () => {
    const result = bookingUpdateSchema.safeParse({
      status: "confirmed",
      notes: "Updated notes",
    });
    expect(result.success).toBe(true);
  });
});

describe("bookingNoteSchema", () => {
  it("parses a valid booking note", () => {
    const result = bookingNoteSchema.safeParse({
      bookingId: "booking123",
      content: "Follow up needed",
    });
    expect(result.success).toBe(true);
  });

  it("requires both fields", () => {
    expect(bookingNoteSchema.safeParse({ bookingId: "x" }).success).toBe(false);
    expect(bookingNoteSchema.safeParse({ content: "x" }).success).toBe(false);
  });
});
