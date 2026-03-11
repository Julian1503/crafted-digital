/**
 * @fileoverview Service offerings data.
 * Contains the list of services displayed in the Services section.
 */
import { Service } from "@/components/sections/Services/services.types";
import { Palette, Code2, LineChart } from "lucide-react";

/**
 * List of available services offered.
 * Each service includes title, description, outcome statement, and key deliverables.
 */
export const services: Service[] = [
    {
        title: "Custom Websites & Web Apps",
        outcome: "A fast, professional website that converts.",
        description:
            "High-performance websites and web applications built with Next.js, React, and TypeScript. Ideal for Australian service businesses, tradies, and professionals who need a site that works hard for them.",
        bullets: ["Business websites", "Lead generation sites", "Client portals & dashboards"],
        icon: Code2,
    },
    {
        title: "Product Design & UX",
        outcome: "Polished interfaces that build trust.",
        description:
            "User-focused design that balances aesthetics with usability. I create interfaces that feel intuitive and professional, helping your Australian business stand out from the competition.",
        bullets: ["UI design systems", "Interactive prototypes", "UX improvements"],
        icon: Palette,
    },
    {
        title: "MVP Development",
        outcome: "Launch your idea faster with expert guidance.",
        description:
            "Strategic guidance and rapid development to help Australian startups and businesses validate ideas quickly. From initial concept to production-ready MVP.",
        bullets: ["MVP roadmaps", "Architecture planning", "Scalable foundations"],
        icon: LineChart,
    },
];

export const L = {
    label:       "rgba(10,10,10,0.22)",
    labelMid:    "rgba(10,10,10,0.38)",
    body:        "rgba(10,10,10,0.45)",
    heading:     "rgba(10,10,10,0.9)",
    headingWeak: "rgba(10,10,10,0.55)",
    border:      "rgba(10,10,10,0.08)",
    borderSub:   "rgba(10,10,10,0.06)",
    accent:      "hsl(var(--hero-accent))",
    accentBorder:"hsla(var(--hero-accent) / 0.35)",
    bg:          "hsl(var(--background))",
    mono:        "rgba(10,10,10,0.22)",
};