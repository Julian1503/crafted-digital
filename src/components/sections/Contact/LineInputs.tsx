import * as React from "react";
import { useFormTheme } from "@/components/sections/Contact/FormThemeCtx";
import {BASE} from "@/components/sections/Contact/contact.constants";

export function LineInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    const C = useFormTheme();
    const [focused, setFocused] = React.useState(false);
    return (
        <input
            {...props}
            className={BASE}
            style={{ color: C.text, borderColor: focused ? C.borderFocus : C.border, ...props.style }}
            onFocus={e => { setFocused(true);  props.onFocus?.(e); }}
            onBlur={e  => { setFocused(false); props.onBlur?.(e);  }}
        />
    );
}

export function LineTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const C = useFormTheme();
    const [focused, setFocused] = React.useState(false);
    return (
        <textarea
            {...props}
            className={[BASE, "resize-none min-h-[80px]"].join(" ")}
            style={{ color: C.text, borderColor: focused ? C.borderFocus : C.border, ...props.style }}
            onFocus={e => { setFocused(true);  props.onFocus?.(e); }}
            onBlur={e  => { setFocused(false); props.onBlur?.(e);  }}
        />
    );
}

export function LineSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    const C = useFormTheme();
    const [focused, setFocused] = React.useState(false);
    return (
        <select
            {...props}
            className={[BASE, "cursor-pointer appearance-none pr-6"].join(" ")}
            style={{ color: C.text, borderColor: focused ? C.borderFocus : C.border, ...props.style }}
            onFocus={e => { setFocused(true);  props.onFocus?.(e); }}
            onBlur={e  => { setFocused(false); props.onBlur?.(e);  }}
        />
    );
}
