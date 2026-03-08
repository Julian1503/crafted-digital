/**
 * @fileoverview Services section — editorial "menu" layout.
 *
 * Deliberately contrasts with the dark Process section:
 *   • Light background
 *   • Services as oversized full-width type rows (no cards, no accordion)
 *   • Hover → floating detail panel slides in from the right
 *   • Add-ons as an infinite marquee ticker at the bottom
 */
"use client";

import * as React from "react";
import { services } from "@/components/sections/Services/services-data";

// ─── Constants ────────────────────────────────────────────────────────────────

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

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView<T extends Element>(
    threshold = 0.06
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

// ─── Detail Panel ─────────────────────────────────────────────────────────────

interface ServiceItem {
    title: string;
    description?: string;
    price?: string;
    duration?: string;
    bullets?: string[];
    tag?: string;
    href?: string;
}

function DetailPanel({
                         service,
                         visible,
                     }: {
    service: ServiceItem | null;
    visible: boolean;
}) {
    return (
        <div
            aria-hidden={!visible}
            className="pointer-events-none fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block w-72"
            style={{
                opacity:    visible && service ? 1 : 0,
                transform:  `translateY(-50%) translateX(${visible && service ? "0px" : "18px"})`,
                transition: "opacity 320ms ease, transform 320ms cubic-bezier(0.16,1,0.3,1)",
            }}
        >
            <div
                className="rounded-2xl p-6 shadow-2xl"
                style={{
                    background:  "#0c0c0c",
                    border:      "1px solid rgba(255,255,255,0.07)",
                }}
            >
                {service && (
                    <>
                        {service.tag && (
                            <span
                                className="inline-block text-[0.62rem] tracking-[0.2em] uppercase mb-3"
                                style={{ color: "hsl(var(--hero-accent))" }}
                            >
                                {service.tag}
                            </span>
                        )}
                        <p className="font-serif text-[1.15rem] leading-[1.1] tracking-[-0.02em] text-white mb-3">
                            {service.title}
                        </p>
                        {service.description && (
                            <p className="text-[0.78rem] leading-[1.7]" style={{ color: "rgba(255,255,255,0.45)" }}>
                                {service.description}
                            </p>
                        )}
                        {service.bullets && service.bullets.length > 0 && (
                            <ul className="mt-4 space-y-1.5">
                                {service.bullets.map((b) => (
                                    <li
                                        key={b}
                                        className="flex items-start gap-2 text-[0.73rem]"
                                        style={{ color: "rgba(255,255,255,0.55)" }}
                                    >
                                        <span style={{ color: "hsl(var(--hero-accent))", marginTop: "0.15em" }}>→</span>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                            {service.price && (
                                <span className="text-[0.72rem]" style={{ color: "rgba(255,255,255,0.35)" }}>
                                    From <span className="text-white font-medium">{service.price}</span>
                                </span>
                            )}
                            {service.duration && (
                                <span
                                    className="text-[0.65rem] tracking-[0.1em] uppercase border rounded-full px-2.5 py-0.5"
                                    style={{ color: "rgba(255,255,255,0.3)", borderColor: "rgba(255,255,255,0.1)" }}
                                >
                                    {service.duration}
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── Service Row ──────────────────────────────────────────────────────────────

function ServiceRow({
                        service,
                        index,
                        total,
                        active,
                        onEnter,
                        onLeave,
                        visible,
                        onClick,
                    }: {
    service: ServiceItem;
    index: number;
    total: number;
    active: boolean;
    onEnter: () => void;
    onLeave: () => void;
    visible: boolean;
    onClick: () => void;
}) {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    return (
        <div
            className="will-change-[opacity,transform]"
            style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? "translateY(0)" : "translateY(1.4rem)",
                transition: `opacity 600ms ease ${index * 90}ms, transform 600ms ease ${index * 90}ms`,
            }}
        >
            {/* Main row */}
            <div
                className="border-b cursor-pointer select-none"
                style={{ borderColor: "rgba(10,10,10,0.08)" }}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                onClick={() => { onClick(); setMobileOpen(v => !v); }}
            >
                <div className="flex items-center gap-4 py-5 md:py-7 group">

                    {/* Index */}
                    <span
                        className="font-mono text-[0.6rem] tracking-[0.2em] shrink-0 w-5 transition-colors duration-300"
                        style={{ color: active ? "rgba(10,10,10,0.5)" : "rgba(10,10,10,0.22)" }}
                    >
                        {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Service name — large editorial type */}
                    <span
                        className="flex-1 font-serif leading-none tracking-[-0.025em] transition-all duration-500"
                        style={{
                            fontSize:   "clamp(1.5rem, 4vw, 3.5rem)",
                            color:      active ? "rgba(10,10,10,1)" : "rgba(10,10,10,0.42)",
                            fontStyle:  active ? "italic" : "normal",
                        }}
                    >
                        {service.title}
                    </span>

                    {/* Tag — md+ */}
                    {service.tag && (
                        <span
                            className="hidden md:inline-flex shrink-0 text-[0.62rem] tracking-[0.12em] uppercase border rounded-full px-3 py-1 transition-all duration-300"
                            style={{
                                color:       active ? "rgba(10,10,10,0.6)" : "rgba(10,10,10,0.2)",
                                borderColor: active ? "rgba(10,10,10,0.2)" : "rgba(10,10,10,0.1)",
                            }}
                        >
                            {service.tag}
                        </span>
                    )}

                    {/* Price — md+ */}
                    {service.price && (
                        <span
                            className="hidden md:block shrink-0 font-mono text-[0.75rem] transition-colors duration-300"
                            style={{ color: active ? "rgba(10,10,10,0.5)" : "rgba(10,10,10,0.18)" }}
                        >
                            {service.price}
                        </span>
                    )}

                    {/* Arrow */}
                    <span
                        className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-[0.75rem] transition-all duration-300"
                        aria-hidden="true"
                        style={{
                            background:  active ? "rgba(10,10,10,1)" : "transparent",
                            color:       active ? "#fff" : "rgba(10,10,10,0.25)",
                            border:      `1px solid ${active ? "transparent" : "rgba(10,10,10,0.12)"}`,
                            transform:   active ? "rotate(45deg)" : "rotate(0deg)",
                        }}
                    >
                        ↗
                    </span>
                </div>
            </div>

            {/* Mobile expandable detail */}
            <div
                className="lg:hidden overflow-hidden"
                style={{
                    display:          "grid",
                    gridTemplateRows: mobileOpen ? "1fr" : "0fr",
                    transition:       "grid-template-rows 380ms cubic-bezier(0.16,1,0.3,1)",
                }}
            >
                <div className="overflow-hidden">
                    <div className="py-5 pl-9 pr-3 space-y-3">
                        {service.description && (
                            <p className="text-[0.82rem] leading-[1.7]" style={{ color: "rgba(10,10,10,0.5)" }}>
                                {service.description}
                            </p>
                        )}
                        {service.bullets && (
                            <ul className="space-y-1.5">
                                {service.bullets.map((b) => (
                                    <li key={b} className="flex items-start gap-2 text-[0.78rem]" style={{ color: "rgba(10,10,10,0.6)" }}>
                                        <span style={{ color: "hsl(var(--hero-accent))", marginTop: "0.1em" }}>→</span>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="flex items-center gap-3 flex-wrap pt-1">
                            {service.price && (
                                <span className="text-[0.72rem]" style={{ color: "rgba(10,10,10,0.4)" }}>
                                    From <strong style={{ color: "rgba(10,10,10,0.8)" }}>{service.price}</strong>
                                </span>
                            )}
                            {service.duration && (
                                <span
                                    className="text-[0.65rem] tracking-[0.1em] uppercase border rounded-full px-2.5 py-0.5"
                                    style={{ color: "rgba(10,10,10,0.35)", borderColor: "rgba(10,10,10,0.12)" }}
                                >
                                    {service.duration}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Marquee ──────────────────────────────────────────────────────────────────

function Marquee({ items }: { items: string[] }) {
    // Duplicate for seamless loop
    const doubled = [...items, ...items];
    return (
        <div className="relative overflow-hidden py-4" style={{ borderTop: "1px solid rgba(10,10,10,0.08)" }}>
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
                 style={{ background: "linear-gradient(to right, var(--bg-services, #f9f9f9), transparent)" }} />
            <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none"
                 style={{ background: "linear-gradient(to left, var(--bg-services, #f9f9f9), transparent)" }} />

            <div
                className="flex gap-8 w-max"
                style={{ animation: "marquee 28s linear infinite" }}
            >
                {doubled.map((item, i) => (
                    <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                        <span
                            className="text-[0.65rem] tracking-[0.18em] uppercase font-medium"
                            style={{ color: "rgba(10,10,10,0.38)" }}
                        >
                            {item}
                        </span>
                        <span
                            aria-hidden="true"
                            className="inline-block w-1 h-1 rounded-full"
                            style={{ background: "rgba(10,10,10,0.15)" }}
                        />
                    </span>
                ))}
            </div>
        </div>
    );
}

// ─── Services ─────────────────────────────────────────────────────────────────

export function Services() {
    const [sectionRef, sectionVisible] = useInView<HTMLElement>(0.05);
    const [listRef,    listVisible]    = useInView<HTMLDivElement>(0.05);
    const [hovered, setHovered] = React.useState<number | null>(null);
    const [pinned,  setPinned]  = React.useState<number | null>(null);

    // Panel shows hovered or pinned item
    const activeIndex   = hovered ?? pinned;
    const activeService = activeIndex !== null ? (services[activeIndex] as ServiceItem) : null;
    const panelVisible  = activeService !== null;

    return (
        <section
            ref={sectionRef}
            id="services"
            data-header-theme="light"
            className="py-16 md:py-24 overflow-hidden"
            style={{ background: "hsl(var(--background))" }}
            aria-labelledby="services-heading"
        >
            {/* Hover detail panel — desktop */}
            <DetailPanel service={activeService} visible={panelVisible} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">

                {/* ── Header ──────────────────────────────────────────────── */}
                <div
                    className="will-change-[opacity,transform] mb-12 md:mb-16 flex items-center gap-3"
                    style={{
                        opacity:    sectionVisible ? 1 : 0,
                        transform:  sectionVisible ? "translateY(0)" : "translateY(1.75rem)",
                        transition: "opacity 700ms ease, transform 700ms ease",
                    }}
                >
                    <span
                        className="font-mono text-[0.62rem] tracking-[0.25em] uppercase select-none"
                        style={{ color: "rgba(10,10,10,0.22)" }}
                    >
                        002
                    </span>
                    <span className="h-px w-7 shrink-0" style={{ background: "rgba(10,10,10,0.12)" }} aria-hidden="true" />
                    <span
                        className="text-[0.62rem] tracking-[0.2em] uppercase"
                        style={{ color: "rgba(10,10,10,0.22)" }}
                    >
                        Services
                    </span>
                </div>

                <div
                    className="will-change-[opacity,transform] mb-14 md:mb-18 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
                    style={{
                        opacity:    sectionVisible ? 1 : 0,
                        transform:  sectionVisible ? "translateY(0)" : "translateY(1.75rem)",
                        transition: "opacity 700ms ease 80ms, transform 700ms ease 80ms",
                    }}
                >
                    <h2
                        id="services-heading"
                        className="font-serif font-normal leading-[1.04] tracking-[-0.025em]"
                        style={{
                            fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
                            color:    "rgba(10,10,10,0.9)",
                        }}
                    >
                        What I do
                    </h2>
                    <p
                        className="max-w-[40ch] text-[0.85rem] leading-relaxed md:text-right"
                        style={{ color: "rgba(10,10,10,0.38)" }}
                    >
                        Custom digital solutions for Australian businesses — from concept to production.
                        <span className="hidden md:inline"> Hover a service to explore.</span>
                    </p>
                </div>

                {/* ── Service list ─────────────────────────────────────────── */}
                <div ref={listRef} className="border-t" style={{ borderColor: "rgba(10,10,10,0.08)" }}>
                    {(services as ServiceItem[]).map((service, i) => (
                        <ServiceRow
                            key={service.title}
                            service={service}
                            index={i}
                            total={services.length}
                            active={activeIndex === i}
                            onEnter={() => setHovered(i)}
                            onLeave={() => setHovered(null)}
                            onClick={() => setPinned(p => p === i ? null : i)}
                            visible={listVisible}
                        />
                    ))}
                </div>

                {/* ── Add-ons marquee ──────────────────────────────────────── */}
                <div
                    className="mt-12 md:mt-16 will-change-[opacity]"
                    style={{
                        opacity:    listVisible ? 1 : 0,
                        transition: "opacity 700ms ease 600ms",
                    }}
                >
                    <div className="mb-3 flex items-center gap-3">
                        <span
                            className="text-[0.62rem] tracking-[0.2em] uppercase"
                            style={{ color: "rgba(10,10,10,0.3)" }}
                        >
                            Add-ons
                        </span>
                        <span className="flex-1 h-px" style={{ background: "rgba(10,10,10,0.07)" }} />
                    </div>
                    <Marquee items={ADD_ONS} />
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0) }
                    to   { transform: translateX(-50%) }
                }
            `}</style>
        </section>
    );
}