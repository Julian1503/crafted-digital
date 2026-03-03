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

export function toPricingCardProps(plan: PrismaPlan): Pricing {
    const meta = parsePlanMeta(plan.features);

    return {
        name: plan.name,
        price: formatPrice(plan.price, plan.currency, plan.interval),
        tagline: meta.tagline ?? "",
        description: plan.description ?? "",
        timeline: meta.timeline ?? "",
        features: meta.features ?? [],
        cta: meta.cta ?? "Get a quote",
        featured: plan.highlighted,
    };
}

interface PlanMeta {
    tagline?: string;
    timeline?: string;
    features?: string[];
    cta?: string;
}

function parsePlanMeta(features: string | null): PlanMeta {
    if (!features) return {};
    try {
        return JSON.parse(features) as PlanMeta;
    } catch {
        return { features: features.split(",").map((f) => f.trim()) };
    }
}

function formatPrice(price: number, currency: string, interval: string): string {
    const formatted = price.toLocaleString("en-AU");
    const prefix = currency ?? "AUD";
    const suffix = interval === "monthly" ? "/mo" : "+";
    return `${prefix} ${formatted}${suffix}`;
}
