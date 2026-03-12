"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { bg, border, white, mid, dim, accent, E } from "./about-constants";

const STATS = [
    { n: "40+",    l: "Projects" },
    { n: "5+",     l: "Years" },
    { n: "SE III", l: "Level" },
] as const;

export function AboutHero() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const imgScale  = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
    const fade      = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const grayscale = useTransform(scrollYProgress, [0, 1], [0, 30]);

    return (
        <section
            ref={ref}
            data-hide-logo
            data-header-theme="dark"
            className="relative h-svh min-h-[600px] w-full overflow-hidden"
            style={{ background: bg }}
        >
            {/* Background image */}
            <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
                <Image
                    src="/img/profile_dark.webp"
                    alt="Julian Delgado"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover object-top"
                    style={{ filter: `grayscale(${grayscale}%) brightness(0.55)` }}
                    priority
                />
            </motion.div>

            {/* Gradient overlays */}
            <div
                className="pointer-events-none absolute inset-0 z-[1]"
                style={{
                    background: `
                        linear-gradient(to top, ${bg} 0%, rgba(10,10,10,0.78) 45%, rgba(10,10,10,0.25) 100%),
                        linear-gradient(to right, rgba(10,10,10,0.88) 0%, rgba(134,34,25,0) 70%)
                    `,
                }}
            />

            {/* Grain */}
            <div
                className="pointer-events-none absolute inset-0 z-[2] opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Diagonal stripe */}
            <div
                className="pointer-events-none absolute inset-0 z-[2]"
                style={{
                    background: `linear-gradient(115deg,
                        rgba(134,34,25,0) 0%, rgba(134,34,25,0) 38%,
                        hsl(var(--hero-accent)/0.18) 38%, hsl(var(--hero-accent)/0.18) 56%,
                        rgba(134,34,25,0) 56%)`,
                }}
            />

            {/* Side decoration — desktop only */}
            <span
                className="absolute right-10 top-1/2 z-10 hidden -translate-y-1/2 md:block"
                style={{
                    writingMode: "vertical-rl",
                    fontSize: "0.62rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.2)",
                    fontWeight: 300,
                }}
            >
                Toowoomba · Australia · 2025
            </span>

            {/* Content */}
            <motion.div
                style={{ opacity: fade }}
                className="absolute inset-0 z-10 flex flex-col justify-end px-6 pb-10 md:px-10 md:pb-16"
            >
                <div className="mx-auto w-full max-w-[1580px]">
                    {/* Tag */}
                    <motion.span
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: E }}
                        className="mb-4 inline-block font-mono text-[0.65rem] uppercase tracking-[0.15em]"
                        style={{ color: accent }}
                    >
                        About Me
                    </motion.span>

                    {/* Title */}
                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ y: "110%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1.05, delay: 0.14, ease: E }}
                            className="font-semibold leading-[0.92] tracking-[-0.02em]"
                            style={{ fontSize: "clamp(3.2rem,8vw,8rem)", color: white }}
                        >
                            <span className="block">Julian</span>
                            <span className="block">Delgado</span>
                        </motion.h1>
                    </div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.46, duration: 0.8, ease: E }}
                        className="mt-4 max-w-[34ch] font-light leading-relaxed md:mt-7 md:max-w-[360px]"
                        style={{ fontSize: "clamp(0.82rem,2.2vw,0.9rem)", color: mid }}
                    >
                        Over 5 years solving real problems through code — from Argentina to a
                        Senior Engineer role at a Boston-based company, now building from Australia.
                    </motion.p>

                    {/* Stats row — always single row, no wrapping */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.62, duration: 0.7, ease: E }}
                        className="mt-6 flex items-end gap-6 md:mt-10 md:gap-8"
                    >
                        {STATS.map(({ n, l }) => (
                            <div key={l}>
                                <p className="mb-1 font-mono text-[0.5rem] uppercase tracking-[0.22em]" style={{ color: dim }}>{l}</p>
                                <p className="font-serif text-[1.5rem] leading-none tracking-[-0.03em]" style={{ color: white }}>{n}</p>
                            </div>
                        ))}

                        {/* Divider + CTA — desktop only inline */}
                        <div className="hidden h-10 w-px md:block" style={{ background: border }} />
                        <Link
                            href="/#contact"
                            className="group hidden md:flex items-center gap-[0.75rem] rounded-full no-underline whitespace-nowrap"
                            style={{
                                background: accent, color: white,
                                padding: "0.75rem 1.4rem",
                                fontSize: "0.75rem", letterSpacing: "0.08em",
                                textTransform: "uppercase", fontWeight: 500,
                                transition: "background 0.25s, transform 0.25s, box-shadow 0.25s",
                            }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget;
                                el.style.background = "hsl(var(--hero-accent-dark))";
                                el.style.transform  = "translateY(-2px)";
                                el.style.boxShadow  = "0 12px 32px hsl(var(--hero-accent)/0.4)";
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget;
                                el.style.background = accent;
                                el.style.transform  = "";
                                el.style.boxShadow  = "";
                            }}
                        >
                            Book a call
                            <span className="flex h-7 w-7 items-center justify-center rounded-full text-[0.85rem] transition-transform duration-200 group-hover:rotate-45"
                                style={{ border: "1.5px solid rgba(255,255,255,0.4)" }}>↗</span>
                        </Link>
                    </motion.div>

                    {/* CTA — mobile only, own row */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.72, duration: 0.6, ease: E }}
                        className="mt-4 md:hidden"
                    >
                        <Link
                            href="/#contact"
                            className="inline-flex items-center gap-3 rounded-full no-underline"
                            style={{
                                background: accent, color: white,
                                padding: "0.7rem 1.3rem",
                                fontSize: "0.72rem", letterSpacing: "0.08em",
                                textTransform: "uppercase", fontWeight: 500,
                            }}
                        >
                            Book a call
                            <span className="flex h-6 w-6 items-center justify-center rounded-full text-[0.8rem]"
                                style={{ border: "1.5px solid rgba(255,255,255,0.4)" }}>↗</span>
                        </Link>
                    </motion.div>

                    {/* Availability */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.85 }}
                        className="mt-5 flex flex-col gap-[0.4rem] md:flex-row md:flex-wrap md:items-center md:gap-5"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="inline-block h-[7px] w-[7px] shrink-0 rounded-full"
                                style={{ background: accent, animation: "heroPulse 2.2s infinite" }}
                            />
                            <span className="font-mono text-[0.5rem] uppercase tracking-[0.2em]" style={{ color: dim }}>
                                Available for projects
                            </span>
                        </div>
                        <span className="font-mono text-[0.5rem] uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.16)" }}>
                            Toowoomba, QLD, AU — 27.56° S, 151.95° E
                        </span>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll hint — desktop only */}
            <div
                className="absolute bottom-11 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
                style={{ opacity: 0, animation: "fadeUp 0.8s 1s ease forwards" }}
            >
                <div className="h-10 w-px"
                    style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(134,34,25,0))", animation: "scrollLine 1.8s ease infinite" }} />
                <span style={{ fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", writingMode: "vertical-rl", transform: "rotate(180deg)", fontWeight: 400 }}>
                    Scroll
                </span>
            </div>
        </section>
    );
}
