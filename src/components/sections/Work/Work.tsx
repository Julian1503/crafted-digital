/**
 * @fileoverview Work section — cursor-alive gallery.
 *
 * Every other section is scroll-driven. This one is MOUSE-driven.
 * The cursor is the protagonist — it's what makes this section feel alive.
 *
 * Interactions:
 *   • Featured card: smooth 3D tilt follows cursor position (CSS perspective)
 *   • Secondary rows: floating image preview chases cursor with spring lag
 *   • Row titles: character-by-character lift on hover (existing behaviour, kept)
 *   • Stats: count-up animation on scroll entry
 *
 * Layout (dark theme, contrasts with light Services + Pricing):
 *   • Full-width featured spread: image fills ~60% height, title breaks
 *     outside the image frame in oversized serif — half on image, half on bg
 *   • Secondary rows below: large editorial list at full max-width
 *   • Floating cursor-chasing preview panel (desktop only)
 */
"use client";

import {
    useState,
} from "react";
import Link from "next/link";
import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {WorkProps} from "@/components/sections/Work/work.types";
import {FloatingPreview} from "@/components/sections/Work/FloatingPreview";
import {useSpringCursor} from "@/hooks/use-spring-cursor";
import FeaturedCard from "@/components/sections/Work/FeaturedCard";
import ProjectRow from "@/components/sections/Work/ProjectRow";

// ─── Work ─────────────────────────────────────────────────────────────────────


export function Work({ projects }: WorkProps) {
    const reduced = usePrefersReducedMotion();
    const [sectionRef, sectionVisible] = useInView<HTMLElement>(0.05);
    const [listRef, listVisible] = useInView<HTMLUListElement>(0.05);

    const [cursorPos, onMouseMove] = useSpringCursor(reduced ? 1 : 0.1);
    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

    if (!projects.length) return null;

    const [featured, ...secondary] = projects;
    const hoveredProject = secondary.find(p => p.slug === hoveredSlug);

    return (
        <section
            ref={sectionRef}
            id="work"
            className="py-16 md:py-24 overflow-hidden"
            style={{ background: "#0c0c0c", color: "#fff" }}
            aria-labelledby="work-heading"
            onMouseMove={onMouseMove}
        >
            {/* Floating cursor preview — follows mouse on secondary rows */}
            <FloatingPreview
                src={hoveredProject?.image}
                title={hoveredProject?.title ?? ""}
                visible={!!hoveredSlug}
                pos={cursorPos}
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">

                {/* ── Section label ──────────────────────────────────────── */}
                <div
                    className="flex items-center gap-3 mb-10 md:mb-14"
                    style={{
                        opacity:    sectionVisible ? 1 : 0,
                        transform:  sectionVisible ? "translateY(0)" : "translateY(1.5rem)",
                        transition: "opacity 700ms ease, transform 700ms ease",
                    }}
                >
                    <span
                        className="font-mono text-[0.62rem] tracking-[0.25em] uppercase select-none"
                        style={{ color: "rgba(255,255,255,0.22)" }}
                    >
                        001
                    </span>
                    <span className="h-px w-7 shrink-0" style={{ background: "rgba(255,255,255,0.12)" }} aria-hidden="true" />
                    <span className="text-[0.62rem] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.22)" }}>
                        Work
                    </span>

                    <h2
                        id="work-heading"
                        className="ml-auto font-serif font-normal tracking-[-0.02em]"
                        style={{ fontSize: "clamp(0.85rem, 1vw, 1rem)", color: "rgba(255,255,255,0.18)" }}
                    >
                        Case studies
                    </h2>
                </div>

                {/* ── Featured project ──────────────────────────────────── */}
                <FeaturedCard project={featured} visible={sectionVisible} reduced={reduced} />

                {/* ── Secondary projects ────────────────────────────────── */}
                {secondary.length > 0 && (
                    <div className="mt-16 md:mt-24">
                        {/* Sub-header */}
                        <div
                            className="flex items-center gap-3 mb-2"
                            style={{
                                opacity:    listVisible ? 1 : 0,
                                transition: "opacity 600ms ease",
                            }}
                        >
                            <span className="text-[0.58rem] tracking-[0.22em] uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
                                More work
                            </span>
                            <span className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                            <span className="font-mono text-[0.58rem]" style={{ color: "rgba(255,255,255,0.18)" }}>
                                {secondary.length} projects
                            </span>
                        </div>

                        <ul ref={listRef} className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                            {secondary.map((project, i) => (
                                <ProjectRow

                                    key={project.slug ?? project.title}
                                    project={project}
                                    index={i}
                                    total={secondary.length}
                                    isHovered={hoveredSlug === project.slug}
                                    onHover={() => setHoveredSlug(project.slug ?? null)}
                                    onLeave={() => setHoveredSlug(null)}
                                    visible={listVisible}
                                />
                            ))}
                        </ul>

                        {/* See all */}
                        <div
                            className="mt-8 flex justify-start"
                            style={{
                                opacity:    listVisible ? 1 : 0,
                                transition: "opacity 600ms ease 400ms",
                            }}
                        >
                            <Link
                                href="/case-studies"
                                className="group flex items-center gap-2.5 rounded-full font-medium"
                                style={{
                                    border:        "1px solid rgba(255,255,255,0.14)",
                                    background:    "rgba(255,255,255,0.04)",
                                    color:         "rgba(255,255,255,0.65)",
                                    padding:       "0.6rem 1.4rem",
                                    fontSize:      "0.72rem",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    transition:    "background 0.25s, border-color 0.25s, color 0.25s, transform 0.2s",
                                }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLAnchorElement;
                                    el.style.background   = "hsl(var(--hero-accent))";
                                    el.style.borderColor  = "hsl(var(--hero-accent))";
                                    el.style.color        = "#fff";
                                    el.style.transform    = "translateY(-2px)";
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLAnchorElement;
                                    el.style.background  = "rgba(255,255,255,0.04)";
                                    el.style.borderColor = "rgba(255,255,255,0.14)";
                                    el.style.color       = "rgba(255,255,255,0.65)";
                                    el.style.transform   = "";
                                }}
                            >
                                See all case studies
                                <span
                                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[0.65rem] group-hover:rotate-45"
                                    style={{ border: "1.5px solid rgba(255,255,255,0.3)", transition: "transform 0.25s" }}
                                >
                                    ↗
                                </span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}