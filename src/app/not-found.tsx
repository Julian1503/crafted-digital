// not-found.tsx  —  place at: @/app/not-found.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type FlickerMode = "steady" | "pulse" | "buzz" | "broken";

function useFlicker(mode: FlickerMode, seed = 0) {
    const [on, setOn]           = useState(true);
    const [intensity, setIntensity] = useState(1);

    useEffect(() => {
        let raf: number;
        let timer: ReturnType<typeof setTimeout>;
        if (mode === "steady") return;

        const tick = () => {
            if (mode === "pulse") {
                const t = Date.now() / 1000 + seed;
                setIntensity(0.78 + Math.sin(t * 1.3) * 0.22);
                raf = requestAnimationFrame(tick);
            } else if (mode === "buzz") {
                setOn(Math.random() > 0.07);
                setIntensity(0.7 + Math.random() * 0.3);
                timer = setTimeout(tick, 35 + Math.random() * 55);
            } else if (mode === "broken") {
                const chance = Math.random();
                if (chance < 0.11) {
                    setOn(true);
                    setIntensity(0.45 + Math.random() * 0.55);
                    timer = setTimeout(() => {
                        setOn(false);
                        timer = setTimeout(tick, 350 + Math.random() * 1400);
                    }, 50 + Math.random() * 200);
                } else {
                    setOn(false);
                    timer = setTimeout(tick, 250 + Math.random() * 1100);
                }
            }
        };

        if (mode === "pulse") raf = requestAnimationFrame(tick);
        else timer = setTimeout(tick, seed * 75);

        return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
    }, [mode, seed]);

    return { on, intensity };
}

function NeonChar({
                      char, color, mode, seed = 0, size, font,
                  }: {
    char: string;
    color: { glow: string; mid: string; core: string };
    mode: FlickerMode;
    seed?: number;
    size: string;
    font: string;
}) {
    const { on, intensity } = useFlicker(mode, seed);
    const shadow = on
        ? [
            `0 0 3px  ${color.core}`,
            `0 0 10px ${color.core}`,
            `0 0 24px ${color.mid}`,
            `0 0 55px ${color.glow}`,
            `0 0 100px ${color.glow}`,
            `0 0 160px ${color.glow}`,
        ].join(", ")
        : "none";

    return (
        <span style={{
            display: "inline-block",
            color: on ? color.core : "rgba(255,255,255,0.03)",
            textShadow: shadow,
            opacity: on ? intensity : 0.03,
            transition: mode === "pulse" ? "none" : "opacity 0.04s, color 0.04s",
            fontFamily: font,
            fontSize: size,
            fontWeight: 400,
            letterSpacing: "-0.03em",
            lineHeight: 1,
        }}>
      {char}
    </span>
    );
}

function NeonSign({
                      text, color, modes, size, font, gap = "0.02em",
                  }: {
    text: string;
    color: { glow: string; mid: string; core: string };
    modes: FlickerMode[];
    size: string;
    font: string;
    gap?: string;
}) {
    return (
        <span style={{ display: "inline-flex", gap }}>
      {text.split("").map((ch, i) =>
          ch === " "
              ? <span key={i} style={{ display: "inline-block", width: "0.38em" }} />
              : <NeonChar
                  key={i} char={ch} color={color}
                  mode={modes[i % modes.length]}
                  seed={i * 4 + 1} size={size} font={font}
              />
      )}
    </span>
    );
}

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

// ── Brand palette ──────────────────────────────────────────────────────────
// #c0392b = bright crimson  →  main 404 sign (hotter, more saturated)
// #a93226 = deep crimson    →  NOT FOUND sign (darker, smoldering)
// Warm amber ghost for the tiny "ERROR" tag so it reads as a different tube
const CRIMSON_BRIGHT: { glow: string; mid: string; core: string } = {
    glow: "rgba(192, 57, 43, 0.65)",
    mid:  "rgba(220, 80, 60, 0.95)",
    core: "#e8604c",            // slightly lit-up version of #c0392b
};

