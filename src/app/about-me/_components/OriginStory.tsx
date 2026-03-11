"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { bgAlt, border, white, mid, dim, accent } from "./about-constants";
import { ChapterLabel, FadeUp } from "./ChapterLabel";

export function OriginStory() {
    const imageRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
    const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

    return (
        <section
            className="border-t px-[clamp(1.25rem,5vw,5rem)] py-28"
            style={{ background: bgAlt, borderColor: border }}
        >
            <div className="mx-auto max-w-[1580px]">
                <FadeUp>
                    <ChapterLabel n="01" label="Origin Story" />
                </FadeUp>

                <div
                    className="grid items-start gap-[clamp(2.5rem,6vw,6rem)] max-md:grid-cols-1"
                    style={{ gridTemplateColumns: "1fr 1fr" }}
                >
                    <div>
                        <FadeUp>
                            <h2
                                className="mb-8 font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-normal leading-[1.1] tracking-[-0.035em]"
                                style={{ color: white }}
                            >
                                How it all
                                <br />
                                <em>began.</em>
                            </h2>
                        </FadeUp>

                        <FadeUp delay={0.1}>
                            <p className="mb-[1.4rem] max-w-[54ch] text-[clamp(0.92rem,1.4vw,1.05rem)] leading-[1.92]" style={{ color: mid }}>
                                It started in 2017 with a Java course in Tucumán. One year, one promise: learn enough to enter the industry. I went every day, genuinely excited. Within a few weeks I realised I wasn&apos;t just learning to code — I was learning to think. To break a problem down until only the solution remains.
                            </p>
                        </FadeUp>

                        <FadeUp delay={0.16}>
                            <p className="mb-[1.4rem] max-w-[54ch] text-[clamp(0.92rem,1.4vw,1.05rem)] leading-[1.92]" style={{ color: mid }}>
                                That course led me to the Universidad Tecnológica Nacional in 2018. Algorithms, data structures, C#, statistics — the real foundations. I promoted most subjects. Then, before finishing, I pushed myself into freelance work. Real clients, real deadlines, no safety net.
                            </p>
                        </FadeUp>

                        <FadeUp delay={0.22}>
                            <p className="max-w-[54ch] text-[clamp(0.92rem,1.4vw,1.05rem)] leading-[1.92]" style={{ color: mid }}>
                                I&apos;d always passed the Sovos office on the bus to university. Every time I looked up at that building I thought: one day. In 2020, that day came. In October 2023 I graduated from UTN. Then I moved to Australia — still employed, still building. And in 2024, started my own journey doing what I love.
                            </p>
                        </FadeUp>

                        <FadeUp delay={0.28}>
                            <div className="mt-12 border-t pt-8" style={{ borderColor: border }}>
                                <p className="mb-5 font-mono text-[0.5rem] uppercase tracking-[0.26em]" style={{ color: dim }}>
                                    Milestones
                                </p>

                                <div className="relative flex gap-0">
                                    <div className="absolute left-0 right-0 top-[0.6rem] h-px" style={{ background: border }} />
                                    {[{ y: "2017", l: "First class" }, { y: "2018", l: "UTN" }, { y: "2020", l: "Sovos" }, { y: "2023", l: "Graduate + AU" }, { y: "2024", l: "Own business" }].map(({ y, l }, i) => (
                                        <div key={y} className="flex-1">
                                            <div
                                                className="mb-3 h-2 w-2 rounded-full border"
                                                style={{
                                                    background: i === 3 ? accent : border,
                                                    borderColor: i === 3 ? accent : "rgba(255,255,255,0.2)",
                                                }}
                                            />
                                            <p className="mb-1 font-serif text-[0.95rem] tracking-[-0.02em]" style={{ color: white }}>
                                                {y}
                                            </p>
                                            <p className="font-mono text-[0.44rem] uppercase tracking-[0.16em]" style={{ color: dim }}>
                                                {l}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeUp>
                    </div>

                    <div ref={imageRef} className="self-start md:sticky md:top-24">
                        <FadeUp delay={0.18}>
                            <div className="relative overflow-hidden rounded-[0.875rem]" style={{ aspectRatio: "3/4" }}>
                                <motion.div className="absolute inset-0" style={{ y: imgY, scale: 1.14 }}>
                                    <Image
                                        src="/img/me-aconcagua.jpg"
                                        alt="Julian in the Andes mountains"
                                        fill
                                        sizes="600px"
                                        className="object-cover"
                                        style={{ filter: "saturate(0.6) brightness(0.65)" }}
                                    />
                                </motion.div>

                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            "linear-gradient(to bottom, rgba(134, 34, 25, 0) 50%, rgba(10,10,10,0.85) 100%)",
                                    }}
                                />

                                <div className="absolute left-5 top-5">
                                    <span
                                        className="rounded-[4px] px-[0.65rem] py-[0.3rem] font-mono text-[0.46rem] uppercase tracking-[0.22em]"
                                        style={{
                                            color: "rgba(255,255,255,0.5)",
                                            background: "rgba(0,0,0,0.4)",
                                            backdropFilter: "blur(8px)",
                                        }}
                                    >
                                        APRIL 2023 / Aconcagua, Argentina
                                    </span>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-6">
                                    <p
                                        className="mb-[0.4rem] font-serif text-[0.9rem] italic leading-[1.6]"
                                        style={{ color: "rgba(255,255,255,0.55)" }}
                                    >
                                        &quot;The same mindset that gets you up a mountain gets you through a hard sprint.&quot;
                                    </p>
                                    <p className="font-mono text-[0.44rem] uppercase tracking-[0.2em]" style={{ color: accent }}>
                                        — Julian
                                    </p>
                                </div>
                            </div>
                        </FadeUp>
                    </div>
                </div>
            </div>
        </section>
    );
}

