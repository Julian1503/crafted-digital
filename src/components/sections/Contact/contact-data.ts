/**
 * @fileoverview Contact form validation schema.
 * Shared by the client form and the API route, so both sides enforce the same limits.
 */
import { z } from "zod";

const MAX_SHORT = 120;
const MAX_MESSAGE = 4000;
const MAX_TOPICS = 8;

const optionalShort = z
    .string()
    .trim()
    .max(MAX_SHORT, `Keep it under ${MAX_SHORT} characters`)
    .optional()
    .nullable();

/**
 * Zod validation schema for the contact form.
 */
export const formSchema = z.object({
    /** User's full name - required */
    name: z
        .string()
        .trim()
        .min(1, "Please enter your name")
        .max(MAX_SHORT, `Keep it under ${MAX_SHORT} characters`)
        .refine((v) => !/[\u0000-\u001f\u007f]/.test(v), "Please remove special characters"),
    /** User's email address - required, validated format */
    email: z.email("Please enter a valid email").max(254),
    /** Project description message - required, minimum 10 characters */
    message: z
        .string()
        .trim()
        .min(10, "Please add a bit more detail")
        .max(MAX_MESSAGE, `Keep it under ${MAX_MESSAGE} characters`),
    /** Selected project topics - at least one required */
    topics: z
        .array(z.string().trim().max(60))
        .min(1, "Select at least one topic")
        .max(MAX_TOPICS),
    /** Budget range - optional */
    budget: optionalShort,
    /** Project timeline preference - optional */
    timeline: optionalShort,
    /** Preferred contact method - optional */
    contactMethod: z.enum(["Email", "Call"]).optional().nullable(),
    /** Company name - optional */
    company: optionalShort,
    /** Company website URL - optional; http(s) only */
    website: z
        .string()
        .trim()
        .max(2048)
        .refine(
            (v) => v === "" || /^https?:\/\/[^\s]+$/i.test(v),
            "Please enter a full web address starting with https://"
        )
        .optional()
        .nullable(),
    /** Honeypot field for spam prevention - should remain empty */
    hp: z.string().max(500).optional().nullable(),
});

export type ContactFormValues = z.infer<typeof formSchema>;
