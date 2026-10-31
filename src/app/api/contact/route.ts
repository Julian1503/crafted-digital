/**
 * @fileoverview Contact form API route.
 *
 * Validates the payload, drops honeypot hits silently, rate limits by client IP,
 * sends the owner notification through Resend and, best-effort, an auto-reply.
 * Every Resend result is inspected: the SDK returns `{ data, error }` instead
 * of throwing, so an unchecked call would lose the lead silently.
 */
import { Resend } from "resend";
import { formSchema } from "@/components/sections/Contact/contact-data";
import { withErrorHandling, successResponse, validateRequestBody } from "@/lib/http/api-handler";
import { consumeRateLimit, getClientKey } from "@/lib/http/rate-limit";
import {
    InternalServerError,
    RateLimitError,
    ServiceUnavailableError,
} from "@/lib/errors/api-error";

// 5 submissions per hour per IP in production; relaxed in dev/test so suites can run.
const RATE_LIMIT = process.env.NODE_ENV === "production"
    ? { limit: 5, windowMs: 60 * 60 * 1000 }
    : { limit: 500, windowMs: 60 * 60 * 1000 };

function getResendClient(): Resend {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new InternalServerError("Contact service is not configured", true);
    return new Resend(apiKey);
}

export const POST = withErrorHandling(async (req) => {
    const clientKey = getClientKey(req);
    const limit = consumeRateLimit("contact", clientKey, RATE_LIMIT);
    if (!limit.ok) throw new RateLimitError(limit.retryAfter);

    const data = await validateRequestBody(req, formSchema);

    // Honeypot: bots fill hidden fields. Pretend success and do nothing.
    if (data.hp && data.hp.trim().length > 0) {
        console.warn("[contact] honeypot hit", { clientKey });
        return successResponse({ ok: true, skipped: true });
    }

    const to = process.env.CONTACT_TO_EMAIL;
    if (!to) throw new InternalServerError("Contact service is not configured", true);

    const resend = getResendClient();

    const notification = await resend.emails.send({
        to,
        replyTo: data.email,
        template: {
            id: "new-client-inquiry-notification",
            variables: {
                name: data.name,
                email: data.email,
                company: data.company || "N/A",
                website: data.website || "N/A",
                contactMethod: data.contactMethod || "Not specified",
                budget: data.budget || "N/A",
                timeline: data.timeline || "N/A",
                topics: data.topics.join(", "),
                message: data.message,
            },
        },
    });

    if (notification.error) {
        console.error("[contact] notification send failed", {
            name: notification.error.name,
            message: notification.error.message,
        });
        throw new ServiceUnavailableError("Email delivery");
    }

    // Auto-reply is a courtesy: never fail the request because of it.
    try {
        const reply = await resend.emails.send({
            to: data.email,
            template: {
                id: "auto-reply-confirmation",
                variables: { NAME: data.name },
            },
        });
        if (reply.error) {
            console.warn("[contact] auto-reply failed", {
                name: reply.error.name,
                message: reply.error.message,
            });
        }
    } catch (error: unknown) {
        console.warn("[contact] auto-reply threw", error instanceof Error ? error.message : error);
    }

    return successResponse({ ok: true });
});
