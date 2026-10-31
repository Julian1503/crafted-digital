import { describe, it, expect } from "vitest";
import { safeJsonLd } from "@/lib/seo/json-ld";

describe("safeJsonLd", () => {
  it("escapes script-breaking characters while staying valid JSON", () => {
    const payload = { name: "</script><script>alert(1)</script>", amp: "a & b" };
    const out = safeJsonLd(payload);
    expect(out).not.toContain("</script>");
    expect(out).not.toContain("<");
    expect(out).not.toContain(">");
    expect(out).not.toContain("&");
    expect(JSON.parse(out)).toEqual(payload);
  });

  it("round-trips plain objects unchanged", () => {
    const payload = { "@type": "FAQPage", items: [1, 2, 3], nested: { ok: true } };
    expect(JSON.parse(safeJsonLd(payload))).toEqual(payload);
  });
});
