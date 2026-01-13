import {PencilRuler, Search, Code2, Rocket} from "lucide-react";
import {Process} from "@/components/sections/Process/process.types";

export const steps: Process[] = [
    {
        title: "Discover",
        range: "1–3 days",
        description:
            "We align on goals, constraints, and success metrics — so we ship the right thing fast.",
        bullets: ["Scope + priorities", "Risk & stack decisions", "Milestones & timeline"],
        icon: Search,
    },
    {
        title: "Design (optional)",
        range: "3–7 days",
        description:
            "If needed, we validate UX early with quick flows and high-fidelity screens.",
        bullets: ["User flows", "UI direction", "Clickable prototype"],
        icon: PencilRuler,
    },
    {
        title: "Build",
        range: "1–6 weeks",
        description:
            "Iterative development with weekly demos. Clean code, scalable architecture, and performance-first UI.",
        bullets: ["Weekly demos", "PR reviews & quality", "Core features shipped"],
        icon: Code2,
    },
    {
        title: "Launch & Improve",
        range: "ongoing",
        description:
            "Deploy, monitor, and iterate. Smooth handoff or ongoing support — your choice.",
        bullets: ["Deploy + monitoring", "Bugfix/stabilization", "Roadmap next steps"],
        icon: Rocket,
    },
];
