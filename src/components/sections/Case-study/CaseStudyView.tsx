"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { C } from "@/components/sections/Case-study/case-study.constants";
import { CaseStudyViewProps } from "@/components/sections/Case-study/case-study.types";
import { CaseStudyHeroSection } from "@/components/sections/Case-study/CaseStudyHeroSection";
import { ContextSection }       from "@/components/sections/Case-study/ContextSection";
import { ChallengeSection }     from "@/components/sections/Case-study/ChallengeSection";
import { ApproachSection }      from "@/components/sections/Case-study/ApproachSection";
import { SolutionSection }      from "@/components/sections/Case-study/SolutionSection";
import { ResultsSection }       from "@/components/sections/Case-study/ResultsSection";
import { TestimonialSection }   from "@/components/sections/Case-study/TestimonialSection";
import { NavSlice }             from "@/components/sections/Case-study/NavSlice";

export function CaseStudyView({ study, prevStudy, nextStudy }: CaseStudyViewProps) {
    const [scrollPct, setScrollPct] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const doc = document.documentElement;
            setScrollPct(doc.scrollTop / (doc.scrollHeight - doc.clientHeight) || 0);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Each gallery image is passed directly to the section it illustrates.
    // The image appears alongside the text that gives it context.
    // If there are fewer images than sections, the slots just stay empty.
    const g = study.gallery ?? [];

    // Contextual CTA
    const topStat    = study.stats?.[0];
    const statBlurb  = topStat
        ? `${topStat.prefix ?? ""}${topStat.numericValue}${topStat.suffix ?? ""} ${topStat.label.toLowerCase()}`
        : null;
    const ctaHeading = study.client
        ? `Got a project like ${study.client}?`
        : "Ready to build something like this?";
    const ctaSubcopy = statBlurb
        ? `Results like ${statBlurb} don't happen by accident. Let's talk — 20 min, no commitment.`
        : `Let's talk about your project. No commitment — just a 20 min call to see if we're a good fit.`;

    return (
        <motion.div
            style={{ background: C.bg, color: "#fff" }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >

            {/* Reading progress bar */}
            <div
                className="fixed top-0 left-0 z-50 h-[2px] w-full pointer-events-none"
                style={{ background: C.accent, transform: `scaleX(${scrollPct})`, transformOrigin: "left" }}
                aria-hidden="true"
            />

            {/* ① Hero — uses study.image, no gallery slot needed */}
            <CaseStudyHeroSection study={study} />

            {/*
             * ② – ⑤  Each section receives the gallery image that best illustrates it.
             * The image renders alongside the text — not as a standalone visual break.
             *
             *  g[0] → Context  (shows the product/brand at a glance)
             *  g[1] → Challenge (shows the pain point, old state, or problem space)
             *  g[2] → Approach (shows process artefacts: wireframes, sketches, iterations)
             *  g[3] → Solution (shows the finished product — full width below text)
             *
             * Any images beyond g[3] are not rendered — keep gallery focused.
             */}
            <ContextSection   study={study} image={g[0]} />
            <ChallengeSection study={study} image={g[1]} />
            <ApproachSection  study={study} image={g[2]} />
            <SolutionSection  study={study} image={g[3]} />

            {/* ⑥ Results grid */}
            <ResultsSection study={study} />

            {/* ⑦ Testimonial */}
            {study.testimonial && <TestimonialSection testimonial={study.testimonial} />}

            {/* ⑧ Prev / Next */}
            {(prevStudy || nextStudy) && (
                <section className="mt-24 md:mt-36 border-t" style={{ borderColor: C.border }} aria-label="Navigate case studies">
                    <div className="flex flex-col sm:flex-row">
                        {prevStudy
                            ? <NavSlice study={prevStudy} direction="prev" />
                            : <div className="flex-1" style={{ background: "#080808" }} />}
                        <div className="w-px hidden sm:block" style={{ background: C.border }} />
                        {nextStudy
                            ? <NavSlice study={nextStudy} direction="next" />
                            : <div className="flex-1" style={{ background: "#080808" }} />}
                    </div>
                </section>
            )}

            {/* ⑨ Contextual CTA */}
            <section
                className="px-5 sm:px-8 md:px-14 lg:px-20 max-w-7xl mx-auto py-24 md:py-32 border-t"
                style={{ borderColor: C.border }}
            >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                    <div>
                        <p className="font-serif font-normal leading-[1.05] tracking-[-0.03em] mb-4"
                            style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)", color: "rgba(255,255,255,0.88)" }}>
                            {ctaHeading}
                        </p>
                        <p className="text-[0.82rem] leading-relaxed" style={{ color: C.dim, maxWidth: "44ch" }}>
                            {ctaSubcopy}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                        <Link
                            href="/#contact"
                            className="group flex items-center gap-2.5 rounded-full font-medium"
                            style={{ background: C.accent, color: "#fff", padding: "0.9rem 2rem", fontSize: "0.74rem", letterSpacing: "0.08em", textTransform: "uppercase", transition: "transform 0.2s" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}
                        >
                            Start your project
                            <span
                                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[0.65rem] group-hover:rotate-45 transition-transform duration-300"
                                style={{ border: "1.5px solid rgba(255,255,255,0.4)" }}
                                aria-hidden="true"
                            >↗</span>
                        </Link>
                        <Link
                            href="/#services"
                            className="text-[0.72rem] tracking-[0.1em] uppercase transition-colors duration-200"
                            style={{ color: C.dim }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.dim; }}
                        >
                            View services →
                        </Link>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
