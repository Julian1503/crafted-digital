import { describe, it, expect } from "vitest";
import {
  CONTENT_STATUS_BADGE,
  LEAD_STATUS_BADGE,
  BOOKING_STATUS_BADGE,
} from "../types/enums";

describe("CONTENT_STATUS_BADGE", () => {
  it("has entries for published, draft, scheduled", () => {
    expect(CONTENT_STATUS_BADGE).toHaveProperty("published");
    expect(CONTENT_STATUS_BADGE).toHaveProperty("draft");
    expect(CONTENT_STATUS_BADGE).toHaveProperty("scheduled");
  });

  it("values are non-empty CSS class strings", () => {
    Object.values(CONTENT_STATUS_BADGE).forEach((v) => {
      expect(typeof v).toBe("string");
      expect(v.length).toBeGreaterThan(0);
    });
  });
});

describe("LEAD_STATUS_BADGE", () => {
  it("has entries for new, contacted, qualified, won, lost", () => {
    expect(LEAD_STATUS_BADGE).toHaveProperty("new");
    expect(LEAD_STATUS_BADGE).toHaveProperty("contacted");
    expect(LEAD_STATUS_BADGE).toHaveProperty("qualified");
    expect(LEAD_STATUS_BADGE).toHaveProperty("won");
    expect(LEAD_STATUS_BADGE).toHaveProperty("lost");
  });
});

describe("BOOKING_STATUS_BADGE", () => {
  it("has entries for pending, confirmed, completed, cancelled", () => {
    expect(BOOKING_STATUS_BADGE).toHaveProperty("pending");
    expect(BOOKING_STATUS_BADGE).toHaveProperty("confirmed");
    expect(BOOKING_STATUS_BADGE).toHaveProperty("completed");
    expect(BOOKING_STATUS_BADGE).toHaveProperty("cancelled");
  });
});
