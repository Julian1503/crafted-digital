import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isTurnstileConfigured, verifyTurnstileToken } from "@/lib/security/turnstile";

const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("verifyTurnstileToken", () => {
    const original = process.env.TURNSTILE_SECRET_KEY;

    beforeEach(() => {
        process.env.TURNSTILE_SECRET_KEY = "test-secret";
        vi.spyOn(console, "error").mockImplementation(() => {});
    });
    afterEach(() => {
        process.env.TURNSTILE_SECRET_KEY = original;
        vi.restoreAllMocks();
    });

    it("skips when no secret is configured", async () => {
        delete process.env.TURNSTILE_SECRET_KEY;
        expect(isTurnstileConfigured()).toBe(false);
        expect(await verifyTurnstileToken("anything")).toEqual({ ok: true, skipped: true });
    });

    it("rejects a missing token without calling Cloudflare", async () => {
        const fetchImpl = vi.fn();
        expect(await verifyTurnstileToken(undefined, "1.2.3.4", fetchImpl)).toEqual({ ok: false, codes: ["missing-input-response"] });
        expect(fetchImpl).not.toHaveBeenCalled();
    });

    it("posts secret, token and ip and accepts a successful answer", async () => {
        const fetchImpl = vi.fn(async (_url: string, init?: RequestInit) => {
            const body = init?.body as URLSearchParams;
            expect(body.get("secret")).toBe("test-secret");
            expect(body.get("response")).toBe("tok");
            expect(body.get("remoteip")).toBe("1.2.3.4");
            return jsonResponse({ success: true });
        });
        expect(await verifyTurnstileToken("tok", "1.2.3.4", fetchImpl)).toEqual({ ok: true });
    });

    it("returns Cloudflare's error codes on failure", async () => {
        const fetchImpl = vi.fn(async () => jsonResponse({ success: false, "error-codes": ["timeout-or-duplicate"] }));
        expect(await verifyTurnstileToken("tok", undefined, fetchImpl)).toEqual({ ok: false, codes: ["timeout-or-duplicate"] });
    });

    it("fails closed on network errors and non-200 responses", async () => {
        expect(await verifyTurnstileToken("tok", undefined, vi.fn(async () => { throw new Error("offline"); }))).toEqual({ ok: false, codes: ["network-error"] });
        expect(await verifyTurnstileToken("tok", undefined, vi.fn(async () => jsonResponse({}, 503)))).toEqual({ ok: false, codes: ["http-503"] });
    });
});
