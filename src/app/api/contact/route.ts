import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import {formSchema} from "@/components/sections/Contact/contact-data";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const data = formSchema.parse(body);

        const to = process.env.CONTACT_TO_EMAIL;
        const from = process.env.CONTACT_FROM_EMAIL;

        if (!to || !from) {
            return NextResponse.json({ error: "Server not configured" }, { status: 500 });
        }

        const subject = `New inquiry — ${data.name} (${data.topics.join(", ")})`;

        const text = [
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            data.company ? `Company: ${data.company}` : null,
            data.website ? `Website: ${data.website}` : null,
            data.contactMethod ? `Preferred contact: ${data.contactMethod}` : null,
            data.budget ? `Budget: ${data.budget}` : null,
            data.timeline ? `Timeline: ${data.timeline}` : null,
            `Topics: ${data.topics.join(", ")}`,
            "",
            "Message:",
            data.message,
        ]
            .filter(Boolean)
            .join("\n");

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

        return NextResponse.json({ ok: true });
    } catch (err: unknown) {
        const message =
            err instanceof z.ZodError ? "Invalid form data: "+ err.message : "Failed to send message";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
