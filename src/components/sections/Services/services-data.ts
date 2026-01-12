import {Service} from "@/components/sections/Services/services.types";
import { Palette, Code2, LineChart } from "lucide-react";

export const services : Service[] = [
    {
        title: "Web Apps (Next.js)",
        outcome: "Ship fast with a scalable foundation.",
        description:
            "High-performance web apps built with Next.js, TypeScript, and a clean architecture.",
        bullets: ["Dashboards & SaaS", "Integrations & APIs", "Performance & DX"],
        icon: Code2,
    },
    {
        title: "Product Design & UX",
        outcome: "Polished UI that converts and feels premium.",
        description:
            "Design that balances aesthetics and usability — built to support product growth.",
        bullets: ["UI systems", "Prototypes", "UX improvements"],
        icon: Palette,
    },
    {
        title: "Technical Strategy",
        outcome: "Make smart decisions before you build.",
        description:
            "CTO-style guidance on stack, architecture, and an execution plan that reduces risk.",
        bullets: ["MVP roadmap", "Architecture review", "Delivery plan"],
        icon: LineChart,
    },
];