/**
 * @fileoverview Server-side verification of Cloudflare Turnstile tokens.
 *
 * The widget on the contact form produces a single-use token; this module
 * asks Cloudflare whether it is genuine. When no secret is configured (local
 * development, preview deployments) verification is skipped and reported as
 * such so the caller can log it.
 */
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 8000;

export interface TurnstileResult {
    ok: boolean;
    /** True when no secret is configured and the check did not run. */
    skipped?: boolean;
    /** Cloudflare error codes, or a local reason such as `missing-input-response`. */
    codes?: string[];
}

export function isTurnstileConfigured(): boolean {
    return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/**
 * Verifies a token with Cloudflare. Fails closed: a network error or an
 * unexpected response counts as a failed check, so spam cannot slip through
 * while Cloudflare is unreachable.
 */
export async function verifyTurnstileToken(
    token: string | null | undefined,
    remoteIp?: string,
    fetchImpl: FetchLike = fetch
): Promise<TurnstileResult> {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) return { ok: true, skipped: true };
    if (!token) return { ok: false, codes: ["missing-input-response"] };

    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);

    try {
        const res = await fetchImpl(VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!res.ok) return { ok: false, codes: [`http-${res.status}`] };
        const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
        return data.success === true
            ? { ok: true }
            : { ok: false, codes: data["error-codes"] ?? ["unknown-failure"] };
    } catch (error: unknown) {
        console.error("[turnstile] verification request failed", error instanceof Error ? error.message : error);
        return { ok: false, codes: ["network-error"] };
    }
}
