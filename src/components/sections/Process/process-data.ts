/**
 * @fileoverview Process steps data.
 * Contains the list of development process phases displayed in the Process section.
 */
import { PencilRuler, Search, Code2, Rocket } from "lucide-react";
import { Process } from "@/components/sections/Process/process.types";

/**
 * Development process steps from discovery through launch.
 * Each step includes title, time range, description, and key deliverables.
 */
export const steps: Process[] = [
    {
        title: "Discover",
        range: "1–3 days",
        description:
            "We align on goals, constraints, and success metrics — so we ship the right thing fast.",
        bullets: ["Scope + priorities", "Risk & stack decisions", "Milestones & timeline"],
        icon: Search,
        image: "https://images.unsplash.com/photo-1534685785745-60a2cea0ec34?q=80&w=1450&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Design (optional)",
        range: "3–7 days",
        description:
            "If needed, we validate UX early with quick flows and high-fidelity screens.",
        bullets: ["User flows", "UI direction", "Clickable prototype"],
        icon: PencilRuler,
        image:"https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        title: "Build",
        range: "1–6 weeks",
        description:
            "Iterative development with weekly demos. Clean code, scalable architecture, and performance-first UI.",
        bullets: ["Weekly demos", "PR reviews & quality", "Core features shipped"],
        icon: Code2,
        image:"https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        title: "Launch & Improve",
        range: "ongoing",
        description:
            "Deploy, monitor, and iterate. Smooth handoff or ongoing support — your choice.",
        bullets: ["Deploy + monitoring", "Bugfix/stabilization", "Roadmap next steps"],
        icon: Rocket,
        image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
];
