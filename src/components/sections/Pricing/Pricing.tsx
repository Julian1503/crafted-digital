/**
 * @fileoverview Pricing section — "stage" selector layout.
 *
 * Deliberately different from every other section:
 *   • Dark bg (matches original bg-foreground) but no cards
 *   • Three plan names as large serif selector tabs at the top
 *   • A single focused "stage" below that transitions between plans
 *   • Price counts up/down on plan change
 *   • Features stagger in as a flowing list
 *   • Mobile: stacked vertical plan switcher
 */
"use client";

import * as React from "react";
import { scrollToId } from "@/lib/utils";
import type { Pricing as PricingType } from "@/components/sections/Pricing/pricing.types";

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView<T extends Element>(
    threshold = 0.08
): [React.RefObject<T | null>, boolean] {
    const ref = React.useRef<T>(null);
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => { if (entry?.isIntersecting) { setVisible(true); io.disconnect(); } },
            { threshold }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [threshold]);
    return [ref, visible];
}

function useReducedMotion(): boolean {
    const [reduced, setReduced] = React.useState(false);
    React.useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        const h = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq.addEventListener("change", h);
        return () => mq.removeEventListener("change", h);
    }, []);
    return reduced;
}

// ─── Animated price counter ───────────────────────────────────────────────────

/**
 * Parses a price string like "$4,500" → 4500.
 * Returns null if not parseable (e.g. "Custom").
 */
function parsePrice(price: string): number | null {
    const n = Number(price.replace(/[^0-9]/g, ""));
    return isNaN(n) || n === 0 ? null : n;
}

function AnimatedPrice({
                           price,
                           reduced,
                       }: {
    price: string;
    reduced: boolean;
}) {
    const numeric = parsePrice(price);
    const [display, setDisplay] = React.useState(numeric ?? 0);
    const rafRef = React.useRef<number>(0);
    const prevRef = React.useRef<number>(numeric ?? 0);

    React.useEffect(() => {
        if (numeric === null) return;
        if (reduced) { setDisplay(numeric); prevRef.current = numeric; return; }

        const from = prevRef.current;
        const to   = numeric;
        const DURATION = 600;
        const start = performance.now();

        cancelAnimationFrame(rafRef.current);
        const tick = (now: number) => {
            const t    = Math.min((now - start) / DURATION, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(from + (to - from) * ease));
            if (t < 1) rafRef.current = requestAnimationFrame(tick);
            else prevRef.current = to;
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [numeric, reduced]);

    if (numeric === null) {
        return (
            <span style={{ color: "rgba(10,10,10,0.9)" }}>
                {price}
            </span>
        );
    }

    // Rebuild currency symbol / suffix from original string
    const symbol = price.match(/^[^0-9]*/)?.[0] ?? "";
    const suffix = price.match(/[^0-9,]*$/)?.[0] ?? "";

    return (
        <span style={{ color: "rgba(10,10,10,0.9)" }}>
            {symbol}
            {display.toLocaleString()}
            {suffix}
        </span>
    );
}

// ─── Feature List ─────────────────────────────────────────────────────────────

function FeatureList({
                         features,
                         planKey,
                         visible,
                     }: {
    features: string[];
    planKey: string;
    visible: boolean;
}) {
    return (
        <ul className="space-y-0" aria-label="Plan features">
            {features.map((f, i) => (
                <li
                    key={`${planKey}-${i}`}
                    className="flex items-start gap-3 py-2.5 border-b"
                    style={{
                        borderColor:  "rgba(10,10,10,0.07)",
                        opacity:      visible ? 1 : 0,
                        transform:    visible ? "translateX(0)" : "translateX(-12px)",
                        transition:   `opacity 400ms ease ${i * 55}ms, transform 400ms cubic-bezier(0.16,1,0.3,1) ${i * 55}ms`,
                    }}
                >
                    <span
                        className="shrink-0 mt-[0.2em] text-[0.65rem]"
                        style={{ color: "hsl(var(--hero-accent))" }}
                        aria-hidden="true"
                    >
                        ✦
                    </span>
                    <span className="text-[0.82rem] leading-snug" style={{ color: "rgba(10,10,10,0.55)" }}>
                        {f}
                    </span>
                </li>
            ))}
        </ul>
    );
}

// ─── Plan Selector Tab ────────────────────────────────────────────────────────

function PlanTab({
                     plan,
                     index,
                     total,
                     active,
                     onClick,
                     visible,
                 }: {
    plan: PricingType;
    index: number;
    total: number;
    active: boolean;
    onClick: () => void;
    visible: boolean;
}) {
    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            className="relative text-left group"
            style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? "translateY(0)" : "translateY(1.4rem)",
                transition: `opacity 600ms ease ${index * 100}ms, transform 600ms ease ${index * 100}ms`,
                flex: "1 1 0",
                minWidth: 0,
            }}
        >
            {/* Active underline */}
            <span
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                    background:  "hsl(var(--hero-accent))",
                    transform:   active ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transition:  "transform 400ms cubic-bezier(0.16,1,0.3,1)",
                }}
                aria-hidden="true"
            />

            <div className="pb-5 pr-4">
                {/* Index */}
                <span
                    className="block font-mono text-[0.58rem] tracking-[0.22em] uppercase mb-2 transition-colors duration-300"
                    style={{ color: active ? "rgba(10,10,10,0.45)" : "rgba(10,10,10,0.18)" }}
                >
                    {String(index + 1).padStart(2, "0")}
                </span>

                {/* Plan name */}
                <span
                    className="block font-serif leading-none tracking-[-0.02em] transition-all duration-400"
                    style={{
                        fontSize:  "clamp(1.3rem, 3vw, 2.4rem)",
                        color:     active ? "rgba(10,10,10,0.9)" : "rgba(10,10,10,0.28)",
                        fontStyle: active ? "italic" : "normal",
                    }}
                >
                    {plan.name}
                </span>

                {/* Featured badge */}
                {plan.featured && (
                    <span
                        className="mt-2 inline-block text-[0.6rem] tracking-[0.15em] uppercase px-2.5 py-0.5 rounded-full"
                        style={{
                            background: "hsl(var(--hero-accent) / 0.15)",
                            color:      "hsl(var(--hero-accent))",
                            border:     "1px solid hsl(var(--hero-accent) / 0.25)",
                        }}
                    >
                        Best value
                    </span>
                )}
            </div>
        </button>
    );
}

