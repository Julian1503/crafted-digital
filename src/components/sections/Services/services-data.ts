/**
 * @fileoverview Service offerings data.
 * Contains the list of services displayed in the Services section.
 */
import { Service } from "@/components/sections/Services/services.types";
import { Palette, Code2, LineChart, Workflow } from "lucide-react";

/**
 * List of available services offered.
 * Each service includes title, description, outcome statement, and key deliverables.
 */
export const services: Service[] = [
    {
        title: "Custom Websites & Web Apps",
        outcome: "A fast, professional website that turns visitors into enquiries.",
        description:
            "Websites and web apps built with Next.js, React and TypeScript, live in 2 to 6 weeks from AUD 2,450. For Australian service businesses, tradies and professionals who need a site that loads fast, ranks and books work.",
        bullets: ["Business websites", "Lead generation sites", "Client portals & dashboards"],
        icon: Code2,
    },
    {
        title: "Product Design & UX",
        outcome: "Interfaces people understand in one look.",
        description:
            "User flows, UI direction and clickable prototypes before a line of code, so the build starts from a design you have already approved. Included in Growth websites and software projects, or on its own.",
        bullets: ["UI design systems", "Interactive prototypes", "UX improvements"],
        icon: Palette,
    },
    {
        title: "MVP Development",
        outcome: "A production-ready first version in 6 to 12 weeks.",
        description:
            "Roadmap, architecture and build for a first version you can put in front of real users, with weekly demos and a codebase that will not need rewriting when it works.",
        bullets: ["MVP roadmaps", "Architecture planning", "Scalable foundations"],
        icon: LineChart,
    },
    {
        title: "Custom Software & AI Automation",
        outcome: "Internal tools that take the repetitive work off your plate.",
        description:
            "CRMs, client portals, approval workflows and AI assistants built around how your business already runs. Every AI feature keeps a person in control, with an approval step, an audit trail and tests behind it.",
        bullets: ["CRMs & client portals", "Workflow & email automation", "AI assistants with human approval"],
        icon: Workflow,
    },
];

export const L = {
    label:       "rgba(10,10,10,0.55)",
    labelMid:    "rgba(10,10,10,0.62)",
    body:        "rgba(10,10,10,0.7)",
    heading:     "rgba(10,10,10,0.9)",
    headingWeak: "rgba(10,10,10,0.65)",
    border:      "rgba(10,10,10,0.08)",
    borderSub:   "rgba(10,10,10,0.06)",
    accent:      "hsl(var(--hero-accent))",
    accentBorder:"hsla(var(--hero-accent) / 0.35)",
    bg:          "hsl(var(--background))",
    mono:        "rgba(10,10,10,0.55)",
};