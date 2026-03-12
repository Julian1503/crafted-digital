"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { bgAlt, border, white, accent, E } from "./about-constants";
import { ChapterLabel, FadeUp } from "./ChapterLabel";

export function AboutCTA() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section
            ref={ref}
            className="relative overflow-hidden border-t px-[clamp(1.25rem,5vw,5rem)] py-32"
            style={{ background: bgAlt, borderColor: border }}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute right-0 top-0 h-full w-[55%] opacity-[0.08]"
            >
                <Image
                    src="/img/CTA.webp"
                    alt=""
                    fill
                    sizes="55vw"
                    className="object-cover object-top"
                    style={{ filter: "grayscale(1)" }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to right, rgba(14,14,14,1) 0%, rgba(14,14,14,0) 50%)",
                    }}
                />
            </div>

            <div
                aria-hidden
                className="pointer-events-none absolute left-[20%] top-1/2 h-[50vw] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
                style={{
                    background:
                        "radial-gradient(circle, hsl(var(--hero-accent)/0.07) 0%, rgba(134, 34, 25, 0) 65%)",
                }}
            />

            <div className="relative z-10 mx-auto max-w-[1580px]">
                <FadeUp>
                    <ChapterLabel n="05" label="Work with me" />
                </FadeUp>

                <motion.h2
                    initial={{ opacity: 0, y: 28 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9, ease: E }}
                    className="mb-7 max-w-[15ch] font-sans text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[1.02] tracking-[-0.045em]"
                    style={{ color: white }}
                >
                    Ready to build something <em>that lasts?</em>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.75, delay: 0.15, ease: E }}
                    className="mb-11 max-w-[38ch] text-[clamp(0.92rem,1.5vw,1.1rem)] leading-[1.85]"
                    style={{ color: "rgba(255,255,255,0.38)" }}
                >
                    No commitment. Just a 20-minute call to see if we&apos;re the right fit. I&apos;ll be honest if we&apos;re not.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: "0.8rem" }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.28, ease: E }}
                    className="flex flex-wrap items-center gap-4"
                >
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-[0.6rem] rounded-full px-9 py-4 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-white transition-opacity duration-200 hover:opacity-[0.82]"
                        style={{ background: accent }}
                    >
                        Book a discovery call
                        <span
                            aria-hidden
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full border text-[0.6rem]"
                            style={{ borderColor: "rgba(255,255,255,0.3)" }}
                        >
                            ↗
                        </span>
                    </Link>

                    <Link
                        href="/#work"
                        className="font-mono text-[0.66rem] uppercase tracking-[0.1em] text-white/[0.3] transition-colors duration-200 hover:text-white/[0.92]"
                    >
                        View my work →
                    </Link>
                </motion.div>

                <motion.div
                    className="mt-20 h-px origin-left"
                    style={{
                        background: `linear-gradient(to right, ${accent}, rgba(134, 34, 25, 0))`,
                    }}
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ duration: 1.4, delay: 0.5, ease: E }}
                />
            </div>
        </section>
    );
}