// ─── Stage Panel ──────────────────────────────────────────────────────────────

function StagePanel({
                        plan,
                        planKey,
                        reduced,
                        entering,
                    }: {
    plan: PricingType;
    planKey: string;
    reduced: boolean;
    entering: boolean;
}) {
    return (
        <div
            style={{
                opacity:    entering ? 1 : 0,
                transform:  entering ? "translateY(0)" : "translateY(12px)",
                transition: reduced ? "none" : "opacity 380ms ease, transform 380ms cubic-bezier(0.16,1,0.3,1)",
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-start">

                {/* Left: price + tagline + features */}
                <div>
                    {/* Price */}
                    <div className="mb-1 flex items-baseline gap-3 flex-wrap">
                        <p
                            className="font-serif font-normal leading-none tracking-[-0.04em]"
                            style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
                        >
                            <AnimatedPrice price={plan.price} reduced={reduced} />
                        </p>
                        <span
                            className="text-[0.7rem] tracking-[0.1em] uppercase"
                            style={{ color: "rgba(10,10,10,0.3)" }}
                        >
                            starting at
                        </span>
                    </div>

                    {/* Timeline */}
                    <p
                        className="mb-6 text-[0.72rem] tracking-[0.12em] uppercase"
                        style={{ color: "rgba(10,10,10,0.32)" }}
                    >
                        Typical timeline:{" "}
                        <span style={{ color: "rgba(10,10,10,0.65)" }}>{plan.timeline}</span>
                    </p>

                    {/* Tagline */}
                    <p
                        className="mb-8 font-serif leading-[1.3] tracking-[-0.01em]"
                        style={{
                            fontSize:  "clamp(1.05rem, 2vw, 1.35rem)",
                            color:     "rgba(10,10,10,0.45)",
                            fontStyle: "italic",
                            maxWidth:  "44ch",
                        }}
                    >
                        {plan.tagline ?? plan.description}
                    </p>

                    {/* Features */}
                    <FeatureList
                        features={plan.features}
                        planKey={planKey}
                        visible={entering}
                    />
                </div>

                {/* Right: CTA block */}
                <div
                    className="md:sticky md:top-28 flex flex-col gap-4 md:min-w-[220px]"
                    style={{
                        opacity:    entering ? 1 : 0,
                        transform:  entering ? "translateY(0)" : "translateY(8px)",
                        transition: reduced ? "none" : "opacity 500ms ease 200ms, transform 500ms ease 200ms",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => scrollToId("contact")}
                        className="group flex items-center justify-center gap-2 rounded-full text-[0.78rem] font-medium tracking-wide whitespace-nowrap"
                        style={{
                            background:    "hsl(var(--hero-accent))",
                            color:         "#fff",
                            padding:       "0.85rem 1.8rem",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            transition:    "background 0.25s, transform 0.2s",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background   = "hsl(var(--hero-accent-dark))";
                            (e.currentTarget as HTMLElement).style.transform    = "translateY(-2px)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background   = "hsl(var(--hero-accent))";
                            (e.currentTarget as HTMLElement).style.transform    = "";
                        }}
                    >
                        {plan.cta ?? "Get started"}
                        <span
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[0.75rem] group-hover:rotate-45"
                            style={{
                                border:     "1.5px solid rgba(255,255,255,0.4)",
                                transition: "transform 0.25s",
                            }}
                        >
                            ↗
                        </span>
                    </button>

                    <p className="text-center text-[0.68rem]" style={{ color: "rgba(10,10,10,0.32)" }}>
                        No commitment · 20 min call
                    </p>

                    {/* Description below CTA */}
                    {plan.description && plan.description !== plan.tagline && (
                        <p
                            className="mt-2 text-[0.75rem] leading-relaxed text-center"
                            style={{ color: "rgba(10,10,10,0.35)", maxWidth: "24ch", margin: "0 auto" }}
                        >
                            {plan.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

interface PricingProps {
    plans: PricingType[];
}

export function Pricing({ plans }: PricingProps) {
    const [sectionRef, sectionVisible] = useInView<HTMLElement>(0.06);
    const reduced = useReducedMotion();

    // Default to featured plan, fallback to first
    const defaultIndex = plans.findIndex(p => p.featured);
    const [activeIndex, setActiveIndex] = React.useState(defaultIndex >= 0 ? defaultIndex : 0);
    // Track "entering" state for exit/enter transition
    const [entering, setEntering] = React.useState(true);
    const [displayIndex, setDisplayIndex] = React.useState(activeIndex);

    const switchPlan = (i: number) => {
        if (i === activeIndex) return;
        // Exit
        setEntering(false);
        setTimeout(() => {
            setDisplayIndex(i);
            setActiveIndex(i);
            setEntering(true);
        }, reduced ? 0 : 220);
    };

    // Re-enter on mount
    React.useEffect(() => {
        if (sectionVisible) setEntering(true);
    }, [sectionVisible]);

    const activePlan = plans[displayIndex];

    if (!plans.length) return null;

    return (
        <section
            ref={sectionRef}
            id="pricing"
            data-header-theme="light"
            className="py-16 md:py-24 overflow-hidden"
            style={{ background: "hsl(var(--background))" }}
            aria-labelledby="pricing-heading"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">

                {/* ── Header ──────────────────────────────────────────────── */}
                <div
                    className="will-change-[opacity,transform] mb-12 md:mb-16"
                    style={{
                        opacity:    sectionVisible ? 1 : 0,
                        transform:  sectionVisible ? "translateY(0)" : "translateY(1.75rem)",
                        transition: "opacity 700ms ease, transform 700ms ease",
                    }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <span
                            className="font-mono text-[0.62rem] tracking-[0.25em] uppercase select-none"
                            style={{ color: "rgba(10,10,10,0.22)" }}
                        >
                            004
                        </span>
                        <span
                            className="h-px w-7 shrink-0"
                            style={{ background: "rgba(10,10,10,0.12)" }}
                            aria-hidden="true"
                        />
                        <span
                            className="text-[0.62rem] tracking-[0.2em] uppercase"
                            style={{ color: "rgba(10,10,10,0.22)" }}
                        >
                            Pricing
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <h2
                            id="pricing-heading"
                            className="font-serif font-normal leading-[1.04] tracking-[-0.025em]"
                            style={{
                                fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
                                color:    "rgba(10,10,10,0.9)",
                            }}
                        >
                            Packages
                        </h2>
                        <p
                            className="max-w-[38ch] text-[0.85rem] leading-relaxed md:text-right"
                            style={{ color: "rgba(10,10,10,0.38)" }}
                        >
                            Starting points — final pricing depends on scope, complexity, and timelines.
                        </p>
                    </div>
                </div>

                {/* ── Plan selector tabs ───────────────────────────────────── */}
                <div
                    className="flex gap-0 border-b mb-10 md:mb-14"
                    style={{ borderColor: "rgba(10,10,10,0.1)" }}
                    role="tablist"
                    aria-label="Pricing plans"
                >
                    {plans.map((plan, i) => (
                        <PlanTab
                            key={plan.name}
                            plan={plan}
                            index={i}
                            total={plans.length}
                            active={activeIndex === i}
                            onClick={() => switchPlan(i)}
                            visible={sectionVisible}
                        />
                    ))}
                </div>

                {/* ── Stage ────────────────────────────────────────────────── */}
                {activePlan && (
                    <StagePanel
                        plan={activePlan}
                        planKey={`plan-${displayIndex}`}
                        reduced={reduced}
                        entering={entering && sectionVisible}
                    />
                )}

                {/* ── Footer note ──────────────────────────────────────────── */}
                <div
                    className="mt-14 md:mt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8"
                    style={{
                        borderTop:  "1px solid rgba(10,10,10,0.08)",
                        opacity:    sectionVisible ? 1 : 0,
                        transition: "opacity 700ms ease 600ms",
                    }}
                >
                    <div className="flex flex-wrap gap-x-8 gap-y-3">
                        {[
                            { icon: "✦", label: "Production-ready delivery" },
                            { icon: "✦", label: "Weekly demos" },
                            { icon: "✦", label: "Responsive & performance-first" },
                        ].map(({ icon, label }) => (
                            <span key={label} className="flex items-center gap-2 text-[0.72rem]" style={{ color: "rgba(10,10,10,0.35)" }}>
                                <span style={{ color: "hsl(var(--hero-accent))", fontSize: "0.55rem" }}>{icon}</span>
                                {label}
                            </span>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => scrollToId("contact")}
                        className="text-[0.72rem] transition-colors duration-200 whitespace-nowrap"
                        style={{ color: "rgba(10,10,10,0.32)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(10,10,10,0.9)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(10,10,10,0.32)"; }}
                    >
                        Not sure? Message me →
                    </button>
                </div>
            </div>
        </section>
    );
}