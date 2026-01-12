import {Pricing} from "@/components/sections/Pricing/pricing.types";

export const plans : Pricing[] = [
    {
        name: "Starter Build",
        price: "AUD 3,000+",
        tagline: "Best for: landing pages that need real logic.",
        description:
            "A high-converting site with forms, integrations and a polished first version — ready to ship.",
        timeline: "1–2 weeks",
        features: [
            "Conversion-focused hero + sections",
            "Forms + integrations (email/CRM)",
            "SEO & performance essentials",
            "Analytics (GA4 / PostHog) setup",
            "Deploy + basic monitoring",
        ],
        cta: "Get a quote",
        featured: false,
    },
    {
        name: "MVP Sprint",
        price: "AUD 8,000+",
        tagline: "Best for: shipping an MVP with a scalable foundation.",
        description:
            "Production-ready MVP with clean architecture, strong UX, and room to scale.",
        timeline: "4–6 weeks",
        features: [
            "Next.js app + core flows",
            "Database + API layer",
            "Auth + roles/security basics",
            "Deploy pipeline + monitoring",
            "Handoff + roadmap next steps",
        ],
        cta: "Book a call",
        featured: true,
    },
    {
        name: "Retainer",
        price: "AUD 1,000+/mo",
        tagline: "Best for: ongoing delivery with a reliable partner.",
        description:
            "Continuous improvements, fixes and features — prioritized, predictable, and fast.",
        timeline: "Monthly",
        features: [
            "Bug fixes + enhancements",
            "Performance improvements",
            "Security updates",
            "Prioritized async support",
            "Monthly dev hours (agreed scope)",
        ],
        cta: "Talk to me",
        featured: false,
    },
];