/**
 * @fileoverview Type definitions for Contact form data.
 */
import { formSchema } from "@/components/sections/Contact/contact-data";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

/**
 * Form values inferred from the contact form Zod schema.
 */
export type FormValues = z.infer<typeof formSchema>;

/**
 * Props for the ContactFormFields component.
 */
export interface ContactFormFieldsProps {
    /** React Hook Form instance configured with the form schema */
    form: UseFormReturn<FormValues>;
    /** Handler called when form is submitted with valid data */
    onSubmit: (values: FormValues) => void;
    /** Whether the form is currently submitting */
    isSubmitting: boolean;
}