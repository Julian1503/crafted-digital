/**
 * @fileoverview Process section — redesigned to match the dark editorial
 * aesthetic of Hero / Work. No cards. Split layout: sticky media panel (left)
 * + numbered accordion rows (right). Mirrors the Work secondary-preview
 * pattern so the two sections feel intentionally related.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { steps } from "@/components/sections/Process/process-data";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Extend your existing Step type with optional media.
 * In process-data.ts add `image?: string` and/or `video?: string` to each step.
 */
interface Step {
    title: string;
    range: string;
    description: string;
    bullets: string[];
    icon: React.ElementType;
    /** Optional: Cloudinary / any URL for a still image */
    image?: string;
    /** Optional: URL for a looping mp4 / webm */
    video?: string;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView<T extends Element>(
    threshold = 0.08
): [React.RefObject<T | null>, boolean] {
    const ref = useRef<T>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setVisible(true);
                    io.disconnect();
                }
            },
            { threshold }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [threshold]);

    return [ref, visible];
}

// ─── FadeUp ───────────────────────────────────────────────────────────────────

function FadeUp({
                    children,
                    delay = 0,
                    visible,
                    className,
                }: {
    children: React.ReactNode;
    delay?: number;
    visible: boolean;
    className?: string;
}) {
    return (
        <div
            className={cn("will-change-[transform,opacity]", className)}
            style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? "translateY(0)" : "translateY(1.75rem)",
                transition: `opacity 700ms ease ${delay}ms, transform 700ms ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

// ─── Media Panel ─────────────────────────────────────────────────────────────

function MediaPanel({
                        step,
                        index,
                        reduced,
                    }: {
    step: Step | undefined;
    index: number;
    reduced: boolean;
}) {
    const hasVideo = !!step?.video;
    const hasImage = !!step?.image;

    return (
        <div className="relative w-full h-full min-h-[26rem] overflow-hidden bg-white/[0.025] rounded-2xl">
            {/* Subtle grid texture when no media */}
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "linear-gradient(hsl(0 0% 100% / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Video */}
            {hasVideo && (
                <video
                    key={step!.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        animation: reduced ? undefined : "fadeIn 500ms ease",
                    }}
                >
                    <source src={step!.video} type="video/mp4" />
                </video>
            )}

            {/* Image */}
            {!hasVideo && hasImage && (
                <div
                    key={step!.image}
                    className="absolute inset-0"
                    style={{
                        animation: reduced ? undefined : "fadeIn 500ms ease, zoomIn 800ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                >
                    <Image
                        src={step!.image!}
                        alt={step?.title ?? "Process step"}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                        priority={index === 0}
                    />
                </div>
            )}

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

            {/* Step index label */}
            <div className="absolute top-6 left-6">
                <span
                    className="font-mono text-[0.6rem] tracking-[0.25em] uppercase"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                >
                    {String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                </span>
            </div>

            {/* Big step number */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span
                    className="font-serif select-none"
                    style={{
                        fontSize:   "clamp(7rem, 18vw, 14rem)",
                        lineHeight: 1,
                        color:      "rgba(255,255,255,0.04)",
                        letterSpacing: "-0.05em",
                    }}
                    aria-hidden="true"
                >
                    {String(index + 1).padStart(2, "0")}
                </span>
            </div>

            {/* Bottom content */}
            {step && (
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p
                        className="font-serif leading-[1.05] tracking-[-0.025em]"
                        style={{
                            fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                            color: "rgba(255,255,255,0.92)",
                        }}
                    >
                        {step.title}
                    </p>
                    <p
                        className="mt-2 text-[0.8rem] leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.45)", maxWidth: "28ch" }}
                    >
                        {step.range}
                    </p>
                </div>
            )}
        </div>
    );
}

// ─── Step Row ─────────────────────────────────────────────────────────────────

function StepRow({
                     step,
                     index,
                     total,
                     active,
                     onActivate,
                     visible,
                 }: {
    step: Step;
    index: number;
    total: number;
    active: boolean;
    onActivate: () => void;
    visible: boolean;
}) {
    return (
        <div
            className={cn(
                "will-change-[opacity,transform]",
                "border-b border-white/[0.07] last:border-b-0",
            )}
            style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? "translateY(0)" : "translateY(1.2rem)",
                transition: `opacity 600ms ease ${index * 100 + 200}ms, transform 600ms ease ${index * 100 + 200}ms`,
            }}
        >
            <button
                className="w-full text-left group"
                onClick={onActivate}
                aria-expanded={active}
                aria-controls={`step-body-${index}`}
            >
                <div className="flex items-center gap-5 md:gap-8 py-5 md:py-6">
                    {/* Number */}
                    <span
                        className="font-mono text-[0.65rem] tracking-[0.2em] shrink-0 w-6 transition-colors duration-300"
                        style={{
                            color: active
                                ? "hsl(var(--hero-accent))"
                                : "rgba(255,255,255,0.22)",
                        }}
                    >
                        {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Title */}
                    <span
                        className="flex-1 font-serif leading-none tracking-[-0.02em] transition-colors duration-300"
                        style={{
                            fontSize: "clamp(1.2rem, 2.5vw, 1.55rem)",
                            color: active ? "#fff" : "rgba(255,255,255,0.65)",
                        }}
                    >
                        {step.title}
                    </span>

                    {/* Duration pill */}
                    <span
                        className="hidden sm:inline-flex shrink-0 text-[0.65rem] tracking-[0.1em] uppercase border rounded-full px-3 py-1 transition-all duration-300"
                        style={{
                            color:       active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
                            borderColor: active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)",
                        }}
                    >
                        {step.range}
                    </span>

                    {/* Expand indicator */}
                    <span
                        className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-[0.7rem] transition-all duration-300"
                        aria-hidden="true"
                        style={{
                            color:       active ? "#fff" : "rgba(255,255,255,0.3)",
                            transform:   active ? "rotate(45deg)" : "rotate(0deg)",
                            background:  active ? "rgba(255,255,255,0.06)" : "transparent",
                        }}
                    >
                        +
                    </span>
                </div>
            </button>

            {/* Expandable body */}
            <div
                id={`step-body-${index}`}
                role="region"
                style={{
                    display:    "grid",
                    gridTemplateRows: active ? "1fr" : "0fr",
                    transition: "grid-template-rows 420ms cubic-bezier(0.16,1,0.3,1)",
                }}
            >
                <div className="overflow-hidden">
                    <div className="pb-6 pl-11 md:pl-14 pr-4 md:pr-6">
                        {/* Mobile-only: show media inline */}
                        {(step.image || step.video) && (
                            <div className="lg:hidden mb-5 rounded-xl overflow-hidden aspect-video relative">
                                {step.video ? (
                                    <video
                                        autoPlay muted loop playsInline
                                        className="w-full h-full object-cover"
                                    >
                                        <source src={step.video} type="video/mp4" />
                                    </video>
                                ) : (
                                    <Image
                                        src={step.image!}
                                        alt={step.title}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                        )}

                        <p
                            className="text-[0.85rem] leading-[1.75]"
                            style={{ color: "rgba(255,255,255,0.5)", maxWidth: "52ch" }}
                        >
                            {step.description}
                        </p>

                        <ul className="mt-4 flex flex-wrap gap-2">
                            {step.bullets.map((b) => (
                                <li
                                    key={b}
                                    className="text-[0.7rem] tracking-wide rounded-full px-3 py-1"
                                    style={{
                                        color:      "rgba(255,255,255,0.55)",
                                        background: "rgba(255,255,255,0.05)",
                                        border:     "1px solid rgba(255,255,255,0.07)",
                                    }}
                                >
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Process ──────────────────────────────────────────────────────────────────

export function Process() {
    const [sectionRef, sectionVisible] = useInView<HTMLElement>(0.06);
    const [stepsRef,   stepsVisible]   = useInView<HTMLDivElement>(0.06);
    const [activeIndex, setActiveIndex] = useState(0);
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        const h = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq.addEventListener("change", h);
        return () => mq.removeEventListener("change", h);
    }, []);

    const activeStep = steps[activeIndex] as Step | undefined;

    return (
        <section
            ref={sectionRef}
            id="process"
            className="py-16 md:py-24 overflow-hidden"
            style={{ background: "#0c0c0c" }}
            aria-labelledby="process-heading"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">

                {/* ── Header ──────────────────────────────────────────────── */}
                <FadeUp visible={sectionVisible} delay={0} className="flex items-center gap-3 mb-8 md:mb-10">
                    <span className="font-mono text-[0.62rem] tracking-[0.25em] text-white/24 uppercase select-none">
                        003
                    </span>
                    <span className="h-px w-7 bg-white/16 shrink-0" aria-hidden="true" />
                    <span className="text-[0.62rem] tracking-[0.2em] text-white/24 uppercase">
                        Process
                    </span>
                </FadeUp>

                <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <FadeUp visible={sectionVisible} delay={80}>
                        <h2
                            id="process-heading"
                            className="font-serif font-normal leading-[1.04] tracking-[-0.025em]"
                            style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)", color: "#fff" }}
                        >
                            How I work
                        </h2>
                    </FadeUp>

                    <FadeUp visible={sectionVisible} delay={160}>
                        <p
                            className="max-w-[40ch] text-[0.85rem] leading-relaxed"
                            style={{ color: "rgba(255,255,255,0.38)" }}
                        >
                            A transparent, collaborative process optimized for shipping — clear scope, weekly demos, no surprises.
                        </p>
                    </FadeUp>
                </div>

                {/* ── Split layout ─────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_42%] gap-6 md:gap-10 items-start">

                    {/* Steps — left on desktop */}
                    <div ref={stepsRef} className="order-2 lg:order-1">
                        {(steps as Step[]).map((step, i) => (
                            <StepRow
                                key={step.title}
                                step={step}
                                index={i}
                                total={steps.length}
                                active={activeIndex === i}
                                onActivate={() => setActiveIndex(i)}
                                visible={stepsVisible}
                            />
                        ))}

                        {/* Bottom reassurance */}
                        <FadeUp
                            visible={stepsVisible}
                            delay={steps.length * 100 + 300}
                            className="mt-8 rounded-xl p-5"
                            style={{
                                background:  "rgba(255,255,255,0.03)",
                                border:      "1px solid rgba(255,255,255,0.07)",
                            } as React.CSSProperties}
                        >
                            <p className="text-[0.78rem] leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                                You'll get{" "}
                                <span style={{ color: "rgba(255,255,255,0.8)" }}>weekly progress updates</span>,{" "}
                                <span style={{ color: "rgba(255,255,255,0.8)" }}>clear milestones</span>, and a{" "}
                                <span style={{ color: "rgba(255,255,255,0.8)" }}>production-ready deployment</span>.
                            </p>
                        </FadeUp>
                    </div>

                    {/* Sticky media panel — right on desktop */}
                    <div
                        className="order-1 lg:order-2 lg:sticky lg:top-[5rem]"
                        style={{
                            opacity:    sectionVisible ? 1 : 0,
                            transform:  sectionVisible ? "translateY(0)" : "translateY(1.5rem)",
                            transition: "opacity 700ms ease 300ms, transform 700ms ease 300ms",
                        }}
                    >
                        <MediaPanel
                            step={activeStep}
                            index={activeIndex}
                            reduced={reduced}
                        />
                    </div>
                </div>
            </div>

            {/* Keyframes */}
            <style>{`
                @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
                @keyframes zoomIn  { from { transform: scale(1.06) } to { transform: scale(1) } }
            `}</style>
        </section>
    );
}