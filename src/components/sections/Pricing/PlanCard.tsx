import type {Pricing as PricingType} from "@/components/sections/Pricing/pricing.types";
import * as React from "react";
import {BlobConfig, WaveCanvas} from "@/components/sections/Pricing/WaveCanvas";
import {AnimatedPrice} from "@/components/sections/Pricing/AnimatedPrice";
import {scrollToId} from "@/lib/utils";
import FeatureRow from "@/components/sections/Pricing/FeatureRow";

export default function PlanCard({
                      plan,
                      index,
                      visible,
                      blobs,
                      baseFill,
                      light,
                      accent,
                  }: {
    plan: PricingType;
    index: number;
    visible: boolean;
    blobs: BlobConfig[];
    baseFill: string;
    light: boolean;
    accent: string;
}) {
    const delay = index * 100;
    const fgMid = light ? "rgba(255,255,255,0.44)" : "rgba(10,10,10,0.40)";
    const fgDim = light ? "rgba(255,255,255,0.24)" : "rgba(10,10,10,0.22)";

    const mouseRef = React.useRef<{ x: number; y: number; active: boolean }>({
        x: 0.5,
        y: 0.5,
        active: false,
    });
    const cardRef = React.useRef<HTMLDivElement>(null);

    const onMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const r = cardRef.current?.getBoundingClientRect();
        if (!r) return;

        mouseRef.current = {
            x: (e.clientX - r.left) / r.width,
            y: (e.clientY - r.top) / r.height,
            active: true,
        };
    }, []);

    const onLeave = React.useCallback(() => {
        mouseRef.current = { ...mouseRef.current, active: false };
    }, []);

    return (
        <div
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={`relative flex cursor-default flex-col overflow-hidden rounded-[1.25rem] px-[2.2rem] py-[2.4rem] ${
                plan.featured ? "-my-6" : ""
            } ${light ? "border border-white/[0.09]" : "border border-black/[0.08]"}`}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : `translateY(${plan.featured ? "2.5rem" : "1.8rem"})`,
                transition: `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
            }}
        >
            <WaveCanvas blobs={blobs} baseColor={baseFill} opacity={1} mouseRef={mouseRef} />

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
                    backgroundSize: "160px",
                    opacity: 0.55,
                }}
            />

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{
                    background: light
                        ? "radial-gradient(ellipse at 50% 0%, transparent 0%, rgba(5,5,8,0.38) 100%)"
                        : "radial-gradient(ellipse at 50% 0%, transparent 0%, rgba(248,246,242,0.22) 100%)",
                }}
            />

            <div className="relative z-[2] flex flex-1 flex-col">
                <div className="mb-[2.2rem] flex items-center justify-between">
                    <div className="flex items-center gap-[0.65rem]">
                        <span
                            className="font-mono text-[0.56rem] tracking-[0.24em]"
                            style={{ color: fgDim }}
                        >
                            {String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                            className="inline-block h-px w-[18px]"
                            style={{ background: fgDim }}
                        />

                        <span
                            className="font-serif text-[clamp(0.95rem,1.4vw,1.12rem)] italic tracking-[-0.02em]"
                            style={{ color: fgMid }}
                        >
                            {plan.name}
                        </span>
                    </div>

                    {plan.featured && (
                        <span className="rounded-full border border-white/[0.18] px-[0.75rem] py-[0.3rem] font-mono text-[0.48rem] uppercase tracking-[0.18em] text-white/[0.6]">
                            Best value
                        </span>
                    )}
                </div>

                <div className="mb-[0.35rem]">
                    <span
                        className="font-serif text-[clamp(3.4rem,5.5vw,5.6rem)] font-normal leading-none tracking-[-0.045em]"
                        style={{ color: accent }}
                    >
                        <AnimatedPrice price={plan.price} trigger={visible} />
                    </span>
                </div>

                <div className="mb-[1.4rem] flex items-center gap-[0.6rem]">
                    <span
                        className="font-mono text-[0.56rem] uppercase tracking-[0.18em]"
                        style={{ color: fgDim }}
                    >
                        starting at
                    </span>

                    <span
                        className="inline-block h-[3px] w-[3px] shrink-0 rounded-full"
                        style={{ background: fgDim }}
                    />

                    <span
                        className="font-mono text-[0.56rem] uppercase tracking-[0.12em]"
                        style={{ color: fgMid }}
                    >
                        {plan.timeline}
                    </span>
                </div>

                <p
                    className="mb-[1.8rem] max-w-[30ch] font-serif text-[clamp(0.86rem,1.2vw,1rem)] italic leading-[1.62] tracking-[-0.01em]"
                    style={{ color: fgMid }}
                >
                    {plan.tagline ?? plan.description}
                </p>

                <div
                    className="mb-[2rem] flex-1"
                    style={{
                        borderTop: `1px solid ${light ? "rgba(255,255,255,0.08)" : "rgba(10,10,10,0.08)"}`,
                    }}
                >
                    {plan.features.map((f, fi) => (
                        <FeatureRow
                            key={f}
                            label={f}
                            delay={fi * 45}
                            light={light}
                        />
                    ))}
                </div>

                <div className="flex flex-col gap-[0.55rem]">
                    <button
                        type="button"
                        onClick={() => scrollToId("contact")}
                        className={`flex w-full items-center justify-center gap-[0.6rem] rounded-full px-[1.4rem] py-[0.9rem] font-mono text-[0.68rem] uppercase tracking-[0.12em] transition-[opacity,transform] duration-[220ms] ${
                            plan.featured
                                ? "border border-white/[0.18] bg-white/[0.10] text-white/[0.88] backdrop-blur-[8px]"
                                : light
                                    ? "border border-white/[0.14] bg-white/[0.10] text-white/[0.80] backdrop-blur-[6px]"
                                    : "border border-black/[0.12] bg-black/[0.08] text-black/[0.72]"
                        }`}
                        onMouseEnter={e => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.opacity = "0.76";
                            el.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={e => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.opacity = "1";
                            el.style.transform = "";
                        }}
                    >
                        {plan.cta ?? "Get started"}

                        <span
                            aria-hidden
                            className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full text-[0.6rem]"
                            style={{
                                border: light
                                    ? "1px solid rgba(255,255,255,0.3)"
                                    : "1px solid rgba(10,10,10,0.2)",
                            }}
                        >
                            ↗
                        </span>
                    </button>

                    <p
                        className="text-center font-mono text-[0.52rem] uppercase tracking-[0.14em]"
                        style={{ color: fgDim }}
                    >
                        No commitment · 20 min call
                    </p>
                </div>
            </div>
        </div>
    );
}