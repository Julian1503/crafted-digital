/**
 * @fileoverview Services section — scroll-jacked sticky sequence, light theme.
 *
 * Design tokens match ContactSection section exactly (light variant):
 *   • background:  hsl(var(--background))
 *   • label text:  rgba(10,10,10,0.22)
 *   • body copy:   rgba(10,10,10,0.45)
 *   • heading:     rgba(10,10,10,0.9)
 *   • borders:     rgba(10,10,10,0.08) / rgba(10,10,10,0.06)
 *   • accent:      hsl(var(--hero-accent))
 *
 * Images:
 *   • Place one photo per service at /public/services/1.jpg, 2.jpg …
 *   • Right panel: image with a right-to-left light-wash gradient
 */
"use client";

import * as React from "react";
import {
    motion,
    useReducedMotion,
    AnimatePresence,
    useScroll,
} from "framer-motion";
import { services } from "@/components/sections/Services/services-data";
import {useScrollStep} from "@/hooks/use-scroll-step";
import {ImagePanel, MediaAsset} from "@/components/sections/Services/ImagePanel";
import {L} from "@/components/sections/Services/services-data";
import {ContentPanel} from "@/components/sections/Services/ContentPanel";
import StepIndicator from "@/components/sections/Services/StepIndicator";
import ProgressBar from "@/components/sections/Services/ProgressBar";
import {Marquee} from "@/components/sections/Services/Marquee";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceItem {
    title: string;
    description?: string;
    price?: string;
    duration?: string;
    bullets?: string[];
    tag?: string;
    href?: string;
}

// ─── Media map ────────────────────────────────────────────────────────────────
// One entry per service (order must match services-data).
// type "image" → <img>   (jpg / png / webp)
// type "video" → <video autoPlay muted loop playsInline>
//
// Example overrides:
//   { type: "video", src: "/services/1.webm" },
//   { type: "image", src: "/services/2.jpg" },

interface ServiceMedia {
    type: "image" | "video";
    src: string;
    poster?: string;
}

const SERVICE_MEDIA: ServiceMedia[] = [
    { type: "video" as const, poster: "https://res.cloudinary.com/dpnkr4r6w/video/upload/v1773265024/3_uszur9.jpg", src: `https://res.cloudinary.com/dpnkr4r6w/video/upload/v1773265023/1_n2cd8y.webm` },
    { type: "video" as const, poster: "https://res.cloudinary.com/dpnkr4r6w/video/upload/v1773265024/2_kzosmf.jpg", src: `https://res.cloudinary.com/dpnkr4r6w/video/upload/v1773265024/2_kzosmf.webm` },
    { type: "video" as const, poster: "https://res.cloudinary.com/dpnkr4r6w/video/upload/v1773265024/3_uszur9.jpg", src: `https://res.cloudinary.com/dpnkr4r6w/video/upload/v1773265024/3_uszur9.webm` },
];

// ─── Add-ons ──────────────────────────────────────────────────────────────────

const ADD_ONS = [
    "SEO Optimization",
    "Performance Audits",
    "CMS Integration",
    "API Development",
    "Auth & Roles",
    "Monitoring & Alerts",
    "Analytics Setup",
    "Speed Optimisation",
    "Accessibility Audit",
    "Hosting & DevOps",
];

// ─── Main component ───────────────────────────────────────────────────────────

export function Services() {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const totalSteps = (services as ServiceItem[]).length;

    const { scrollYProgress, step, sectionEntered } = useScrollStep(containerRef, totalSteps);

    return (
        <>
            {/* ─── Scroll space ─────────────────────────────────────────── */}
            <div
                ref={containerRef}
                id="services"
                data-header-theme="light"
                aria-label="Services section"
                style={{ height: `${(totalSteps + 0.5) * 100}vh` }}
            >
                {/* ─── Sticky viewport ──────────────────────────────────── */}
                <div
                    className="sticky top-0 overflow-hidden"
                    style={{ height: "100vh", background: L.bg }}
                >
                    {/* ── Mobile full-bleed background media (below text) ── */}
                    {sectionEntered && (
                        <div className="absolute inset-0 lg:hidden z-0 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={SERVICE_MEDIA[step]?.src}
                                    className="absolute inset-0"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                >
                                    <MediaAsset
                                        media={SERVICE_MEDIA[step] ?? SERVICE_MEDIA[0]}
                                        alt={(services as ServiceItem[])[step]?.title ?? ""}
                                    />
                                    {/* Strong light wash — keeps dark text fully legible */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: "linear-gradient(to bottom, hsla(var(--background) / 0.72) 0%, hsla(var(--background) / 0.82) 50%, hsla(var(--background) / 0.94) 100%)",
                                        }}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Split layout */}
                    <div className="absolute inset-0 flex">

                        {/* LEFT — content (full width mobile, 55% desktop) */}
                        <div className="relative w-full lg:w-[55%] xl:w-[52%] z-10 overflow-hidden">
                            {(services as ServiceItem[]).map((service, i) => (
                                <ContentPanel
                                    key={service.title}
                                    service={service}
                                    index={i}
                                    total={totalSteps}
                                    isActive={i === step}
                                    isPrev={i < step}
                                />
                            ))}
                        </div>

                        {/* RIGHT — image (desktop only, appears once section is fully entered) */}
                        <motion.div
                            className="hidden lg:block relative flex-1 overflow-hidden"
                            initial={{ opacity: 0, x: 32 }}
                            animate={sectionEntered ? { opacity: 1, x: 0 } : { opacity: 0, x: 32 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {sectionEntered && (
                                <ImagePanel
                                    media={SERVICE_MEDIA[step] ?? SERVICE_MEDIA[0]}
                                    alt={(services as ServiceItem[])[step]?.title ?? ""}
                                />
                            )}
                        </motion.div>
                    </div>

                    {/* Step dots */}
                    <div className="hidden lg:flex absolute right-7 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-5">
                        <StepIndicator total={totalSteps} active={step} />
                    </div>

                    {/* Scroll hint */}
                    <AnimatePresence>
                        {step === 0 && (
                            <motion.div
                                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20
                                           flex flex-col items-center gap-2 pointer-events-none"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span
                                    className="text-[0.58rem] tracking-[0.28em] uppercase"
                                    style={{ color: L.label }}
                                >
                                    Scroll to explore
                                </span>
                                <motion.div
                                    className="w-px h-7"
                                    style={{
                                        background: `linear-gradient(to bottom, ${L.labelMid}, transparent)`,
                                    }}
                                    animate={prefersReducedMotion ? {} : { scaleY: [1, 0.35, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Progress bar */}
                    <ProgressBar scrollYProgress={scrollYProgress} />
                </div>
            </div>

            {/* ─── Add-ons strip ─────────────────────────────────────────── */}
            <div style={{ background: L.bg }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pt-16 pb-2">
                    <div className="mb-4 flex items-center gap-3">
                        <span
                            className="font-mono text-[0.62rem] tracking-[0.25em] uppercase select-none"
                            style={{ color: L.label }}
                        >
                            Add-ons
                        </span>
                        <span
                            className="flex-1 h-px"
                            style={{ background: L.border }}
                            aria-hidden="true"
                        />
                    </div>
                </div>
                <Marquee items={ADD_ONS} />
                <div className="pb-12" />
            </div>

            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0) }
                    to   { transform: translateX(-50%) }
                }
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>
        </>
    );
}