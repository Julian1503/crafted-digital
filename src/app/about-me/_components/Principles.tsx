"use client";

import { useRef } from "react";
import Image from "next/image";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    type MotionValue,
} from "framer-motion";
import type { AboutPrinciple } from "@/lib/mappers/content-block.mapper";
import { clamp01 } from "@/lib/utils";
import { bg, border, white, mid, dim, accent, LINE, E } from "./about-constants";
import { ChapterLabel } from "./ChapterLabel";

const PRINCIPLES_DATA = [
    {
        n: "01",
        title: "Human-first design",
        body: "Every interaction should feel obvious, calm, and supportive so people can focus on their work.",
        image: "/Human-first design.png",
        imgPos: "object-[center_80%]",
    },
    {
        n: "02",
        title: "Simplicity scales",
        body: "Clear architecture and lean interfaces keep products fast as your business grows.",
        image: "/Simplicity_scales.png",
        imgPos: "object-center",
    },
    {
        n: "03",
        title: "Evidence-driven",
        body: "Decisions are backed by research, analytics, and stakeholder alignment — not guesswork.",
        image: "/Evidence-driven.png",
        imgPos: "object-[center_60%]",
    },
    {
        n: "04",
        title: "Quality in every layer",
        body: "From typography to API design, I obsess over the details that build trust.",
        image: "/Quality_in_every_layer.png",
        imgPos: "object-center",
    },
];

function PrincipleDot({
    scrollYProgress,
    index,
    total,
}: {
    scrollYProgress: MotionValue<number>;
    index: number;
    total: number;
}) {
    const center = index === 0 ? 0.05 : index === total - 1 ? 0.95 : index / (total - 1);
    const halfStep = 0.5 / (total - 1);

    const c = (v: number) => Math.min(1, Math.max(0, v));
    const lo = c(center - halfStep);
    const midV = c(center);
    const hi = c(center + halfStep);

    const loSafe = lo;
    const midSafe = midV <= loSafe ? loSafe + 0.001 : midV;
    const hiSafe = hi <= midSafe ? midSafe + 0.001 : hi;

    const dotBg = useTransform(
        scrollYProgress,
        [loSafe, midSafe, hiSafe],
        ["rgba(255,255,255,0.18)", LINE, "rgba(255,255,255,0.18)"]
    );
    const dotW = useTransform(
        scrollYProgress,
        [loSafe, midSafe, hiSafe],
        ["6px", "22px", "6px"]
    );

    return (
        <motion.div
            className="h-[6px] rounded-full"
            style={{
                background: dotBg,
                width: dotW,
                transition: "none",
            }}
        />
    );
}

