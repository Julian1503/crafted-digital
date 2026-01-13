/**
 * @fileoverview Contact form validation schema and configuration.
 * Uses Zod for form validation with comprehensive field requirements.
 */
import { z } from "zod";

/**
 * Zod validation schema for the contact form.
 * Validates required fields (name, email, message, topics) and optional fields.
 */
export const formSchema = z.object({
    /** User's full name - required */
    name: z.string().min(1, "Please enter your name"),
    /** User's email address - required, validated format */
    email: z.email("Please enter a valid email"),
    /** Project description message - required, minimum 10 characters */
    message: z.string().min(10, "Please add a bit more detail"),
    /** Selected project topics - at least one required */
    topics: z.array(z.string()).min(1, "Select at least one topic"),
    /** Budget range - optional */
    budget: z.string().optional(),
    /** Project timeline preference - optional */
    timeline: z.string().optional(),
    /** Preferred contact method - optional */
    contactMethod: z.enum(["Email", "Call"]).optional(),
    /** Company name - optional */
    company: z.string().optional(),
    /** Company website URL - optional */
    website: z.string().optional(),
    /** Honeypot field for spam prevention - should remain empty */
    hp: z.string().optional(),
});


