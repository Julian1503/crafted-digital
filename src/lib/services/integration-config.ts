/**
 * @fileoverview Masking of integration credentials for the admin UI.
 *
 * `config` is stored as a string (usually JSON). Reads return secret-looking
 * values masked; writes that still carry a masked value keep the stored one,
 * so an admin can open the form, change one field and save without wiping
 * the keys they could not see.
 */
const SECRET_KEY = /key|secret|token|password|passwd|auth/i;
export const MASK = "••••";

/** Keep the last four characters so an admin can tell which key is set. */
export function maskValue(value: string): string {
  if (value.length <= 4) return MASK;
  return `${MASK}${value.slice(-4)}`;
}

export function isMasked(value: unknown): value is string {
  return typeof value === "string" && value.startsWith(MASK);
}

function parseObject(config: string | null | undefined): Record<string, unknown> | null {
  if (!config) return null;
  try {
    const parsed: unknown = JSON.parse(config);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Masks secret-looking values in a JSON config; a non-JSON config is masked whole. */
export function maskIntegrationConfig(config: string | null): string | null {
  if (!config) return config;
  const obj = parseObject(config);
  if (!obj) return maskValue(config);
  const masked = Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, typeof v === "string" && SECRET_KEY.test(k) ? maskValue(v) : v])
  );
  return JSON.stringify(masked);
}

/**
 * Resolves the config to store: masked values in `incoming` are replaced by
 * the corresponding stored value. Returns `undefined` when nothing should
 * change (the whole incoming config is just the mask echoed back).
 */
export function mergeMaskedConfig(stored: string | null, incoming: string | undefined): string | undefined {
  if (incoming === undefined) return undefined;
  if (isMasked(incoming)) return undefined;

  const next = parseObject(incoming);
  if (!next) return incoming;

  const prev = parseObject(stored) ?? {};
  const merged = Object.fromEntries(
    Object.entries(next).map(([k, v]) => [k, isMasked(v) ? (prev[k] ?? v) : v])
  );
  return JSON.stringify(merged);
}
