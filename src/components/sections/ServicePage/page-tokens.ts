/**
 * @fileoverview Shared tokens for the light editorial pages (services, pricing).
 */
export const P = {
    heading:   "rgba(10,10,10,0.92)",
    body:      "rgba(10,10,10,0.75)",
    muted:     "rgba(10,10,10,0.62)",
    border:    "rgba(10,10,10,0.1)",
    borderSub: "rgba(10,10,10,0.07)",
    accent:    "hsl(var(--hero-accent))",
    accentDark:"hsl(var(--hero-accent-dark))",
    dark:      "#0c0c0c",
} as const;

export const CONTAINER = "mx-auto max-w-6xl px-4 sm:px-6 md:px-8";

export const EYEBROW = "text-[0.7rem] tracking-[0.22em] uppercase";

export const PRIMARY_BUTTON =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium no-underline whitespace-nowrap min-h-[44px] px-6 py-3 text-[0.8rem] tracking-[0.06em] uppercase transition-[background-color,transform] duration-200 hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export const SECONDARY_BUTTON =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium no-underline whitespace-nowrap min-h-[44px] px-6 py-3 text-[0.8rem] tracking-[0.06em] uppercase border transition-[border-color,color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
