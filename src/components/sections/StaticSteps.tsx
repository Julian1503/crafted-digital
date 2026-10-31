/**
 * @fileoverview Linear, non-animated rendering of a stepped section.
 *
 * Used by Services and Process in two situations:
 *   1. Below the desktop breakpoint or under prefers-reduced-motion, where the
 *      scroll-jacked sticky scene is replaced entirely by this list.
 *   2. On desktop, as a screen-reader-only copy so assistive tech can reach
 *      every step in reading order (the sticky scene only mounts the active one).
 */
import * as React from "react";

export interface StaticStep {
    title: string;
    description: string;
    bullets?: string[];
    /** Small label above the title, e.g. a time range or an outcome line. */
    eyebrow?: string;
}

interface StaticStepsProps {
    id: string;
    label: string;
    heading: string;
    intro?: string;
    steps: StaticStep[];
    /** "light" renders dark text on the page background; "dark" the reverse. */
    theme: "light" | "dark";
    /** When true the whole block is visually hidden but exposed to AT. */
    srOnly?: boolean;
    children?: React.ReactNode;
}

export function StaticSteps({ id, label, heading, intro, steps, theme, srOnly = false, children }: StaticStepsProps) {
    const dark = theme === "dark";
    const fg      = dark ? "rgba(255,255,255,0.92)" : "rgba(10,10,10,0.9)";
    const body    = dark ? "rgba(255,255,255,0.78)" : "rgba(10,10,10,0.7)";
    const muted   = dark ? "rgba(255,255,255,0.6)"  : "rgba(10,10,10,0.55)";
    const border  = dark ? "rgba(255,255,255,0.1)"  : "rgba(10,10,10,0.1)";
    const chipBg  = dark ? "rgba(255,255,255,0.08)" : "rgba(10,10,10,0.05)";
    const bg      = dark ? "#0c0c0c" : "hsl(var(--background))";
    const headingId = `${id}-heading`;

    return (
        <section
            id={srOnly ? undefined : id}
            aria-labelledby={headingId}
            className={srOnly ? "sr-only" : "px-6 sm:px-10 lg:px-16 py-16 md:py-24 scroll-mt-16"}
            style={srOnly ? undefined : { background: bg, color: fg }}
            data-header-theme={srOnly ? undefined : theme}
        >
            <div className="mx-auto max-w-5xl">
                <p className="text-[0.7rem] tracking-[0.22em] uppercase mb-4" style={{ color: muted }}>{label}</p>
                <h2
                    id={headingId}
                    className="font-serif font-normal leading-[1.05] tracking-[-0.03em] mb-4 text-balance"
                    style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: fg }}
                >
                    {heading}
                </h2>
                {intro && <p className="text-[0.95rem] leading-[1.75] mb-10 max-w-[52ch]" style={{ color: body }}>{intro}</p>}

                <ol className="list-none m-0 p-0 border-t" style={{ borderColor: border }}>
                    {steps.map((step, i) => (
                        <li key={step.title} className="py-8 border-b grid grid-cols-[2.5rem_1fr] gap-4 md:gap-8" style={{ borderColor: border }}>
                            <span className="font-mono text-[0.75rem] tracking-[0.18em] pt-1" style={{ color: muted }} aria-hidden="true">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <div>
                                {step.eyebrow && (
                                    <p className="text-[0.72rem] tracking-[0.16em] uppercase mb-2" style={{ color: "hsl(var(--hero-accent))" }}>{step.eyebrow}</p>
                                )}
                                <h3 className="font-serif font-normal leading-[1.1] tracking-[-0.02em] mb-3 text-balance" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.1rem)", color: fg }}>
                                    {step.title}
                                </h3>
                                <p className="text-[0.95rem] leading-[1.75] max-w-[52ch]" style={{ color: body }}>{step.description}</p>
                                {step.bullets && step.bullets.length > 0 && (
                                    <ul className="mt-4 flex flex-wrap gap-2 list-none p-0 m-0">
                                        {step.bullets.map((b) => (
                                            <li key={b} className="text-[0.75rem] tracking-[0.06em] rounded-full px-3 py-1.5" style={{ color: fg, background: chipBg }}>
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </li>
                    ))}
                </ol>
                {children}
            </div>
        </section>
    );
}
