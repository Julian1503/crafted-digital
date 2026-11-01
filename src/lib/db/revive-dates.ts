/**
 * @fileoverview Restores Date instances on rows that went through a JSON cache.
 * `unstable_cache` serialises results, so DateTime columns come back as ISO strings.
 */
const DATE_KEYS = new Set(["createdAt", "updatedAt", "publishedAt", "date", "expires"]);

export function reviveDates<T>(value: T): T {
  // A cache hit returns ISO strings, but a fresh read (e.g. during `next build`)
  // returns real Dates: those must pass through, not be rebuilt as `{}`.
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value.map(reviveDates) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (DATE_KEYS.has(k) && typeof v === "string" && !Number.isNaN(Date.parse(v))) out[k] = new Date(v);
      else out[k] = reviveDates(v);
    }
    return out as T;
  }
  return value;
}
