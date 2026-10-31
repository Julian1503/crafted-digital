/**
 * @fileoverview Process section — cinematic full-bleed scroll sequence.
 *
 * Deliberately different from Services in every dimension:
 *
 *   Services  →  light bg · split 55/45 · content primary · image support
 *   Process   →  dark bg  · full-bleed media · media primary · text overlays
 *
 * Scroll mechanic (same engine, different feel):
 *   • Container: (N + 0.5) × 100vh of scroll space
 *   • Sticky 100vh viewport; scroll drives step 0 → N-1
 *
 * Layout:
 *   • Full-viewport image / video behind everything
 *   • Ghost step number spans the full width — barely visible, cinematic
 *   • Horizontal chapter track across the top
 *   • Content panel anchored to the bottom — title + desc + bullet chips
 *   • Transitions: content rises from below, media crossfades with no scale
 */
"use client";

import * as React from "react";
import { steps } from "@/components/sections/Process/process-data";
import {useScrollStep} from "@/hooks/use-scroll-step";
import {FullBleedMedia} from "@/components/sections/Process/FullBleedMedia";
import {ChapterTrack} from "@/components/sections/Process/ChapterTrack";
import {BottomPanel} from "@/components/sections/Process/BottomPanel";
import GhostNumber from "@/components/sections/Process/GhostNumber";
import ScrollHint from "@/components/sections/Process/ScrollHint";
import { StaticSteps } from "@/components/sections/StaticSteps";
import { useMediaQuery, DESKTOP_QUERY, REDUCED_MOTION_QUERY } from "@/hooks/use-media-query";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step {
    title: string;
    range: string;
    description: string;
    bullets: string[];
    icon?: React.ElementType;
    image?: string;
    video?: string;
}

// ─── Main component ───────────────────────────────────────────────────────────

const STATIC_STEPS = (steps as Step[]).map((s) => ({
    title: s.title,
    description: s.description,
    bullets: s.bullets,
    eyebrow: s.range,
}));

export function Process() {
    const isDesktop      = useMediaQuery(DESKTOP_QUERY, false);
    const reducedByQuery = useMediaQuery(REDUCED_MOTION_QUERY, false);
    if (!isDesktop || reducedByQuery) {
        return (
            <StaticSteps
                id="process"
                label="003 · Process"
                heading="How a project runs"
                intro="Four phases, weekly demos, and a handover you own. Most websites ship in 2 to 6 weeks; custom software in 6 to 12."
                steps={STATIC_STEPS}
                theme="dark"
            />
        );
    }

    return <ProcessScene />;
}

/** Desktop-only sticky scene. Owns the scroll hooks so the target ref is always mounted. */
function ProcessScene() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const totalSteps   = (steps as Step[]).length;

    const { step, rawProgress } = useScrollStep(containerRef, totalSteps);

    const activeStep = (steps as Step[])[step];

    return (
        <>
        <StaticSteps id="process-list" label="Process" heading="How a project runs" steps={STATIC_STEPS} theme="dark" srOnly />
        <div
            ref={containerRef}
            id="process"
            aria-hidden="true"
            style={{ height: `${(totalSteps + 0.5) * 100}vh` }}
        >
            {/* ── Sticky cinematic viewport ────────────────────────────── */}
            <div
                className="sticky top-0 overflow-hidden"
                style={{ height: "100svh", background: "#0c0c0c" }}
            >
                {/* Full-bleed media background */}
                <FullBleedMedia step={activeStep} />

                {/* Ghost step number */}
                <GhostNumber step={step} />

                {/* Chapter track — top */}
                <ChapterTrack
                    steps={steps as Step[]}
                    active={step}
                    rawProgress={rawProgress}
                    total={totalSteps}
                />

                {/* Section label — top left (below chapter track) */}
                <div className="absolute top-7 left-6 sm:left-10 lg:left-16 xl:left-20 z-30 flex items-center gap-3 mt-4">
                    <span
                        className="font-mono text-[0.7rem] tracking-[0.25em] uppercase select-none"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                        003
                    </span>
                    <span className="h-px w-7 shrink-0" style={{ background: "rgba(255,255,255,0.12)" }} />
                    <span className="text-[0.7rem] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>
                        Process
                    </span>
                </div>

                {/* Step counter — top right */}
                <div className="absolute top-7 right-16 z-30 flex items-center mt-4">
                    <span
                        className="font-mono text-[0.7rem] tracking-[0.2em] tabular-nums"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                        {String(step + 1).padStart(2, "0")}&thinsp;/&thinsp;{String(totalSteps).padStart(2, "0")}
                    </span>
                </div>

                {/* Bottom content panel */}
                <BottomPanel
                    step={activeStep}
                    index={step}
                    total={totalSteps}
                />

                {/* Scroll hint — disappears after first step */}
                <ScrollHint visible={step === 0} />
            </div>
        </div>
        </>
    );
}