import {FormColors} from "@/components/sections/Contact/contact.types";

/**
 * Constants for the Contact section: form options and colour themes.
 */
export const PROJECT_TOPICS = [
    "Website",
    "Web app / portal",
    "Custom software & automation",
    "Design / UX",
    "Fix or improve an existing site",
    "Other",
];

/**
 * Base styles for form elements. Focus is shown with the global focus-visible
 * outline plus the bottom border colour change; never remove the outline.
 */
export const BASE =
    "w-full bg-transparent border-0 border-b pb-2 text-[0.92rem] transition-[border-color,color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[hsl(var(--hero-accent))] rounded-none";

/**
 * Budget options, in AUD.
 */
export const BUDGET_OPTIONS = [
    { value: "",                label: "Select a budget…" },
    { value: "Under AUD 2,500", label: "Under AUD 2,500" },
    { value: "AUD 2,500–5,000", label: "AUD 2,500–5,000" },
    { value: "AUD 5,000–10,000", label: "AUD 5,000–10,000" },
    { value: "AUD 10,000+",     label: "AUD 10,000+" },
    { value: "Not sure yet",    label: "Not sure yet" },
];

/**
 * Timeline options.
 */
export const TIMELINE_OPTIONS = [
    { value: "",           label: "Select a timeline…" },
    { value: "ASAP",       label: "As soon as possible" },
    { value: "2–4 weeks",  label: "2–4 weeks" },
    { value: "1–2 months", label: "1–2 months" },
    { value: "Flexible",   label: "Flexible" },
];

/**
 * Preferred contact methods.
 */
export const CONTACT_METHODS = ["Email", "Call"];

/**
 * Colour themes for light and dark form surfaces. Labels and helper text sit
 * at or above 4.5:1 against their background.
 */
export const LIGHT_COLORS: FormColors = {
    label:       "rgba(10,10,10,0.62)",
    optional:    "rgba(10,10,10,0.62)",
    text:        "rgba(10,10,10,0.88)",
    placeholder: "rgba(10,10,10,0.4)",
    border:      "rgba(10,10,10,0.2)",
    borderFocus: "rgba(10,10,10,0.75)",
    pillBg:      "rgba(10,10,10,0.88)",
    pillText:    "#fff",
    pillBorder:  "rgba(10,10,10,0.2)",
    subtext:     "rgba(10,10,10,0.62)",
};

export const DARK_COLORS: FormColors = {
    label:       "rgba(255,255,255,0.72)",
    optional:    "rgba(255,255,255,0.55)",
    text:        "rgba(255,255,255,0.92)",
    placeholder: "rgba(255,255,255,0.45)",
    border:      "rgba(255,255,255,0.22)",
    borderFocus: "rgba(255,255,255,0.8)",
    pillBg:      "rgba(255,255,255,0.92)",
    pillText:    "#0a0a0a",
    pillBorder:  "rgba(255,255,255,0.28)",
    subtext:     "rgba(255,255,255,0.62)",
};
