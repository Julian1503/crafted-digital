import {Button} from "@/components/ui/button";
import {Timer} from "lucide-react";
import {cn, scrollToId} from "@/lib/utils";
import {Pricing} from "@/components/sections/Pricing/pricing.types";
import PricingFeature from "@/components/sections/Pricing/PricingFeature";

interface PricingCardProps {
    plan : Pricing;
    index: number;
    isVisible: boolean;
}

export default function PricingCard({plan, isVisible, index}: PricingCardProps) {
    return (
        <div
            key={plan.name}
            className={cn(
                "relative flex flex-col p-8 rounded-3xl border transition-all duration-300 reveal-on-scroll",
                "bg-background/5 border-white/10 ",
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
                <h3 className="text-2xl font-semibold text-background">
                    {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground/80">{plan.tagline}</p>

                <div className="pt-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground/80">
                        Starting at
                    </p>
                    <div className="text-4xl font-semibold text-background">
                        {plan.price}
                    </div>
                </div>

                <p className="text-muted-foreground/80">{plan.description}</p>

                <div
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/5 px-3 py-1 text-xs text-muted-foreground/80">
                    <Timer className="h-3.5 w-3.5"/>
                    Typical timeline:{" "}
                    <span className="font-medium text-background">
                    {plan.timeline}
                  </span>
                </div>
            </div>

            <PricingFeature features={plan.features} />

            <Button
                type="button"
                variant={plan.featured ? "default" : "outline"}
                className={cn(
                    "w-full rounded-full hover:bg-background/10",
                    !plan.featured &&
                    "text-background border-white/20 bg-transparent hover:bg-background/10",
                    plan.featured && "shadow-lg shadow-primary/15"
                )}
                onClick={() => scrollToId("contact")}
            >
                {plan.cta}
            </Button>

            <p className="mt-3 text-center text-xs text-muted-foreground/80">
                No commitment · 20 min call
            </p>
        </div>
    );
}