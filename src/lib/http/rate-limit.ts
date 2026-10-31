/**
 * @fileoverview Small in-process rate limiter (fixed window per key).
 *
 * Good enough for a single long-lived Node process (the current deployment).
 * It is NOT shared across serverless instances or replicas; swap the store for
 * Upstash/Redis if the app moves to a multi-instance or serverless runtime.
 */
/** Anything with a Headers-like `get`: NextRequest, Request, or the Auth.js request. */
export interface HeaderSource {
  headers: { get(name: string): string | null } | Headers;
}

interface WindowEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
}

const DEFAULT_MAX_ENTRIES = 10_000;

const buckets = new Map<string, Map<string, WindowEntry>>();

function getBucket(name: string): Map<string, WindowEntry> {
  let bucket = buckets.get(name);
  if (!bucket) {
    bucket = new Map();
    buckets.set(name, bucket);
  }
  return bucket;
}

function sweep(bucket: Map<string, WindowEntry>, now: number): void {
  for (const [key, entry] of bucket) {
    if (entry.resetAt <= now) bucket.delete(key);
  }
  // Hard cap so a flood of unique keys cannot grow memory without bound.
  if (bucket.size > DEFAULT_MAX_ENTRIES) {
    const excess = bucket.size - DEFAULT_MAX_ENTRIES;
    let removed = 0;
    for (const key of bucket.keys()) {
      bucket.delete(key);
      if (++removed >= excess) break;
    }
  }
}

/**
 * Consumes one request from the window for `key` inside `bucketName`.
 */
export function consumeRateLimit(
  bucketName: string,
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
  now: number = Date.now()
): RateLimitResult {
  const bucket = getBucket(bucketName);
  if (bucket.size % 100 === 0) sweep(bucket, now);

  const existing = bucket.get(key);
  if (!existing || existing.resetAt <= now) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: Math.ceil(windowMs / 1000) };
  }

  existing.count += 1;
  const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  if (existing.count > limit) {
    return { ok: false, remaining: 0, retryAfter };
  }
  return { ok: true, remaining: limit - existing.count, retryAfter };
}

/**
 * Returns true when `key` is currently over the limit, without consuming a slot.
 */
export function isRateLimited(bucketName: string, key: string, limit: number, now: number = Date.now()): boolean {
  const entry = getBucket(bucketName).get(key);
  if (!entry || entry.resetAt <= now) return false;
  return entry.count >= limit;
}

/**
 * Client identifier for rate limiting behind a reverse proxy.
 *
 * Platform-set headers win (`x-real-ip`, `cf-connecting-ip`). For
 * `x-forwarded-for` we take the RIGHT-most entry: proxies append the address
 * they saw, so the last hop is the one our trusted edge recorded, while the
 * left-most entries can be forged by the client.
 */
export function getClientKey(req: HeaderSource): string {
  const h = req.headers;
  const direct = h.get("x-real-ip") ?? h.get("cf-connecting-ip");
  if (direct) return direct.trim();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last;
  }
  return "unknown";
}

/** Test helper: clears every bucket. */
export function resetRateLimits(): void {
  buckets.clear();
}
