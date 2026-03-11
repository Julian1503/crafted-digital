/**
 * Pricing.tsx
 * Place at: @/components/sections/Pricing/Pricing.tsx
 *
 * Each card background is a canvas-painted animated organic blob/wave.
 * The animation is pure requestAnimationFrame — no external deps.
 *
 * Palette per card:
 *   01 Starter  → deep navy + slate fog
 *   02 Growth   → crimson #862219 embers + amber
 *   03 Studio   → near-black + graphite smoke   (featured — inverted)
 */
"use client";

import * as React from "react";
import { scrollToId } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";
import type { Pricing as PricingType } from "@/components/sections/Pricing/pricing.types";
import {WaveCanvas} from "@/components/sections/Pricing/WaveCanvas";
import {AnimatedPrice} from "@/components/sections/Pricing/AnimatedPrice";
import PlanCard from "@/components/sections/Pricing/PlanCard";

interface BlobConfig {
    x: number;
    y: number;
    r: number;
    color: string;
    speedX: number;
    speedY: number;
    freqX: number;
    freqY: number;
    phaseX: number;
    phaseY: number;
}

// ─── Blob palettes per plan ───────────────────────────────────────────────────

const BLOBS_STARTER: BlobConfig[] = [
    { x: 0.18, y: 0.25, r: 0.45, color: "rgba(42,34,32,0.42)", speedX: 0.12, speedY: 0.09, freqX: 0.38, freqY: 0.27, phaseX: 0, phaseY: 1.2 },
    { x: 0.75, y: 0.60, r: 0.40, color: "rgba(30,24,23,0.36)", speedX: 0.10, speedY: 0.13, freqX: 0.44, freqY: 0.33, phaseX: 2.1, phaseY: 0.8 },
    { x: 0.50, y: 0.82, r: 0.35, color: "rgba(68,40,37,0.28)", speedX: 0.09, speedY: 0.08, freqX: 0.31, freqY: 0.41, phaseX: 0.7, phaseY: 3.1 },
    { x: 0.85, y: 0.15, r: 0.30, color: "rgba(92,42,36,0.22)", speedX: 0.14, speedY: 0.07, freqX: 0.52, freqY: 0.22, phaseX: 4.2, phaseY: 1.5 },
];

const BLOBS_GROWTH: BlobConfig[] = [
    { x: 0.22, y: 0.35, r: 0.50, color: "rgba(134,33,25,0.34)", speedX: 0.11, speedY: 0.10, freqX: 0.36, freqY: 0.29, phaseX: 0, phaseY: 0.5 },
    { x: 0.70, y: 0.55, r: 0.42, color: "rgba(104,34,29,0.28)", speedX: 0.13, speedY: 0.08, freqX: 0.45, freqY: 0.38, phaseX: 1.8, phaseY: 2.4 },
    { x: 0.40, y: 0.80, r: 0.38, color: "rgba(74,28,26,0.22)", speedX: 0.08, speedY: 0.12, freqX: 0.28, freqY: 0.44, phaseX: 3.2, phaseY: 0.9 },
    { x: 0.80, y: 0.18, r: 0.32, color: "rgba(192,57,43,0.18)", speedX: 0.15, speedY: 0.09, freqX: 0.55, freqY: 0.25, phaseX: 5.0, phaseY: 1.1 },
    { x: 0.15, y: 0.70, r: 0.28, color: "rgba(56,22,21,0.24)", speedX: 0.10, speedY: 0.14, freqX: 0.42, freqY: 0.32, phaseX: 2.6, phaseY: 3.8 },
];

const BLOBS_STUDIO: BlobConfig[] = [
    { x: 0.20, y: 0.30, r: 0.52, color: "rgba(28,24,23,0.42)", speedX: 0.09, speedY: 0.10, freqX: 0.32, freqY: 0.28, phaseX: 0, phaseY: 1.8 },
    { x: 0.72, y: 0.60, r: 0.44, color: "rgba(18,16,15,0.48)", speedX: 0.12, speedY: 0.08, freqX: 0.42, freqY: 0.35, phaseX: 2.5, phaseY: 0.4 },
    { x: 0.50, y: 0.85, r: 0.36, color: "rgba(52,38,35,0.26)", speedX: 0.08, speedY: 0.13, freqX: 0.27, freqY: 0.46, phaseX: 1.1, phaseY: 2.9 },
    { x: 0.85, y: 0.20, r: 0.30, color: "rgba(134,33,25,0.12)", speedX: 0.14, speedY: 0.07, freqX: 0.50, freqY: 0.22, phaseX: 4.4, phaseY: 1.3 },
];



