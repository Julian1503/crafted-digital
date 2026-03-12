"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { bg, border, white, dim, accent, LINE, E } from "./about-constants";
import { ChapterLabel, FadeUp } from "./ChapterLabel";

const EXPERIENCE = [
    { period: "2024 – Present", company: "Julian Delgado",    role: "Software Developer",   body: "I've started my own business, taking on freelance projects and collaborations. I'm passionate about building solutions that make a difference, and I'm always open to new opportunities.", stack: ["Node.js", "Java / Spring", "Next.js / React"] },
    { period: "2023 – 2024",   company: "Relocating to AU",   role: "New chapter",           body: "Left Argentina and moved to Toowoomba, Queensland — while remaining employed at Sovos. A deliberate leap into a new life, without stopping the work.", stack: [] },
    { period: "2020 – 2023",   company: "Sovos Compliance",   role: "Software Engineer III", body: "Started as SE I at a Boston-based global tax compliance company. Grew through two promotions to SE III over 5 years. Part of Grizzlies → Buffaloes → Carpinchos team, maintaining 5 enterprise products including Batch, Filing, SST Model 1, and leading Onboarding from first commit.", stack: ["Java / Spring", "React / TypeScript", "Node.js"] },
    { period: "2020",          company: "mDEVZ",              role: "Full-stack Developer",  body: "A startup with global clients. I handled up to 6 simultaneous projects across PHP/Laravel, Flutter/Dart, .NET C#, React, and Node. Different requirements, different deadlines, different stacks — solo on all of them.", stack: ["PHP / Laravel", "React", "Flutter", ".NET C#"] },
    { period: "2019",          company: "Freelance",          role: "Web Developer",         body: "First real clients — insurance companies, worked alongside friends. Short but formative: translated a business problem into a working product with no manager and no safety net.", stack: ["Web", "Client work"] },
    { period: "2017 – 2018",   company: "UTN + Java Course",  role: "Student & Self-starter", body: "A Java course sparked everything. UTN gave the foundations: C#, algorithms, data structures, statistics. Promoted most subjects. The academic base I still draw on every day.", stack: ["Java", "C#", "Algorithms"] },
];

function TimelineCircle({ active }: { active: boolean }) {
    return (
        <motion.div
            animate={{
                background:  active ? LINE : "rgba(134,34,25,0)",
                borderColor: active ? LINE : "rgba(255,255,255,0.18)",
                boxShadow:   active
                    ? `0 0 0 4px rgba(134,33,25,0.18), 0 0 16px ${LINE}, 0 0 32px rgba(134,33,25,0.32)`
                    : "none",
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-[2] h-3 w-3 shrink-0 rounded-full border-2"
            style={{ borderColor: "rgba(255,255,255,0.18)" }}
        />
    );
}

function ExperienceItem({
    item,
    index,
    onInView,
}: {
    item: (typeof EXPERIENCE)[0];
    index: number;
    onInView: (i: number, v: boolean) => void;
}) {
    const ref      = useRef<HTMLDivElement>(null);
    const inView   = useInView(ref, { once: false, margin: "-28% 0px -28% 0px" });
    const appeared = useRef(false);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        if (inView && !appeared.current) appeared.current = true;
        onInView(index, inView);
    }, [inView, index, onInView]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 20 }}
            animate={appeared.current || inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.05, ease: E }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="cursor-default border-b py-9"
            style={{ borderColor: border }}
        >
            {/*
             * Two-column layout on sm+: period/company left, role/body right.
             * Single column on mobile: stacked naturally.
             * KEY FIX: gridTemplateColumns is set via Tailwind classes only —
             * no inline style that would override responsive breakpoints.
             */}
            <div className="grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-[160px_1fr]">
                <div>
                    <p className="mb-2 font-mono text-[0.56rem] uppercase tracking-[0.18em]" style={{ color: accent }}>
                        {item.period}
                    </p>
                    <p className="font-mono text-[0.52rem] uppercase tracking-[0.1em]" style={{ color: dim }}>
                        @ {item.company}
                    </p>
                </div>

                <div>
                    <h3
                        className="mb-3 font-serif text-[clamp(1.1rem,2vw,1.55rem)] font-normal italic tracking-[-0.018em] transition-colors duration-200"
                        style={{ color: hovered ? white : "rgba(255,255,255,0.72)" }}
                    >
                        — {item.role}
                    </h3>

                    <p className="mb-4 text-[0.88rem] leading-[1.88]" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {item.body}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {item.stack.map((s) => (
                            <span
                                key={s}
                                className="rounded-[4px] border px-[0.65rem] py-[0.3rem] font-mono text-[0.46rem] uppercase tracking-[0.14em]"
                                style={{ color: dim, borderColor: border }}
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export function Experience({ experienceHighlights }: { experienceHighlights: string[] }) {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeSet, setActiveSet] = useState<Set<number>>(new Set());

    const handleInView = useCallback((index: number, visible: boolean) => {
        setActiveSet((prev) => {
            const alreadyActive = prev.has(index);
            if (visible === alreadyActive) return prev;
            const next = new Set(prev);
            visible ? next.add(index) : next.delete(index);
            return next;
        });
    }, []);

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 78%", "end 22%"] });
    const rawScale  = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const lineScale = useSpring(rawScale, { stiffness: 52, damping: 18 });

    return (
        <section
            ref={sectionRef}
            className="border-t px-[clamp(1.25rem,5vw,5rem)] py-28"
            style={{ background: bg, borderColor: border }}
        >
            <div className="mx-auto max-w-[1580px]">
                <FadeUp>
                    <ChapterLabel n="02" label="Shaped by Experience" />
                </FadeUp>

                <FadeUp delay={0.06}>
                    <h2
                        className="mb-14 font-serif text-[clamp(1.9rem,4vw,3.2rem)] font-normal leading-[1.1] tracking-[-0.035em]"
                        style={{ color: white }}
                    >
                        2017 – 2025
                    </h2>
                </FadeUp>

                {/* Header row — desktop only */}
                <div
                    className="hidden border-b pb-3 sm:grid sm:gap-x-10"
                    style={{ gridTemplateColumns: "44px 160px 1fr", borderColor: border }}
                >
                    <div />
                    <p className="font-mono text-[0.5rem] uppercase tracking-[0.22em] text-white/[0.14]">Period</p>
                    <p className="font-mono text-[0.5rem] uppercase tracking-[0.22em] text-white/[0.14]">Role & Context</p>
                </div>

                <div className="flex items-stretch gap-0">
                    {/* Animated timeline line — desktop only */}
                    <div className="relative hidden w-11 shrink-0 flex-col items-center sm:flex">
                        <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-white/[0.055]" />
                        <motion.div
                            className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2"
                            style={{
                                background: LINE,
                                transformOrigin: "top",
                                scaleY: lineScale,
                                animation: "line-glow 2.8s ease-in-out infinite",
                            }}
                        />
                        {EXPERIENCE.map((_, i) => (
                            <div key={i} className="relative z-[2] flex min-h-[100px] flex-1 items-center justify-center">
                                <TimelineCircle active={activeSet.has(i)} />
                            </div>
                        ))}
                    </div>

                    {/* Experience items */}
                    <div className="flex-1">
                        {EXPERIENCE.map((item, i) => (
                            <ExperienceItem key={item.company + i} item={item} index={i} onInView={handleInView} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
