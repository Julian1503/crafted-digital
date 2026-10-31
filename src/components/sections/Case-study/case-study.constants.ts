// ─── Dark theme (used on hero, problem, solution, results, nav) ───────────────
export const DARK = {
  bg:     "#0c0c0b",
  bgAlt:  "#0a0a09",
  bgDeep: "#050504",
  text:   "rgba(255,255,255,0.90)",
  mid:    "rgba(255,255,255,0.55)",
  dim:    "rgba(255,255,255,0.28)",
  ghost:  "rgba(255,255,255,0.05)",
  label:  "rgba(255,255,255,0.22)",
  border: "rgba(255,255,255,0.07)",
} as const;

// ─── Light theme (used on overview, approach, testimonial) ────────────────────
export const LIGHT = {
  bg:     "#f5f3ee",
  bgAlt:  "#eeece7",
  text:   "#111010",
  mid:    "rgba(15,14,14,0.60)",
  dim:    "rgba(15,14,14,0.38)",
  ghost:  "rgba(15,14,14,0.06)",
  label:  "rgba(15,14,14,0.30)",
  border: "rgba(15,14,14,0.10)",
} as const;

// ─── Shared accent ────────────────────────────────────────────────────────────
export const ACCENT = "hsl(var(--hero-accent))";

// ─── Legacy alias kept for any callers that still import `C` ─────────────────
export const C = {
  bg:     DARK.bg,
  bgDark: DARK.bgAlt,
  white:  DARK.text,
  mid:    DARK.mid,
  dim:    DARK.dim,
  ghost:  DARK.ghost,
  label:  DARK.label,
  border: DARK.border,
  accent: ACCENT,
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Try to extract a leading metric from a result string, e.g. "3× faster deploys" */
export function parseResultMetric(text: string): { metric: string; rest: string } | null {
  const m = text.match(/^([+\-]?[\d,.]+[%x×]?(?:\s*[xX])?)\s+(.+)$/i);
  return m ? { metric: m[1], rest: m[2] } : null;
}

/** Split a long challenge paragraph at the first sentence boundary */
export function splitChallenge(text: string): [string, string] {
  const m = text.match(/^(.+?[.!?])\s+([\s\S]+)$/);
  return m ? [m[1], m[2]] : [text, ""];
}
