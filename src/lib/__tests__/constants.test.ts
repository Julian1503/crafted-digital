import { describe, it, expect } from "vitest";
import {
  STATUS_BADGE,
  LEAD_STATUS_COLORS,
  BOOKING_STATUS_COLORS,
} from "../constants";

describe("STATUS_BADGE", () => {
  it("has entries for published, draft, scheduled", () => {
    expect(STATUS_BADGE).toHaveProperty("published");
    expect(STATUS_BADGE).toHaveProperty("draft");
    expect(STATUS_BADGE).toHaveProperty("scheduled");
  });

  it("values are non-empty CSS class strings", () => {
    Object.values(STATUS_BADGE).forEach((v) => {
      expect(typeof v).toBe("string");
      expect(v.length).toBeGreaterThan(0);
    });
  });
});

describe("LEAD_STATUS_COLORS", () => {
  it("has entries for new, contacted, qualified, won, lost", () => {
    expect(LEAD_STATUS_COLORS).toHaveProperty("new");
    expect(LEAD_STATUS_COLORS).toHaveProperty("contacted");
    expect(LEAD_STATUS_COLORS).toHaveProperty("qualified");
    expect(LEAD_STATUS_COLORS).toHaveProperty("won");
    expect(LEAD_STATUS_COLORS).toHaveProperty("lost");
  });
});

describe("BOOKING_STATUS_COLORS", () => {
  it("has entries for pending, confirmed, completed, cancelled", () => {
    expect(BOOKING_STATUS_COLORS).toHaveProperty("pending");
    expect(BOOKING_STATUS_COLORS).toHaveProperty("confirmed");
    expect(BOOKING_STATUS_COLORS).toHaveProperty("completed");
    expect(BOOKING_STATUS_COLORS).toHaveProperty("cancelled");
  });
});
