import {FormColors} from "@/components/sections/Contact/contact.types";

/**
 * Constants for the ContactSection section, including form options and color themes.
 * These are used throughout the ContactSection component.
 */
export const PROJECT_TOPICS = [
    "New SaaS", "Landing page", "E-commerce",
    "Fix/maintenance", "Performance/SEO", "Integrations", "Other",
];

/**
 * Base styles for form elements.
 */
export const BASE = "w-full bg-transparent outline-none border-0 border-b pb-2 text-[0.92rem] transition-[border-color,color] duration-200";

/**
 * Form options for budget and timeline.
 */
export const BUDGET_OPTIONS = [
    { value: "",           label: "Select budget…" },
    { value: "Under $2k",  label: "Under $2k"  },
    { value: "$2k–$5k",   label: "$2k–$5k"   },
    { value: "$5k–$10k",  label: "$5k–$10k"  },
    { value: "$10k+",     label: "$10k+"      },
];

/**
 * Form options for timeline.
 */
export const TIMELINE_OPTIONS = [
    { value: "",           label: "Select timeline…" },
    { value: "ASAP",       label: "ASAP"       },
    { value: "2–4 weeks",  label: "2–4 weeks"  },
    { value: "1–2 months", label: "1–2 months" },
    { value: "Flexible",   label: "Flexible"   },
];

/**
 * Form options for contact methods.
 */
export const CONTACT_METHODS = ["Email", "Call"];

/**
 * Color themes for light and dark modes.
 * Used in form styling. Each theme defines colors for labels, text, borders,
 * and other UI elements to ensure good contrast and readability in its respective mode.
 */
export const LIGHT_COLORS: FormColors = {
    label:       "rgba(10,10,10,0.38)",
    optional:    "rgba(10,10,10,0.25)",
    text:        "rgba(10,10,10,0.85)",
    placeholder: "rgba(10,10,10,0.22)",
    border:      "rgba(10,10,10,0.15)",
    borderFocus: "rgba(10,10,10,0.70)",
    pillBg:      "rgba(10,10,10,0.88)",
    pillText:    "#fff",
    pillBorder:  "rgba(10,10,10,0.14)",
    subtext:     "rgba(10,10,10,0.28)",
};

/**
 * Dark mode colors for the ContactSection form.
 * These colors are used for labels, text, borders, and other UI elements in the form
 * when dark mode is active.
 */
export const DARK_COLORS: FormColors = {
    label:       "rgba(255,255,255,0.38)",
    optional:    "rgba(255,255,255,0.22)",
    text:        "rgba(255,255,255,0.88)",
    placeholder: "rgba(255,255,255,0.22)",
    border:      "rgba(255,255,255,0.18)",
    borderFocus: "rgba(255,255,255,0.70)",
    pillBg:      "rgba(255,255,255,0.92)",
    pillText:    "#0a0a0a",
    pillBorder:  "rgba(255,255,255,0.18)",
    subtext:     "rgba(255,255,255,0.28)",
};
