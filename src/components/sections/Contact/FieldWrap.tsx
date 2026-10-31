import * as React from "react";
import { useFormTheme } from "@/components/sections/Contact/FormThemeCtx";
import { useFormField } from "@/components/ui/form";
import {FieldWrapProps} from "@/components/sections/Contact/contact.types";

/**
 * Labelled field wrapper. Must render inside <FormField> + <FormItem> so the
 * label can point at the control id that <FormControl> assigns, and the error
 * message id matches the control's aria-describedby.
 */
export function FieldWrap({ label, required, optional, children, error }: FieldWrapProps) {
    const C = useFormTheme();
    const { formItemId, formMessageId } = useFormField();
    return (
        <div className="group flex flex-col gap-1.5">
            <label
                htmlFor={formItemId}
                className="text-[0.7rem] tracking-[0.16em] uppercase transition-colors duration-200"
                style={{ color: error ? "hsl(var(--destructive))" : C.label }}
            >
                {label}
                {required && (
                    <span className="ml-1" style={{ color: "hsl(var(--hero-accent))" }}>
                        <span aria-hidden="true">✦</span>
                        <span className="sr-only"> (required)</span>
                    </span>
                )}
                {optional && (
                    <span className="ml-1 normal-case tracking-normal" style={{ color: C.optional }}>(optional)</span>
                )}
            </label>
            {children}
            {error && (
                <span id={formMessageId} role="alert" className="text-[0.75rem]" style={{ color: "hsl(var(--destructive))" }}>{error}</span>
            )}
        </div>
    );
}
