/**
 * @fileoverview FAQ — radical focus layout.
 *
 * The number IS the design. Each row has its index rendered at
 * ~7rem as an almost-invisible ghost. When active:
 *   • The number snaps to accent colour
 *   • Question text grows to large italic serif
 *   • Answer unfolds with CSS grid
 *   • ALL other rows fade to near-zero — one thing speaks at a time
 *
 * No visible borders. No cards. Pure editorial scale contrast.
 *
 * Driver: click (same pattern as Pricing — no scroll, no mouse tricks)
 * Theme: dark (#0c0c0c) — matches Work + Process
 */
"use client";

import * as React from "react";
import { FAQS } from "@/components/sections/faq-data";
import { useInView } from "@/hooks/use-in-view";

// ─── FAQ Row ──────────────────────────────────────────────────────────────────

function FaqRow({
                    faq,
                    index,
                    open,
                    anyOpen,
                    onToggle,
                    visible,
                }: {
    faq: { question: string; answer: string; category?: string };
    index: number;
    open: boolean;
    anyOpen: boolean;
    onToggle: () => void;
    visible: boolean;
}) {
    // When something else is open, this row fades hard
    const rowOpacity = !visible ? 0 : open ? 1 : anyOpen ? 0.22 : 1;

    return (
        <div
            style={{
                opacity:    rowOpacity,
                transform:  visible ? "translateY(0)" : "translateY(1.5rem)",
                transition: `opacity 500ms ease, transform 600ms cubic-bezier(0.16,1,0.3,1) ${index * 70}ms`,
            }}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="w-full text-left group"
            >
                <div className="flex items-start gap-5 md:gap-8 pt-6 pb-4 relative">

                    {/* ── Giant ghost number ── */}
                    <span
                        className="shrink-0 font-serif font-normal leading-none select-none pointer-events-none"
                        aria-hidden="true"
                        style={{
                            fontSize:      "clamp(4.5rem, 9vw, 7.5rem)",
                            color:         open
                                ? "hsl(var(--hero-accent))"
                                : "rgba(255,255,255,0.06)",
                            transition:    "color 400ms cubic-bezier(0.16,1,0.3,1)",
                            lineHeight:    1,
                            marginTop:     "0.05em",
                            fontStyle:     "italic",
                            letterSpacing: "-0.04em",
                        }}
                    >
                        {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* ── Right: category + question ── */}
                    <div className="flex-1 min-w-0 pt-2 md:pt-3">

                        {/* Category — slides in when open */}
                        <div
                            style={{
                                overflow:      "hidden",
                                height:        open ? "1.6rem" : "0px",
                                opacity:       open ? 1 : 0,
                                marginBottom:  open ? "0.5rem" : 0,
                                transition:    "height 350ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease, margin 350ms ease",
                            }}
                        >
                            <span
                                className="text-[0.55rem] tracking-[0.25em] uppercase"
                                style={{ color: "hsl(var(--hero-accent))" }}
                            >
                                {faq.category ?? "General"}
                            </span>
                        </div>

                        {/* Question */}
                        <span
                            className="block font-serif leading-[1.1] tracking-[-0.025em]"
                            style={{
                                fontSize:   open
                                    ? "clamp(1.35rem, 2.8vw, 2.1rem)"
                                    : "clamp(1rem, 1.8vw, 1.3rem)",
                                color:      open ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.55)",
                                fontStyle:  open ? "italic" : "normal",
                                transition: "font-size 400ms cubic-bezier(0.16,1,0.3,1), color 350ms ease, font-style 350ms ease",
                            }}
                        >
                            {faq.question}
                        </span>
                    </div>

                    {/* ── Toggle indicator ── */}
                    <div
                        className="shrink-0 mt-3 md:mt-4"
                        style={{
                            color:      open ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
                            transform:  open ? "rotate(45deg)" : "rotate(0deg)",
                            transition: "transform 350ms cubic-bezier(0.16,1,0.3,1), color 300ms ease",
                            fontSize:   "1.1rem",
                            lineHeight: 1,
                        }}
                        aria-hidden="true"
                    >
                        +
                    </div>
                </div>
            </button>

            {/* ── Answer ── */}
            <div
                style={{
                    display:          "grid",
                    gridTemplateRows: open ? "1fr" : "0fr",
                    transition:       "grid-template-rows 450ms cubic-bezier(0.16,1,0.3,1)",
                }}
            >
                <div className="overflow-hidden">
                    <div
                        style={{
                            paddingLeft:   "calc(clamp(4.5rem, 9vw, 7.5rem) + clamp(1.25rem, 2vw, 2rem))",
                            paddingBottom: "2.5rem",
                            paddingTop:    "0.25rem",
                        }}
                    >
                        {/* Accent line */}
                        <div
                            className="h-px w-8 mb-5"
                            style={{
                                background:      "hsl(var(--hero-accent))",
                                transform:       open ? "scaleX(1)" : "scaleX(0)",
                                transformOrigin: "left",
                                transition:      "transform 400ms cubic-bezier(0.16,1,0.3,1) 120ms",
                            }}
                        />
                        <p
                            className="text-[0.85rem] leading-[1.88]"
                            style={{
                                color:      "rgba(255,255,255,0.4)",
                                maxWidth:   "54ch",
                                opacity:    open ? 1 : 0,
                                transform:  open ? "translateY(0)" : "translateY(8px)",
                                transition: "opacity 380ms ease 180ms, transform 380ms cubic-bezier(0.16,1,0.3,1) 180ms",
                            }}
                        >
                            {faq.answer}
                        </p>
                    </div>
                </div>
            </div>

            {/* Hairline divider */}
            <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
    );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export function FAQ() {
    const [sectionRef, sectionVisible] = useInView<HTMLElement>(0.05);
    const [listRef,    listVisible]    = useInView<HTMLDivElement>(0.04);
    const [openIndex,  setOpenIndex]   = React.useState<number | null>(null);

    const toggle = (i: number) => setOpenIndex(prev => prev === i ? null : i);
    const faqs   = FAQS as { question: string; answer: string; category?: string }[];

    return (
        <section
            ref={sectionRef}
            id="faq"
            className="py-16 md:py-24 overflow-hidden"
            style={{ background: "#0c0c0c" }}
            aria-labelledby="faq-heading"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">

                {/* ── Header ── */}
                <div
                    style={{
                        opacity:    sectionVisible ? 1 : 0,
                        transform:  sectionVisible ? "translateY(0)" : "translateY(1.75rem)",
                        transition: "opacity 700ms ease, transform 700ms ease",
                    }}
                >
                    <div className="flex items-center gap-3 mb-10">
                        <span
                            className="font-mono text-[0.62rem] tracking-[0.25em] uppercase select-none"
                            style={{ color: "rgba(255,255,255,0.2)" }}
                        >
                            005
                        </span>
                        <span className="h-px w-7 shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} aria-hidden="true" />
                        <span className="text-[0.62rem] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
                            FAQ
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-8">
                        <h2
                            id="faq-heading"
                            className="font-serif font-normal leading-[1.04] tracking-[-0.025em]"
                            style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)", color: "rgba(255,255,255,0.9)" }}
                        >
                            Common questions
                        </h2>
                        <p
                            className="max-w-[36ch] text-[0.85rem] leading-relaxed md:text-right"
                            style={{ color: "rgba(255,255,255,0.25)" }}
                        >
                            Everything you need to know about working with me.
                        </p>
                    </div>
                </div>

                {/* ── List ── */}
                <div ref={listRef} className="mt-4">
                    {faqs.map((faq, i) => (
                        <FaqRow
                            key={i}
                            faq={faq}
                            index={i}
                            open={openIndex === i}
                            anyOpen={openIndex !== null}
                            onToggle={() => toggle(i)}
                            visible={listVisible}
                        />
                    ))}
                </div>

                {/* ── footer nudge ── */}
                <div
                    className="mt-14 flex items-center gap-4"
                    style={{
                        opacity:    listVisible ? 1 : 0,
                        transition: "opacity 700ms ease 700ms",
                    }}
                >
                    <span className="text-[0.75rem]" style={{ color: "rgba(255,255,255,0.22)" }}>
                        Still have questions?
                    </span>
                    <a
                        href="mailto:julianedelgado@hotmail.com"
                        className="text-[0.75rem] border-b transition-colors duration-200"
                        style={{ color: "rgba(255,255,255,0.45)", borderColor: "rgba(255,255,255,0.12)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
                    >
                        Email me directly →
                    </a>
                </div>
            </div>
        </section>
    );
}