/**
 * @fileoverview FAQ section — dark editorial layout.
 *
 * Distinct from Process (also dark + accordion) in every way:
 *   • Two-column: left = sticky question number + category label,
 *                 right = question + answer
 *   • No shadcn Accordion — pure CSS grid-template-rows expand
 *   • One item open at a time, click again to close
 *   • Question text is large serif that shifts to italic when open
 */
"use client";

import * as React from "react";
import { FAQS } from "@/components/sections/faq-data";

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useInView<T extends Element>(threshold = 0.06): [React.RefObject<T | null>, boolean] {
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

// ─── FAQ Row ──────────────────────────────────────────────────────────────────

function FaqRow({
                    faq,
                    index,
                    total,
                    open,
                    onToggle,
                    visible,
                }: {
    faq: { question: string; answer: string; category?: string };
    index: number;
    total: number;
    open: boolean;
    onToggle: () => void;
    visible: boolean;
}) {
    return (
        <div
            className="border-b"
            style={{
                borderColor: "rgba(255,255,255,0.06)",
                opacity:     visible ? 1 : 0,
                transform:   visible ? "translateY(0)" : "translateY(1.2rem)",
                transition:  `opacity 550ms ease ${index * 70}ms, transform 550ms ease ${index * 70}ms`,
            }}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="w-full text-left"
            >
                <div className="grid grid-cols-[2.5rem_1fr_2rem] md:grid-cols-[4rem_1fr_2rem] items-start gap-4 py-6 md:py-7 group">

                    {/* Index */}
                    <span
                        className="font-mono text-[0.6rem] tracking-[0.2em] pt-[0.35em] transition-colors duration-300"
                        style={{ color: open ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.18)" }}
                    >
                        {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Question */}
                    <span
                        className="font-serif leading-[1.15] tracking-[-0.02em] transition-all duration-400"
                        style={{
                            fontSize:  "clamp(1.05rem, 2.2vw, 1.35rem)",
                            color:     open ? "#fff" : "rgba(255,255,255,0.62)",
                            fontStyle: open ? "italic" : "normal",
                        }}
                    >
                        {faq.question}
                    </span>

                    {/* Toggle mark */}
                    <span
                        className="inline-flex items-center justify-center h-7 w-7 rounded-full border text-[0.7rem] mt-[0.1em] transition-all duration-300"
                        aria-hidden="true"
                        style={{
                            borderColor: open ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
                            color:       open ? "#fff" : "rgba(255,255,255,0.3)",
                            background:  open ? "rgba(255,255,255,0.05)" : "transparent",
                            transform:   open ? "rotate(45deg)" : "rotate(0deg)",
                        }}
                    >
                        +
                    </span>
                </div>
            </button>

            {/* Answer */}
            <div
                style={{
                    display:          "grid",
                    gridTemplateRows: open ? "1fr" : "0fr",
                    transition:       "grid-template-rows 400ms cubic-bezier(0.16,1,0.3,1)",
                }}
            >
                <div className="overflow-hidden">
                    <p
                        className="pb-7 text-[0.85rem] leading-[1.82]"
                        style={{
                            color:      "rgba(255,255,255,0.42)",
                            paddingLeft: "calc(2.5rem + 1rem)",   /* aligns with question on mobile */
                        }}
                    >
                        {faq.answer}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export function FAQ() {
    const [sectionRef, sectionVisible] = useInView<HTMLElement>(0.06);
    const [listRef,    listVisible]    = useInView<HTMLDivElement>(0.04);
    const [openIndex, setOpenIndex]    = React.useState<number | null>(0);

    const toggle = (i: number) => setOpenIndex(prev => prev === i ? null : i);

    return (
        <section
            ref={sectionRef}
            id="faq"
            className="py-16 md:py-24 overflow-hidden"
            style={{ background: "#0c0c0c" }}
            aria-labelledby="faq-heading"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">

                {/* ── Header ──────────────────────────────────────────────── */}
                <div
                    className="will-change-[opacity,transform]"
                    style={{
                        opacity:    sectionVisible ? 1 : 0,
                        transform:  sectionVisible ? "translateY(0)" : "translateY(1.75rem)",
                        transition: "opacity 700ms ease, transform 700ms ease",
                    }}
                >
                    <div className="flex items-center gap-3 mb-8">
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

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16">
                        <h2
                            id="faq-heading"
                            className="font-serif font-normal leading-[1.04] tracking-[-0.025em]"
                            style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)", color: "rgba(255,255,255,0.9)" }}
                        >
                            Common questions
                        </h2>
                        <p
                            className="max-w-[36ch] text-[0.85rem] leading-relaxed md:text-right"
                            style={{ color: "rgba(255,255,255,0.28)" }}
                        >
                            Everything you need to know about working with me.
                        </p>
                    </div>
                </div>

                {/* ── List ─────────────────────────────────────────────────── */}
                <div
                    ref={listRef}
                    className="border-t"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                    {FAQS.map((faq, i) => (
                        <FaqRow
                            key={i}
                            faq={faq}
                            index={i}
                            total={FAQS.length}
                            open={openIndex === i}
                            onToggle={() => toggle(i)}
                            visible={listVisible}
                        />
                    ))}
                </div>

                {/* ── Footer nudge ─────────────────────────────────────────── */}
                <div
                    className="mt-12 flex items-center gap-4"
                    style={{
                        opacity:    listVisible ? 1 : 0,
                        transition: "opacity 700ms ease 600ms",
                    }}
                >
                    <span className="text-[0.78rem]" style={{ color: "rgba(255,255,255,0.28)" }}>
                        Still have questions?
                    </span>
                    <a
                        href="mailto:julianedelgado@hotmail.com"
                        className="text-[0.78rem] border-b transition-colors duration-200"
                        style={{ color: "rgba(255,255,255,0.55)", borderColor: "rgba(255,255,255,0.15)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                    >
                        Email me directly →
                    </a>
                </div>
            </div>
        </section>
    );
}