function PrinciplePanel({
    p,
    index,
    scrollYProgress,
}: {
    p: (typeof PRINCIPLES_DATA)[0];
    index: number;
    scrollYProgress: MotionValue<number>;
}) {
    const total = PRINCIPLES_DATA.length;
    const center = index === 0 ? 0.05 : index === total - 1 ? 0.95 : index / (total - 1);
    const step = 1 / (total - 1);

    const imgX = useTransform(
        scrollYProgress,
        [clamp01(center - step), clamp01(center), clamp01(center + step)],
        ["8%", "0%", "-8%"]
    );

    const textOpacity = useTransform(
        scrollYProgress,
        [
            clamp01(center - step * 0.5),
            clamp01(center - step * 0.12),
            clamp01(center + step * 0.12),
            clamp01(center + step * 0.5),
        ],
        [0, 1, 1, 0]
    );

    const textY = useTransform(
        scrollYProgress,
        [
            clamp01(center - step * 0.5),
            clamp01(center - step * 0.12),
            clamp01(center + step * 0.12),
            clamp01(center + step * 0.5),
        ],
        ["28px", "0px", "0px", "-28px"]
    );

    return (
        <div className="relative flex h-screen w-screen shrink-0 items-center overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-[62%] overflow-hidden">
                <motion.div className="absolute inset-0" style={{ x: imgX, scale: 1.08 }}>
                    <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="62vw"
                        className={`object-cover ${p.imgPos}`}
                        style={{ filter: "saturate(0.72) brightness(0.68)" }}
                        priority={index === 0}
                    />
                </motion.div>

                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.7) 28%, rgba(10,10,10,0.18) 60%, rgba(134, 34, 25, 0) 100%)",
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(134, 34, 25, 0) 18%, rgba(134, 34, 25, 0) 78%, rgba(10,10,10,0.65) 100%)",
                    }}
                />
                <div
                    className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[32px]"
                    style={{
                        background:
                            "radial-gradient(ellipse, rgba(134,33,25,0.12) 0%, rgba(134, 34, 25, 0) 70%)",
                    }}
                />
            </div>

            <div
                aria-hidden
                className="pointer-events-none absolute bottom-[-0.08em] left-[clamp(0.5rem,3.5vw,4rem)] select-none font-serif text-[clamp(13rem,26vw,24rem)] font-normal leading-none tracking-[-0.06em]"
                style={{ color: "rgba(255,255,255,0.028)" }}
            >
                {p.n}
            </div>

            <motion.div
                className="relative z-10 max-w-[min(560px,44vw)] pl-[clamp(1.25rem,5vw,5rem)] pr-8"
                style={{ opacity: textOpacity, y: textY }}
            >
                <div
                    className="mb-10 inline-flex items-center gap-[0.6rem] rounded-[4px] border px-[0.8rem] py-[0.35rem]"
                    style={{ borderColor: border }}
                >
                    <span className="font-mono text-[0.5rem] tracking-[0.2em]" style={{ color: accent }}>
                        {p.n}
                    </span>
                    <span className="inline-block h-[10px] w-px" style={{ background: border }} />
                    <span className="font-mono text-[0.5rem] uppercase tracking-[0.22em]" style={{ color: dim }}>
                        Principle
                    </span>
                </div>

                <h2
                    className="mb-6 font-serif text-[clamp(2.2rem,4.2vw,4rem)] font-normal italic leading-[1.05] tracking-[-0.04em]"
                    style={{ color: white }}
                >
                    {p.title}
                </h2>

                <p
                    className="mb-9 max-w-[40ch] text-[clamp(0.88rem,1.3vw,1.02rem)] leading-[1.92]"
                    style={{ color: mid }}
                >
                    {p.body}
                </p>

                <div
                    className="h-[2px] w-10 rounded-[2px]"
                    style={{
                        background: `linear-gradient(to right, ${LINE}, ${accent})`,
                        boxShadow: `0 0 10px ${LINE}`,
                    }}
                />
            </motion.div>
        </div>
    );
}

export function Principles({ principles }: { principles: AboutPrinciple[] }) {
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const rawX = useTransform(scrollYProgress, [0, 1], ["0vw", "-300vw"]);
    const x = useSpring(rawX, { stiffness: 55, damping: 22, restDelta: 0.001 });
    const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

    return (
        <section
            ref={sectionRef}
            className="relative h-[520vh] border-t"
            style={{ background: bg, borderColor: border }}
        >
            <div className="sticky top-0 h-screen overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: E }}
                    className="pointer-events-none absolute left-[clamp(1.25rem,5vw,5rem)] right-[clamp(1.25rem,5vw,5rem)] top-[clamp(1.5rem,3vh,2.8rem)] z-40"
                >
                    <ChapterLabel n="04" label="How I work" />
                </motion.div>

                <motion.div
                    className="flex h-full w-[400vw]"
                    style={{ x, willChange: "transform" }}
                >
                    {PRINCIPLES_DATA.map((p, i) => (
                        <PrinciplePanel
                            key={p.n}
                            p={p}
                            index={i}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </motion.div>

                <div className="absolute bottom-[2.2rem] left-1/2 z-40 flex -translate-x-1/2 items-center gap-[0.45rem]">
                    {PRINCIPLES_DATA.map((_, i) => (
                        <PrincipleDot
                            key={i}
                            scrollYProgress={scrollYProgress}
                            index={i}
                            total={PRINCIPLES_DATA.length}
                        />
                    ))}
                </div>

                <motion.div
                    className="pointer-events-none absolute bottom-[2.2rem] right-[clamp(1.25rem,5vw,5rem)] z-40 flex items-center gap-2"
                    style={{ opacity: hintOpacity }}
                >
                    <span className="font-mono text-[0.48rem] uppercase tracking-[0.24em] text-white/[0.28]">
                        Scroll to explore
                    </span>
                    <motion.span
                        animate={{ x: [0, 7, 0] }}
                        transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
                        className="text-[0.75rem] text-white/[0.28]"
                    >
                        →
                    </motion.span>
                </motion.div>
            </div>
        </section>
    );
}

