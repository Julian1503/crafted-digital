"use client";

import { bgAlt, border, white, mid, dim } from "./about-constants";
import { ChapterLabel, FadeUp } from "./ChapterLabel";

const METRICS = [
    { n: "/ 01", val: "1 click", lbl: "Full setup" },
    { n: "/ 02", val: "Hours",   lbl: "Saved daily" },
    { n: "/ 03", val: "Day 0",   lbl: "Since line one" },
] as const;

export function WhatIBuilt() {
    return (
        <section
            className="border-t px-[clamp(1.25rem,5vw,5rem)] py-28"
            style={{ background: bgAlt, borderColor: border }}
        >
            <div className="mx-auto max-w-[1580px]">
                <FadeUp>
                    <ChapterLabel n="03" label="What I Built" />
                </FadeUp>

                {/* Single column on mobile, two columns on md+ */}
                <div className="grid grid-cols-1 gap-[clamp(3rem,8vw,9rem)] md:grid-cols-2">

                    {/* ── Left: headline + stats ── */}
                    {/* sticky only applies at md+ via Tailwind class — no inline style */}
                    <div className="self-start md:sticky md:top-24">
                        <FadeUp>
                            <h2
                                className="font-serif text-[clamp(2rem,4.5vw,3.8rem)] font-normal leading-[1.08] tracking-[-0.035em]"
                                style={{ color: white }}
                            >
                                The impact <br /><em>I leave.</em>
                            </h2>

                            {/* Stats — 3 cols always, they're short enough */}
                            <div className="mt-12 grid grid-cols-3 gap-6">
                                {METRICS.map(({ n, val, lbl }) => (
                                    <div key={n}>
                                        <p className="mb-2 font-mono text-[0.48rem] tracking-[0.18em]" style={{ color: dim }}>{n}</p>
                                        <p className="mb-1 font-serif text-[clamp(1.2rem,2.8vw,2rem)] leading-none tracking-[-0.03em]" style={{ color: white }}>{val}</p>
                                        <p className="font-mono text-[0.46rem] uppercase tracking-[0.16em]" style={{ color: dim }}>{lbl}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeUp>
                    </div>

                    {/* ── Right: body text ── */}
                    <div>
                        <FadeUp delay={0.08}>
                            <p className="mb-[1.4rem] text-[clamp(0.92rem,1.4vw,1.05rem)] leading-[1.92]" style={{ color: mid }}>
                                Across the teams I&apos;ve worked with, I&apos;ve always been drawn to the same
                                kind of problem — the slow, manual, frustrating workflows that waste time and
                                quietly drain people every day.
                            </p>
                        </FadeUp>
                        <FadeUp delay={0.14}>
                            <p className="mb-[1.4rem] text-[clamp(0.92rem,1.4vw,1.05rem)] leading-[1.92]" style={{ color: mid }}>
                                At Sovos, that meant helping build Onboarding, an internal tool that turned a
                                painful setup process into a fast, automated flow. Before that, account creation,
                                permissions, and product configuration had to be handled manually. Afterward,
                                the same work could be triggered in one click and a short form.
                            </p>
                        </FadeUp>
                        <FadeUp delay={0.2}>
                            <p className="mb-[1.4rem] text-[clamp(0.92rem,1.4vw,1.05rem)] leading-[1.92]" style={{ color: mid }}>
                                What matters to me is not just the feature itself, but the effect it has once it
                                becomes part of everyday work. Less friction. Fewer repeated tasks. More time
                                for people to focus on what actually matters.
                            </p>
                        </FadeUp>
                        <FadeUp delay={0.26}>
                            <p className="text-[clamp(0.92rem,1.4vw,1.05rem)] leading-[1.92]" style={{ color: mid }}>
                                That is the kind of legacy I want my work to leave wherever I go.
                            </p>
                        </FadeUp>
                    </div>

                </div>
            </div>
        </section>
    );
}
