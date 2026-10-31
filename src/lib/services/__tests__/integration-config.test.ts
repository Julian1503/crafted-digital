import { describe, it, expect } from "vitest";
import { maskIntegrationConfig, mergeMaskedConfig } from "@/lib/services/integration-config";

describe("maskIntegrationConfig", () => {
    it("masks secret-looking keys and leaves the rest", () => {
        const out = JSON.parse(maskIntegrationConfig(JSON.stringify({ apiKey: "sk_live_abcdef1234", region: "au", webhookSecret: "whsec_9999" }))!);
        expect(out).toEqual({ apiKey: "••••1234", region: "au", webhookSecret: "••••9999" });
    });

    it("masks a non-JSON config as a whole and passes null through", () => {
        expect(maskIntegrationConfig("raw-token-value")).toBe("••••alue");
        expect(maskIntegrationConfig(null)).toBeNull();
    });
});

describe("mergeMaskedConfig", () => {
    const stored = JSON.stringify({ apiKey: "sk_live_abcdef1234", region: "au" });

    it("keeps the stored secret when the form echoes the mask back", () => {
        const incoming = JSON.stringify({ apiKey: "••••1234", region: "us" });
        expect(JSON.parse(mergeMaskedConfig(stored, incoming)!)).toEqual({ apiKey: "sk_live_abcdef1234", region: "us" });
    });

    it("stores a new secret when a real value is sent", () => {
        const incoming = JSON.stringify({ apiKey: "sk_live_new", region: "au" });
        expect(JSON.parse(mergeMaskedConfig(stored, incoming)!)).toEqual({ apiKey: "sk_live_new", region: "au" });
    });

    it("ignores a wholly masked non-JSON config and leaves undefined alone", () => {
        expect(mergeMaskedConfig("raw-token", "••••oken")).toBeUndefined();
        expect(mergeMaskedConfig(stored, undefined)).toBeUndefined();
    });

    it("accepts a new non-JSON config verbatim", () => {
        expect(mergeMaskedConfig(stored, "plain-token")).toBe("plain-token");
    });
});
