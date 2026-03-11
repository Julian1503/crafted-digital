
export const C = {
    bg:     "#0c0c0c",
    bgDark: "#080808",
    white:  "rgba(255,255,255,0.9)",
    mid:    "rgba(255,255,255,0.55)",
    dim:    "rgba(255,255,255,0.28)",
    ghost:  "rgba(255,255,255,0.06)",
    label:  "rgba(255,255,255,0.2)",
    border: "rgba(255,255,255,0.06)",
    accent: "hsl(var(--hero-accent))",
} as const;


export function parseResultMetric(text: string): { metric: string; rest: string } | null {
    const m = text.match(/^([+\-]?[\d,.]+[%x×]?(?:\s*[xX])?)\s+(.+)$/i);
    return m ? { metric: m[1], rest: m[2] } : null;
}

export function splitChallenge(text: string): [string, string] {
    const m = text.match(/^(.+?[.!?])\s+([\s\S]+)$/);
    return m ? [m[1], m[2]] : [text, ""];
}