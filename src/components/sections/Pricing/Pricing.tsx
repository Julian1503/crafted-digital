/**
 * @fileoverview Pricing section component.
 * Displays available pricing packages/plans with features and CTAs.
 */
"use client";

import * as React from "react";
import { Sparkles, Timer, ShieldCheck } from "lucide-react";
import { useScrollAnimation } from "@/lib/use-scroll-animation";
import { scrollToId } from "@/lib/utils";
import PricingCard from "@/components/sections/Pricing/PricingCard";
import { plans } from "@/components/sections/Pricing/pricing-data";

/**
 * Pricing section component displaying available plans and pricing.
 * Features a header with included benefits, pricing cards, and a CTA.
 *
 * @returns The rendered Pricing section
 */
export function Pricing() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section
            id="pricing"
            className="py-24 bg-foreground text-background overflow-hidden"
            aria-labelledby="pricing-heading"
        >
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/5 px-3 py-1 text-sm text-background/80 backdrop-blur">
                        <Sparkles className="h-4 w-4 text-secondary" aria-hidden="true" />
                        Simple packages · Custom scope if needed
                    </div>

                    <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight text-background">
                        Packages that fit how teams build
                    </h2>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground/80">
                        Straightforward starting points. Final pricing depends on scope,
                        complexity, and timelines.
                    </p>
                </div>

                {/* “What’s included” bar */}
                <div className="mx-auto mb-10 max-w-6xl rounded-2xl border border-white/10 bg-background/5 p-5 backdrop-blur">
                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-secondary" />
                            <div>
                                <p className="text-sm font-medium text-background">
                                    Production-ready delivery
                                </p>
                                <p className="text-xs text-muted-foreground/80">
                                    Clean code, deploy, basic monitoring
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Timer className="h-5 w-5 text-secondary" aria-hidden="true" />
                            <div>
                                <p className="text-sm font-medium text-background">
                                    Weekly demos
                                </p>
                                <p className="text-xs text-muted-foreground/80">
                                    Fast feedback loops, no surprises
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 text-secondary" aria-hidden="true" />
                            <div>
                                <p className="text-sm font-medium text-background">UX polish</p>
                                <p className="text-xs text-muted-foreground/80">
                                    Responsive UI, performance-first
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div ref={ref} className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" >
                    {plans?.map((plan, index) => (
                        <PricingCard plan={plan} index={index} key={plan.name} isVisible={isVisible} />
                    ))}
                </div>

                <div className="mt-12 text-center text-sm text-muted-foreground/80">
                    Not sure which package fits?{" "}
                    <button
                        type="button"
                        onClick={() => scrollToId("contact")}
                        className="text-secondary hover:underline font-medium"
                    >
                        Message me
                    </button>{" "}
                    and I’ll help you choose.
                </div>


            </div>
        </section>
    );
}
