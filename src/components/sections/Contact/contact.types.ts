import {formSchema} from "@/components/sections/Contact/contact-data";
import {UseFormReturn} from "react-hook-form";
import {z} from "zod";

export type FormValues = z.infer<typeof formSchema>;

export type ContactFormFieldsProps = {
    form: UseFormReturn<FormValues>;
    onSubmit: (values: FormValues) => void;
    isSubmitting: boolean;
}