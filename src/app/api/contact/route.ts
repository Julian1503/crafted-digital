/**
 * @fileoverview ContactSection form API route handler.
 * Handles form submissions and sends notification emails via Resend.
 */
import { Resend } from "resend";
import { formSchema } from "@/components/sections/Contact/contact-data";
import { withErrorHandling, successResponse } from "@/lib/http/api-handler";
import { BadRequestError, InternalServerError } from "@/lib/errors/api-error";

function getResendClient(): Resend {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new InternalServerError("RESEND_API_KEY is not configured");
    return new Resend(apiKey);
}

export const POST = withErrorHandling(async (req) => {
    const body = await req.json();
    const parsed = formSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestError("Invalid form data");
    const data = parsed.data;

    const to = process.env.CONTACT_TO_EMAIL;
    if (!to) throw new InternalServerError("CONTACT_TO_EMAIL is not configured");

    const resend = getResendClient();

    await resend.emails.send({
        to,
        template: {
            id: 'new-client-inquiry-notification',
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

    await resend.emails.send({
        to: data.email,
        template: {
            id: 'auto-reply-confirmation',
            variables: {
                NAME: data.name,
            },
        },
    });

    return successResponse({ ok: true });
});
