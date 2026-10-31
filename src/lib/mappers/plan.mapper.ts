import type { Pricing } from "@/components/sections/Pricing/pricing.types";

interface PrismaPlan {
    name: string;
    description: string | null;
    price: number;
    currency: string;
    interval: string;
    features: string | null;
    highlighted: boolean;
}

/**
 * Fallback "best for" lines keyed by plan name. The admin can override them by
 * adding a `bestFor` field to the plan's features JSON.
 */
const BEST_FOR_DEFAULTS: Record<string, string> = {
    "Starter Website": "A tradie, clinic or consultant who needs a credible site live in about two weeks.",
    "Growth Website": "A business that wants a CMS it can edit, better enquiries and room to add pages.",
    "Custom Software & AI Automation": "A team replacing spreadsheets and copy-paste with a tool built around how it works.",
    "Ongoing Tech Partner": "Anyone who wants a developer on call each month for fixes, pages and automations.",
};

export function toPricingCardProps(plan: PrismaPlan): Pricing {
    const meta = parsePlanMeta(plan.features);

    return {
        name: plan.name,
        price: formatPrice(plan.price, plan.currency, plan.interval),
        tagline: meta.tagline ?? "",
        bestFor: meta.bestFor ?? BEST_FOR_DEFAULTS[plan.name],
        description: plan.description ?? "",
        timeline: meta.timeline ?? "",
        features: meta.features ?? [],
        cta: meta.cta ?? "Get a fixed quote",
        featured: plan.highlighted,
    };
}

interface PlanMeta {
    tagline?: string;
    bestFor?: string;
    timeline?: string;
    features?: string[];
    cta?: string;
}

function parsePlanMeta(features: string | null): PlanMeta {
    if (!features) return {};
    try {
        return JSON.parse(features) as PlanMeta;
    } catch {
        return { features: features.split("\n").map((f) => f.trim()) };
    }
}

function formatPrice(price: number, currency: string, interval: string): string {
    const formatted = price.toLocaleString("en-AU");
    const prefix = currency ?? "AUD";
    const suffix = interval === "monthly" ? "/mo" : "+";
    return `${prefix} ${formatted}${suffix}`;
}
