import { useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { StudyData } from "@/components/sections/Case-study/case-study.types";
import { C } from "@/components/sections/Case-study/case-study.constants";

function estimateReadTime(study: StudyData): string {
    const text = [
        study.description ?? "",
        study.challenge   ?? "",
        study.solution    ?? "",
        ...(study.approach ?? []),
        ...(study.results  ?? []),
        study.testimonial?.quote ?? "",
    ].join(" ");
    const mins = Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
    return `${mins} min read`;
}

export function CaseStudyHeroSection({ study }: { study: StudyData }) {
    const readTime = useMemo(() => estimateReadTime(study), [study]);

    return (
        <section className="relative" style={{ minHeight: "100svh" }}>

            {/* Full-bleed image */}
            {study.image && (
                <div className="absolute inset-0">
                    <Image
                        src={study.image} alt={study.title}
                        fill priority sizes="100vw"
                        className="object-cover"
                        style={{ filter: "saturate(0.6) brightness(0.38)" }}
                    />
                    {/* gradient: transparent top → opaque bottom so title stays readable */}
                    <div className="absolute inset-0" style={{
                        background: "linear-gradient(to bottom, rgba(12,12,12,0.15) 0%, transparent 30%, rgba(12,12,12,0.7) 65%, #0c0c0c 100%)"
                    }} />
                    <div className="absolute inset-0" style={{
                        background: "linear-gradient(to right, rgba(12,12,12,0.4) 0%, transparent 40%, transparent 60%, rgba(12,12,12,0.4) 100%)"
                    }} />
                </div>
            )}

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 md:px-14 lg:px-20 pt-8 pb-0">
                <Link
                    href="/case-studies"
                    className="group flex items-center gap-2 transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
                >
                    <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true">←</span>
                    All work
                </Link>

                <div className="flex items-center gap-3 flex-wrap justify-end">
                    <span className="text-[0.58rem] tracking-[0.18em] uppercase border rounded-full px-2.5 py-1"
                          style={{ color: "rgba(255,255,255,0.45)", borderColor: "rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)" }}>
                        {study.category}
                    </span>
                    {study.year && (
                        <time dateTime={String(study.year)} className="font-mono text-[0.55rem] tracking-[0.22em]"
                              style={{ color: "rgba(255,255,255,0.28)" }}>
                            {study.year}
                        </time>
                    )}
                    <span className="font-mono text-[0.52rem] tracking-[0.18em] flex items-center gap-1"
                          style={{ color: "rgba(255,255,255,0.22)" }}>
                        <span aria-hidden="true">◷</span> {readTime}
                    </span>
                </div>
            </div>

            {/* Title — sits at the bottom of the viewport */}
            <div className="relative z-10 flex flex-col justify-end px-5 sm:px-8 md:px-14 lg:px-20"
                 style={{ minHeight: "calc(100svh - 80px)", paddingBottom: "clamp(3rem, 8vw, 6rem)" }}>

                <motion.p
                    className="font-mono text-[0.6rem] tracking-[0.28em] uppercase mb-4"
                    style={{ color: C.accent }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    {study.client}
                </motion.p>

                <div className="overflow-hidden">
                    <motion.h1
                        className="font-serif font-normal leading-[0.92] tracking-[-0.04em]"
                        style={{ fontSize: "clamp(3.2rem, 9vw, 9rem)", color: "rgba(255,255,255,0.95)", maxWidth: "16ch" }}
                        initial={{ y: "105%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {study.title}
                    </motion.h1>
                </div>

                {/* Scroll cue — a simple line */}
                <motion.div
                    className="mt-10 flex items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                >
                    <div className="w-10 h-px" style={{ background: C.accent }} aria-hidden="true" />
                    <span className="font-mono text-[0.5rem] tracking-[0.24em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                        Scroll to read
                    </span>
                </motion.div>
            </div>
        </section>
    );
}