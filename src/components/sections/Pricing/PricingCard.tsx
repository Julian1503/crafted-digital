/**
 * @fileoverview Pricing card component.
 * Displays a single pricing plan with features, pricing, and CTA.
 */
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { cn, scrollToId } from "@/lib/utils";
import { Pricing } from "@/components/sections/Pricing/pricing.types";
import PricingFeature from "@/components/sections/Pricing/PricingFeature";

/**
 * Props for the PricingCard component.
 */
interface PricingCardProps {
    /** Pricing plan data to display */
    plan: Pricing;
    /** Index for stagger animation delay */
    index: number;
    /** Whether the card should be visible (for animation) */
    isVisible: boolean;
}

/**
 * Pricing card component displaying a single plan.
 * Shows plan name, price, timeline, features, and call-to-action.
 *
 * @param props - Plan data, index, and visibility state
 * @returns The rendered pricing card
 */
export default function PricingCard({ plan, isVisible, index }: PricingCardProps) {
    return (
        <div
            key={plan.name}
            className={cn(
                "relative flex flex-col p-8 rounded-3xl border transition-all duration-300 reveal-on-scroll",
                "bg-section-card border-section-border ",
                plan.featured &&
                "border-secondary shadow-2xl shadow-secondary/10 -translate-y-1 z-10",
                isVisible && "is-visible"
            )}
            style={{transitionDelay: `${index * 120}ms`}}
        >
            {plan.featured && (
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Best value
                </div>
            )}

            <div className="mb-6 space-y-2">
                <h3 className="text-2xl font-semibold text-section-fg">
                    {plan.name}
                </h3>
                <p className="text-sm text-section-muted">{plan.tagline}</p>

                <div className="pt-2">
                    <p className="text-xs uppercase tracking-wider text-section-muted">
                        Starting at
                    </p>
                    <div className="text-4xl font-semibold text-section-fg">
                        {plan.price}
                    </div>
                </div>

                <p className="text-section-muted">{plan.description}</p>

                <div
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-section-border bg-section-pill px-3 py-1 text-xs text-section-muted">
                    <Timer className="h-3.5 w-3.5" aria-hidden="true"/>
                    Typical timeline:{" "}
                    <span className="font-medium text-section-fg">
                    {plan.timeline}
                  </span>
                </div>
            </div>

            <PricingFeature features={plan.features} />

            <Button
                type="button"
                variant={plan.featured ? "default" : "outline"}
                className={cn(
                    "w-full rounded-full hover:bg-section-pill",
                    !plan.featured &&
                    "text-section-fg border-section-border bg-transparent hover:bg-section-pill",
                    plan.featured && "shadow-lg shadow-primary/15"
                )}
                onClick={() => scrollToId("contact")}
            >
                {plan.cta}
            </Button>

            <p className="mt-3 text-center text-xs text-section-muted">
                No commitment · 20 min call
            </p>
        </div>
    );
}