import * as React from "react";
import { useFormTheme } from "@/components/sections/Contact/FormThemeCtx";
import {FieldWrapProps} from "@/components/sections/Contact/contact.types";

export function FieldWrap({ label, required, optional, children, error }: FieldWrapProps) {
    const C = useFormTheme();
    return (
        <div className="group flex flex-col gap-1.5">
            <span
                className="text-[0.65rem] tracking-[0.18em] uppercase transition-colors duration-200"
                style={{ color: error ? "hsl(var(--destructive))" : C.label }}
            >
                {label}
                {required && (
                    <span className="ml-1" style={{ color: "hsl(var(--hero-accent))" }} aria-hidden="true">✦</span>
                )}
                {optional && (
                    <span className="ml-1 normal-case tracking-normal" style={{ color: C.optional }}>(optional)</span>
                )}
            </span>
            {children}
            {error && (
                <span className="text-[0.7rem]" style={{ color: "hsl(var(--destructive))" }}>{error}</span>
            )}
        </div>
    );
}