// ─── Config map ───────────────────────────────────────────────────────────────

interface CardConfig {
    blobs: BlobConfig[];
    baseFill: string;
    light: boolean;
    accent: string;
}

const CARD_CONFIGS: CardConfig[] = [
    {
        blobs: BLOBS_STARTER,
        baseFill: "#0d0f18",
        light: true,
        accent: "rgba(120,140,210,0.92)",
    },
    {
        blobs: BLOBS_GROWTH,
        baseFill: "#130806",
        light: true,
        accent: "rgba(230,110,60,0.96)",
    },
    {
        blobs: BLOBS_STUDIO,
        baseFill: "#090909",
        light: true,
        accent: "rgba(255,255,255,0.90)",
    },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

interface PricingProps {
    plans: PricingType[];
}

export function Pricing({ plans }: PricingProps) {
    const [sectionRef, sectionVisible] = useInView<HTMLElement>(0.05);
    const [gridRef, gridVisible] = useInView<HTMLDivElement>(0.04);

    if (!plans.length) return null;

    return (
        <section
            ref={sectionRef}
            id="pricing"
            data-header-theme="light"
            aria-labelledby="pricing-heading"
            className="overflow-hidden bg-[hsl(var(--background))] px-[clamp(1.25rem,5vw,5rem)] pb-24 pt-20"
        >
            <div className="mx-auto max-w-[1320px]">
                <div
                    className="mb-14 flex items-center gap-3"
                    style={{
                        opacity: sectionVisible ? 1 : 0,
                        transform: sectionVisible ? "none" : "translateY(1.25rem)",
                        transition: "opacity 700ms ease, transform 700ms ease",
                    }}
                >
                    <span className="font-mono text-[0.58rem] tracking-[0.24em] text-black/[0.22]">
                        004
                    </span>

                    <span className="inline-block h-px w-7 bg-black/[0.10]" />

                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-black/[0.22]">
                        Pricing
                    </span>
                </div>

                <div
                    className="mb-[clamp(2.5rem,5vw,4rem)] flex flex-wrap items-end justify-between gap-4"
                    style={{
                        opacity: sectionVisible ? 1 : 0,
                        transform: sectionVisible ? "none" : "translateY(1.5rem)",
                        transition: "opacity 700ms ease 80ms, transform 700ms ease 80ms",
                    }}
                >
                    <h2
                        id="pricing-heading"
                        className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-normal leading-[1.04] tracking-[-0.03em] text-black/[0.9]"
                    >
                        Packages
                    </h2>

                    <p className="max-w-[38ch] font-serif text-[clamp(0.82rem,1.2vw,0.95rem)] italic leading-[1.7] text-black/[0.36]">
                        Starting points — final pricing depends on scope, complexity, and timeline.
                    </p>
                </div>

                <div
                    ref={gridRef}
                    className="grid items-stretch gap-[clamp(0.75rem,2vw,1.5rem)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
                >
                    {plans.map((plan, i) => {
                        const cfg = CARD_CONFIGS[i % CARD_CONFIGS.length];

                        return (
                            <PlanCard
                                key={plan.name}
                                plan={plan}
                                index={i}
                                visible={gridVisible}
                                blobs={cfg.blobs}
                                baseFill={cfg.baseFill}
                                light={cfg.light}
                                accent={cfg.accent}
                            />
                        );
                    })}
                </div>

                <div
                    className="mt-[clamp(2rem,4vw,3.5rem)] flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.07] pt-7"
                    style={{
                        opacity: gridVisible ? 1 : 0,
                        transition: "opacity 700ms ease 500ms",
                    }}
                >
                    <div className="flex flex-wrap gap-[clamp(1rem,3vw,2.5rem)]">
                        {["Production-ready delivery", "Weekly demos", "Responsive & performance-first"].map(label => (
                            <span
                                key={label}
                                className="flex items-center gap-2 font-mono text-[0.64rem] tracking-[0.08em] text-black/[0.30]"
                            >
                                <span className="text-[0.44rem] text-[hsl(var(--hero-accent))]">✦</span>
                                {label}
                            </span>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => scrollToId("contact")}
                        className="whitespace-nowrap bg-transparent font-mono text-[0.66rem] tracking-[0.1em] text-black/[0.28] transition-colors duration-200 hover:text-black/[0.82]"
                    >
                        Not sure which plan? Message me →
                    </button>
                </div>
            </div>
        </section>
    );
}