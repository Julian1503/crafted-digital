/**
 * @fileoverview Contact form API route handler.
 * Handles form submissions and sends notification emails via Resend.
 */
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { formSchema } from "@/components/sections/Contact/contact-data";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Handles POST requests from the contact form.
 * Validates form data, sends notification email to admin, and confirmation to user.
 *
 * @param req - The incoming request containing form data
 * @returns JSON response indicating success or failure
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = formSchema.parse(body);

        const to = process.env.CONTACT_TO_EMAIL;

        if (!to) {
            return NextResponse.json({ error: "Server not configured" }, { status: 500 });
        }

        // Send notification email to admin
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

        // Send confirmation email to user
        await resend.emails.send({
            to: data.email,
            template: {
                id: 'auto-reply-confirmation',
                variables: {
                    NAME: data.name,
                },
            },
        });

        return NextResponse.json({ ok: true });
    } catch (err: unknown) {
        const message =
            err instanceof z.ZodError ? "Invalid form data: " + err.message : "Failed to send message";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
