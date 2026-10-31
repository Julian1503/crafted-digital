import { describe, it, expect, beforeEach } from "vitest";
import { consumeRateLimit, resetRateLimits } from "@/lib/http/rate-limit";

const OPTS = { limit: 3, windowMs: 60_000 };

describe("consumeRateLimit", () => {
  beforeEach(() => resetRateLimits());

  it("allows requests up to the limit and then blocks", () => {
    const t = 1_000_000;
    expect(consumeRateLimit("b", "ip-1", OPTS, t).ok).toBe(true);
    expect(consumeRateLimit("b", "ip-1", OPTS, t + 1).ok).toBe(true);
    expect(consumeRateLimit("b", "ip-1", OPTS, t + 2)).toMatchObject({ ok: true, remaining: 0 });
    const blocked = consumeRateLimit("b", "ip-1", OPTS, t + 3);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(60);
  });

  it("keeps keys and buckets independent", () => {
    const t = 5_000;
    for (let i = 0; i < 3; i++) consumeRateLimit("b", "ip-1", OPTS, t);
    expect(consumeRateLimit("b", "ip-1", OPTS, t).ok).toBe(false);
    expect(consumeRateLimit("b", "ip-2", OPTS, t).ok).toBe(true);
    expect(consumeRateLimit("other", "ip-1", OPTS, t).ok).toBe(true);
  });

  it("resets after the window elapses", () => {
    const t = 10_000;
    for (let i = 0; i < 4; i++) consumeRateLimit("b", "ip-1", OPTS, t);
    expect(consumeRateLimit("b", "ip-1", OPTS, t + OPTS.windowMs - 1).ok).toBe(false);
    expect(consumeRateLimit("b", "ip-1", OPTS, t + OPTS.windowMs).ok).toBe(true);
  });
});

describe("getClientKey and isRateLimited", () => {
  beforeEach(() => resetRateLimits());

  it("prefers platform headers and otherwise the right-most forwarded hop", async () => {
    const { getClientKey } = await import("@/lib/http/rate-limit");
    const mk = (h: Record<string, string>) => ({ headers: new Headers(h) });
    expect(getClientKey(mk({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "9.9.9.9, 2.2.2.2" }))).toBe("1.1.1.1");
    expect(getClientKey(mk({ "x-forwarded-for": "9.9.9.9, 2.2.2.2" }))).toBe("2.2.2.2");
    expect(getClientKey(mk({}))).toBe("unknown");
  });

  it("peeks without consuming", async () => {
    const { isRateLimited } = await import("@/lib/http/rate-limit");
    const t = 1_000;
    expect(isRateLimited("x", "k", 2, t)).toBe(false);
    consumeRateLimit("x", "k", { limit: 2, windowMs: 1000 }, t);
    consumeRateLimit("x", "k", { limit: 2, windowMs: 1000 }, t);
    expect(isRateLimited("x", "k", 2, t)).toBe(true);
    expect(isRateLimited("x", "k", 2, t + 1000)).toBe(false);
  });
});
