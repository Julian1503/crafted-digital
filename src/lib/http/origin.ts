/**
 * @fileoverview Same-origin check for state-changing requests.
 *
 * Browsers always send `Origin` on cross-site POST/PUT/PATCH/DELETE (and
 * `Sec-Fetch-Site` on modern ones). Requiring it to match the request host
 * blocks CSRF from other sites while leaving same-origin fetches and
 * non-browser clients (no Origin, no Sec-Fetch-Site) unaffected.
 */
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function hostOf(url: string | null): string | null {
    if (!url) return null;
    try {
        return new URL(url).host.toLowerCase();
    } catch {
        return null;
    }
}

export function isMutatingMethod(method: string): boolean {
    return !SAFE_METHODS.has(method.toUpperCase());
}

/**
 * True when the request is safe to act on: a read, or a write whose Origin
 * (or, failing that, Referer / Sec-Fetch-Site) matches `requestHost`.
 */
export function isTrustedOrigin(headers: Headers, requestHost: string, method = "POST"): boolean {
    if (!isMutatingMethod(method)) return true;

    const host = requestHost.toLowerCase();
    const originHeader = headers.get("origin");
    if (originHeader) return hostOf(originHeader) === host;

    const referer = hostOf(headers.get("referer"));
    if (referer) return referer === host;

    const fetchSite = headers.get("sec-fetch-site");
    if (fetchSite) return fetchSite === "same-origin" || fetchSite === "none";

    // No browser-provided signal at all: a scripted client, which the session
    // cookie policy (SameSite=Lax) already protects from cross-site use.
    return true;
}