const CRIMSON_DEEP: { glow: string; mid: string; core: string } = {
    glow: "rgba(169, 50, 38, 0.55)",
    mid:  "rgba(192, 70, 55, 0.9)",
    core: "#c96050",            // slightly lit-up version of #a93226
};

const AMBER_DIM: { glow: string; mid: string; core: string } = {
    glow: "rgba(200, 130, 60, 0.3)",
    mid:  "rgba(210, 150, 80, 0.7)",
    core: "#d4a070",
};

export default function NotFound() {
    const four1Modes: FlickerMode[] = ["pulse",  "steady", "pulse"];
    const zeroModes:  FlickerMode[] = ["steady", "buzz",   "steady"];
    const four2Modes: FlickerMode[] = ["buzz",   "pulse",  "broken"];

    const notModes:   FlickerMode[] = ["pulse",  "broken", "pulse",  "buzz",   "steady", "pulse", "pulse", "buzz"];
    const foundModes: FlickerMode[] = ["steady", "pulse",  "broken", "pulse",  "steady", "broken","buzz",  "pulse"];

    return (
        <div style={{
            minHeight: "100svh",
            background: "#0d0b09",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            fontFamily: "ui-monospace, monospace",
        }}>

            {/* Grain */}
            <div aria-hidden style={{
                position: "absolute", inset: 0,
                backgroundImage: GRAIN, backgroundSize: "512px",
                opacity: 0.3, mixBlendMode: "soft-light",
                pointerEvents: "none", zIndex: 2,
            }} />

            {/* Scanlines */}
            <div aria-hidden style={{
                position: "absolute", inset: 0,
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
                pointerEvents: "none", zIndex: 5,
            }} />

            {/* Vertical wall banding */}
            <div aria-hidden style={{
                position: "absolute", inset: 0,
                backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 52px, rgba(255,255,255,0.008) 52px, rgba(255,255,255,0.008) 53px)",
                pointerEvents: "none", zIndex: 0,
            }} />

            {/* Warm vignette — matches #0d0b09 at edges */}
            <div aria-hidden style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at 50% 46%, rgba(30,14,10,0) 0%, rgba(13,11,9,0.97) 68%)",
                pointerEvents: "none", zIndex: 0,
            }} />

            {/* Floor glow — two crimson puddles */}
            <div aria-hidden style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: "38%", pointerEvents: "none", zIndex: 1,
            }}>
                <div style={{
                    position: "absolute", top: "10%", left: "50%",
                    transform: "translateX(-50%)",
                    width: "55%", height: "80px", borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(192,57,43,0.18) 0%, transparent 70%)",
                    filter: "blur(22px)",
                }} />
                <div style={{
                    position: "absolute", top: "48%", left: "50%",
                    transform: "translateX(-50%)",
                    width: "35%", height: "55px", borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(169,50,38,0.12) 0%, transparent 70%)",
                    filter: "blur(28px)",
                }} />
            </div>

            {/* Ceiling glow — faint warm wash from top */}
            <div aria-hidden style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "30%", pointerEvents: "none", zIndex: 1,
                background: "radial-gradient(ellipse at 50% 0%, rgba(192,57,43,0.06) 0%, transparent 65%)",
            }} />

            {/* ── Content ── */}
            <div style={{
                position: "relative", zIndex: 10,
                display: "flex", flexDirection: "column",
                alignItems: "center", userSelect: "none",
            }}>

                {/* Small top tag */}
                <div style={{ marginBottom: "1.6rem", opacity: 0.48 }}>
                    <NeonSign
                        text="ERROR"
                        color={AMBER_DIM}
                        modes={["pulse","steady","pulse","steady","buzz"]}
                        size="clamp(0.55rem, 1.1vw, 0.8rem)"
                        font="ui-monospace, monospace"
                        gap="0.2em"
                    />
                </div>

                {/* ── 404 ── */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.04em", lineHeight: 1 }}>
                    <NeonSign text="4" color={CRIMSON_BRIGHT} modes={four1Modes} size="clamp(6.5rem, 21vw, 17rem)" font="'Georgia','Times New Roman',serif" />
                    <NeonSign text="0" color={CRIMSON_BRIGHT} modes={zeroModes}  size="clamp(6.5rem, 21vw, 17rem)" font="'Georgia','Times New Roman',serif" />
                    <NeonSign text="4" color={CRIMSON_BRIGHT} modes={four2Modes} size="clamp(6.5rem, 21vw, 17rem)" font="'Georgia','Times New Roman',serif" />
                </div>

                {/* Divider tube */}
                <div style={{
                    width: "clamp(200px, 52vw, 620px)",
                    height: 2,
                    margin: "clamp(0.5rem, 1.8vw, 1.3rem) 0",
                    background: "linear-gradient(to right, transparent, rgba(192,57,43,0.5) 18%, rgba(220,80,60,0.9) 45%, rgba(169,50,38,0.85) 70%, transparent)",
                    boxShadow: "0 0 8px rgba(192,57,43,0.55), 0 0 22px rgba(192,57,43,0.28), 0 0 50px rgba(169,50,38,0.15)",
                    borderRadius: "9999px",
                }} />

                {/* ── NOT FOUND ── */}
                <div style={{ display: "flex", alignItems: "center", gap: "clamp(0.5rem,2.2vw,1.3rem)" }}>
                    <NeonSign text="NOT"   color={CRIMSON_DEEP} modes={notModes}   size="clamp(1.7rem, 6vw, 5rem)" font="'Georgia','Times New Roman',serif" gap="0.04em" />
                    <NeonSign text="FOUND" color={CRIMSON_DEEP} modes={foundModes} size="clamp(1.7rem, 6vw, 5rem)" font="'Georgia','Times New Roman',serif" gap="0.04em" />
                </div>

                {/* Sub-copy */}
                <p style={{
                    marginTop: "clamp(1.8rem, 4vw, 3rem)",
                    fontSize: "clamp(0.6rem, 1.1vw, 0.78rem)",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(255,220,200,0.18)",
                    textAlign: "center",
                    maxWidth: "36ch",
                    lineHeight: 1.9,
                }}>
                    The page you're looking for doesn't exist —<br />
                    or it moved while I was shipping something else.
                </p>

                {/* Back home */}
                <Link
                    href="/"
                    style={{
                        marginTop: "clamp(1.4rem, 3.2vw, 2.4rem)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.55rem",
                        border: "1px solid rgba(192,57,43,0.32)",
                        borderRadius: "9999px",
                        padding: "0.68rem 1.8rem",
                        fontFamily: "ui-monospace, monospace",
                        fontSize: "0.6rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase" as const,
                        color: "rgba(220,130,110,0.65)",
                        textDecoration: "none",
                        boxShadow: "0 0 12px rgba(192,57,43,0.08), inset 0 0 10px rgba(192,57,43,0.04)",
                        transition: "color 0.25s, border-color 0.25s, box-shadow 0.25s",
                    }}
                    onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.color         = "#e8604c";
                        el.style.borderColor   = "rgba(192,57,43,0.65)";
                        el.style.boxShadow     = "0 0 22px rgba(192,57,43,0.22), inset 0 0 14px rgba(192,57,43,0.07)";
                    }}
                    onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.color         = "rgba(220,130,110,0.65)";
                        el.style.borderColor   = "rgba(192,57,43,0.32)";
                        el.style.boxShadow     = "0 0 12px rgba(192,57,43,0.08), inset 0 0 10px rgba(192,57,43,0.04)";
                    }}
                >
                    ← Back home
                </Link>

                {/* Location footer */}
                <p style={{
                    marginTop: "clamp(1.8rem, 4.5vw, 3.2rem)",
                    fontFamily: "ui-monospace, monospace",
                    fontSize: "0.44rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(255,220,200,0.09)",
                }}>
                    Julian Delgado · Toowoomba, AU
                </p>
            </div>
        </div>
    );
}