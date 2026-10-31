import { describe, it, expect } from "vitest";
import { isTrustedOrigin, isMutatingMethod } from "@/lib/http/origin";

const HOST = "juliandelgado.com.au";
const h = (init: Record<string, string>) => new Headers(init);

describe("isMutatingMethod", () => {
    it("treats GET, HEAD and OPTIONS as safe", () => {
        expect(isMutatingMethod("GET")).toBe(false);
        expect(isMutatingMethod("head")).toBe(false);
        expect(isMutatingMethod("OPTIONS")).toBe(false);
        expect(isMutatingMethod("POST")).toBe(true);
        expect(isMutatingMethod("DELETE")).toBe(true);
    });
});

describe("isTrustedOrigin", () => {
    it("always allows reads", () => {
        expect(isTrustedOrigin(h({ origin: "https://evil.example" }), HOST, "GET")).toBe(true);
    });

    it("allows writes whose Origin matches the host", () => {
        expect(isTrustedOrigin(h({ origin: "https://juliandelgado.com.au" }), HOST)).toBe(true);
        expect(isTrustedOrigin(h({ origin: "https://JulianDelgado.com.au" }), HOST, "PATCH")).toBe(true);
    });

    it("rejects writes from another origin, including the opaque 'null' origin", () => {
        expect(isTrustedOrigin(h({ origin: "https://evil.example" }), HOST)).toBe(false);
        expect(isTrustedOrigin(h({ origin: "null" }), HOST)).toBe(false);
    });

    it("falls back to Referer when Origin is absent", () => {
        expect(isTrustedOrigin(h({ referer: "https://juliandelgado.com.au/admin/leads" }), HOST)).toBe(true);
        expect(isTrustedOrigin(h({ referer: "https://evil.example/" }), HOST)).toBe(false);
    });

    it("uses Sec-Fetch-Site when nothing else is present", () => {
        expect(isTrustedOrigin(h({ "sec-fetch-site": "same-origin" }), HOST)).toBe(true);
        expect(isTrustedOrigin(h({ "sec-fetch-site": "cross-site" }), HOST)).toBe(false);
    });

    it("allows non-browser clients that send no signal", () => {
        expect(isTrustedOrigin(h({}), HOST)).toBe(true);
    });

    it("matches on host including port", () => {
        expect(isTrustedOrigin(h({ origin: "http://localhost:3000" }), "localhost:3000")).toBe(true);
        expect(isTrustedOrigin(h({ origin: "http://localhost:3001" }), "localhost:3000")).toBe(false);
    });
});
