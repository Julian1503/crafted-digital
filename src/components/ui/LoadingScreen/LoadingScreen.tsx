"use client";

import { useEffect, useState } from "react";

type Phase = "entering" | "loading" | "revealing" | "exiting";

interface LoadingScreenProps {
    onComplete?: () => void;
    duration?: number;
}

export default function LoadingScreen({
                                          onComplete,
                                          duration = 2200,
                                      }: LoadingScreenProps) {
    const [phase, setPhase] = useState<Phase>("entering");
    const [progress, setProgress] = useState<number>(0);
    const [visible, setVisible] = useState<boolean>(true);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase("loading"), 400);

        const startTime = Date.now() + 400;
        const tick = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const p = Math.min((elapsed / duration) * 100, 100);
            setProgress(Math.floor(p));
            if (p >= 100) clearInterval(tick);
        }, 16);

        const t2 = setTimeout(() => setPhase("revealing"), 400 + duration);
        const t3 = setTimeout(() => setPhase("exiting"), 400 + duration + 700);
        const t4 = setTimeout(() => {
            setVisible(false);
            onComplete?.();
        }, 400 + duration + 700 + 600);

        return () => {
            clearTimeout(t1); clearTimeout(t2);
            clearTimeout(t3); clearTimeout(t4);
            clearInterval(tick);
        };
    }, []);

    if (!visible) return null;

    const isRevealing = phase === "revealing" || phase === "exiting";

    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
            style={{
                background: "hsl(var(--hero-bg))",
                transform: phase === "exiting" ? "translateY(-100%)" : "translateY(0)",
                transition: "transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)",
            }}
        >
            {/* Grain */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.05]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Diagonal stripe */}
            <div
                className="absolute inset-0 pointer-events-none opacity-0"
                style={{
                    background: `linear-gradient(115deg, transparent 0%, transparent 35%, hsl(var(--hero-accent) / 0.12) 35%, hsl(var(--hero-accent) / 0.12) 52%, transparent 52%)`,
                    animation: "stripeFade 0.8s 0.2s ease forwards",
                }}
            />

            {/* Corner brackets */}
            {(["tl", "tr", "bl", "br"] as const).map((pos) => (
                <span
                    key={pos}
                    className="absolute w-6 h-6 opacity-0"
                    style={{
                        top:    pos.startsWith("t") ? "2rem"   : undefined,
                        bottom: pos.startsWith("b") ? "2rem"   : undefined,
                        left:   pos.endsWith("l")   ? "2rem"   : undefined,
                        right:  pos.endsWith("r")   ? "2rem"   : undefined,
                        borderTop:    pos.startsWith("t") ? `1.5px solid hsl(var(--hero-accent) / 0.6)` : undefined,
                        borderBottom: pos.startsWith("b") ? `1.5px solid hsl(var(--hero-accent) / 0.6)` : undefined,
                        borderLeft:   pos.endsWith("l")   ? `1.5px solid hsl(var(--hero-accent) / 0.6)` : undefined,
                        borderRight:  pos.endsWith("r")   ? `1.5px solid hsl(var(--hero-accent) / 0.6)` : undefined,
                        animation: "cornerIn 0.5s 0.15s ease forwards",
                    }}
                />
            ))}

            {/* Center stage */}
            <div className="relative z-[1] flex flex-col items-center gap-6">

                {/* Name block */}
                <div
                    className="flex flex-col"
                    style={{
                        lineHeight: 0.88,
                        paddingBottom: "0.1em",
                        opacity:   phase === "entering" ? 0 : 1,
                        transform: phase === "entering"
                            ? "translateY(16px)"
                            : isRevealing
                                ? "translateY(0) scale(1.02)"
                                : "translateY(0)",
                        transition: isRevealing
                            ? "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
                            : "opacity 0.5s ease, transform 0.5s ease",
                    }}
                >
                    {(["Julian", "Delgado"] as const).map((name, li) => {
                        const anchor = name[0];
                        const rest   = name.slice(1);
                        return (
                            <div key={name} className="flex items-baseline overflow-visible">
                                {/* Anchor letter — always visible */}
                                <span
                                    className="block"
                                    style={{
                                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                                        fontSize: "clamp(5rem, 16vw, 13rem)",
                                        fontWeight: 700,
                                        color: "hsl(var(--primary-foreground))",
                                        letterSpacing: "-0.03em",
                                        lineHeight: 1,
                                        textShadow: "0 0 80px hsl(var(--hero-accent) / 0.2)",
                                    }}
                                >
                                    {anchor}
                                </span>

                                {/* Clipped suffix */}
                                <span
                                    className="inline-flex items-baseline"
                                    style={{
                                        paddingBottom: "0.22em",
                                        marginBottom: "-0.22em",
                                        clipPath: isRevealing ? "inset(0 0% -0.9em 0)" : "inset(0 100% -0.9em 0)",
                                        transition: isRevealing
                                            ? `clip-path 0.35s ${li * 0.06}s cubic-bezier(0.16, 1, 0.3, 1)`
                                            : "clip-path 0s",
                                    }}
                                >
                                    <span
                                        className="block whitespace-nowrap"
                                        style={{
                                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                                            fontSize: "clamp(5rem, 16vw, 13rem)",
                                            fontWeight: 700,
                                            color: "hsl(var(--primary-foreground))",
                                            letterSpacing: "-0.03em",
                                            lineHeight: 1,
                                            transform: isRevealing ? "translateX(0)" : "translateX(-12px)",
                                            transition: `transform 0.35s ${li * 0.06}s cubic-bezier(0.16, 1, 0.3, 1)`,
                                        }}
                                    >
                                        {rest}
                                    </span>
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Tagline */}
                <p
                    className="select-none font-light"
                    style={{
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        fontSize: "0.65rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        fontWeight: 400,
                        color: phase === "loading"
                            ? "hsl(var(--primary-foreground) / 0.3)"
                            : "hsl(var(--primary-foreground) / 0)",
                        opacity: isRevealing ? 0 : 1,
                        transition: "color 0.4s ease, opacity 0.3s ease",
                    }}
                >
                    Loading portfolio
                </p>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-12 left-10 right-10 z-[1] flex items-center gap-5">
                <div
                    className="flex-1 rounded-sm overflow-hidden"
                    style={{
                        height: "1px",
                        background: "hsl(var(--primary-foreground) / 0.1)",
                    }}
                >
                    <div
                        className="h-full rounded-sm"
                        style={{
                            width: `${progress}%`,
                            background: "hsl(var(--hero-accent))",
                            boxShadow: "0 0 8px hsl(var(--hero-accent) / 0.6)",
                            transition: "width 0.1s linear",
                        }}
                    />
                </div>
                <span
                    className="text-right"
                    style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "0.75rem",
                        fontWeight: 300,
                        letterSpacing: "0.08em",
                        color: "hsl(var(--primary-foreground) / 0.4)",
                        fontVariantNumeric: "tabular-nums",
                        minWidth: "2.5ch",
                    }}
                >
                    {String(progress).padStart(3, "0")}
                </span>
            </div>

            {/* Domain */}
            <span
                className="absolute bottom-8 right-10 opacity-0"
                style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: "0.58rem",
                    letterSpacing: "0.14em",
                    color: "hsl(var(--primary-foreground) / 0.2)",
                    fontWeight: 300,
                    animation: "domainIn 0.6s 0.5s ease forwards",
                }}
            >
                juliandelgado.com.au
            </span>
        </div>
    );
}