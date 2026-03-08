"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./hero.module.css";

type Slide = { img: string; tag: string; year: string };

const slides: Slide[] = [
    { img: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772696966/hero-1", tag: "Creative Direction", year: "2026" },
    { img: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772696966/hero-2", tag: "Web Development",    year: "2026" },
    { img: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772696966/hero-3", tag: "Brand Identity",     year: "2026" },
    { img: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772696966/hero-4", tag: "Digital Design",     year: "2026" },
];

const INTERVAL    = 5000;
const THRESHOLD   = 0.58;
const HEADER_H    = 64;
const HEADER_PX   = 40;

const pad = (n: number): string => String(n + 1).padStart(2, "0");
const cloudinaryUrl = (base: string, width: number, quality = 80): string =>
    base.replace("/upload/", `/upload/w_${width},q_${quality},f_auto/`);
const buildSrcSet = (base: string): string => [
    `${cloudinaryUrl(base, 480,  75)} 480w`,
    `${cloudinaryUrl(base, 768,  80)} 768w`,
    `${cloudinaryUrl(base, 1280, 85)} 1280w`,
    `${cloudinaryUrl(base, 1920, 90)} 1920w`,
].join(", ");

function easeInOutQuart(t: number): number {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}
function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

// ─────────────────────────────────────────────────────────────────────────────
// Floating title
// ─────────────────────────────────────────────────────────────────────────────
interface FloatingTitleProps {
    metricsReady: boolean;
    startX: number;
    startY: number;
    startH: number;
    currentSlide: number;
}

function FloatingTitle({ metricsReady, startX, startY, startH }: FloatingTitleProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!metricsReady) return;

        const TARGET_H    = 20;
        const targetScale = startH > 0 ? TARGET_H / (startH / 2) : 0.18;

        const onScroll = () => {
            if (!ref.current) return;
            const scrollY   = window.scrollY;
            const threshold = window.innerHeight * THRESHOLD;
            const raw       = Math.min(scrollY / threshold, 1);
            const p         = easeInOutQuart(raw);

            // On mobile, target slightly smaller header px
            const isMobile = window.innerWidth < 768;
            const headerPx = isMobile ? 16 : HEADER_PX;

            const targetX = headerPx;
            const targetY = (HEADER_H - TARGET_H) / 2;

            const x = lerp(startX, targetX, p);
            const currentViewportStartY = startY - scrollY;
            const y     = lerp(currentViewportStartY, targetY, p);
            const scale = lerp(1, targetScale, p);

            ref.current.style.transform       = `translate(${x}px, ${y}px) scale(${scale})`;
            ref.current.style.transformOrigin = "top left";
            ref.current.style.opacity         = raw >= 0.92
                ? String(lerp(1, 0, (raw - 0.92) / 0.08))
                : "1";
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [metricsReady, startX, startY, startH]);

    if (!metricsReady) return null;

    return (
        <div
            ref={ref}
            aria-hidden="true"
            style={{
                position:      "fixed",
                top:           0,
                left:          0,
                zIndex:        60,
                pointerEvents: "none",
                willChange:    "transform, opacity",
            }}
        >
            <h1
                className="font-semibold leading-[0.92] tracking-[-0.02em]"
                style={{
                    fontSize:   "clamp(3.5rem, 8vw, 8rem)",
                    color:      "hsl(var(--primary-foreground))",
                    whiteSpace: "nowrap",
                }}
            >
                {["Julian", "Delgado"].map((word) => (
                    <span key={word} className="block">{word}</span>
                ))}
            </h1>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile slide dots
// ─────────────────────────────────────────────────────────────────────────────
function MobileDots({
                        slides,
                        current,
                        progress,
                        onDotTap,
                    }: {
    slides: Slide[];
    current: number;
    progress: number;
    onDotTap: (i: number) => void;
}) {
    return (
        <div className="flex items-center gap-2">
            {slides.map((_, i) => (
                <button
                    key={i}
                    onClick={() => onDotTap(i)}
                    aria-label={`Slide ${i + 1}`}
                    className="relative h-[2px] rounded-full overflow-hidden"
                    style={{
                        width:      i === current ? "2rem" : "0.75rem",
                        background: "hsl(var(--primary-foreground) / 0.18)",
                        transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
                    }}
                >
                    <span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                            width:      i === current ? `${progress}%` : "0%",
                            background: "hsl(var(--hero-accent))",
                            transition: "width 0.1s linear",
                        }}
                    />
                </button>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────
export default function Hero() {
    const [current,  setCurrent]  = useState<number>(0);
    const [prev,     setPrev]     = useState<number | null>(null);
    const [progress, setProgress] = useState<number>(0);

    // Touch/swipe state
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    // Floating title
    const ghostRef = useRef<HTMLHeadingElement>(null);
    const [metrics, setMetrics] = useState({ x: 0, y: 0, h: 0, ready: false });

    // Side-sliding elements
    const tagRef        = useRef<HTMLSpanElement>(null);
    const descRef       = useRef<HTMLParagraphElement>(null);
    const bottomRowRef  = useRef<HTMLDivElement>(null);

    const animatingRef = useRef<boolean>(false);
    const startTimeRef = useRef<number | null>(null);
    const rafRef       = useRef<number | null>(null);

    // ── Slide logic ──────────────────────────────────────────────────────────
    const goTo = (index: number): void => {
        if (animatingRef.current || index === current) return;
        animatingRef.current = true;
        setPrev(current);
        setCurrent(index);
        setProgress(0);
        startTimeRef.current = null;
        setTimeout(() => {
            setPrev(null);
            animatingRef.current = false;
        }, 900);
    };

    const goNext = (): void => goTo((current + 1) % slides.length);

    useEffect(() => {
        const animate = (ts: number): void => {
            if (!startTimeRef.current) startTimeRef.current = ts;
            const elapsed = ts - startTimeRef.current;
            const p = Math.min((elapsed / INTERVAL) * 100, 100);
            setProgress(p);
            if (p < 100) rafRef.current = requestAnimationFrame(animate);
        };
        startTimeRef.current = null;
        rafRef.current = requestAnimationFrame(animate);
        const timer = setTimeout(goNext, INTERVAL);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current]);

    const getSlideState = (i: number) => {
        if (i === current && prev !== null) return "entering";
        if (i === current) return "active";
        if (i === prev)    return "leaving";
        return null;
    };

    // ── Touch / swipe ────────────────────────────────────────────────────────
    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        // Only register horizontal swipes
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            if (dx < 0) goTo((current + 1) % slides.length);
            else        goTo((current - 1 + slides.length) % slides.length);
        }
        touchStartX.current = null;
        touchStartY.current = null;
    };

    // ── Measure ghost title ──────────────────────────────────────────────────
    useEffect(() => {
        const measure = () => {
            if (!ghostRef.current) return;
            const rect = ghostRef.current.getBoundingClientRect();
            setMetrics({
                x: rect.left,
                y: rect.top + window.scrollY,
                h: rect.height,
                ready: true,
            });
        };
        const id = requestAnimationFrame(() => setTimeout(measure, 80));
        window.addEventListener("resize", measure);
        return () => {
            cancelAnimationFrame(id);
            window.removeEventListener("resize", measure);
        };
    }, []);

    // ── Scroll listener ──────────────────────────────────────────────────────
    useEffect(() => {
        const enterTimer = setTimeout(() => {
            if (window.scrollY > 50) return;
            if (tagRef.current)  tagRef.current.style.opacity  = "1";
            if (descRef.current) descRef.current.style.opacity = "1";
            if (bottomRowRef.current) bottomRowRef.current.style.opacity = "1";
        }, 350);

        const onScroll = () => {
            const scrollY   = window.scrollY;
            const threshold = window.innerHeight * THRESHOLD;
            const raw       = Math.min(scrollY / threshold, 1);
            const p = easeInOutQuart(Math.min(raw / 0.45, 1));

            if (tagRef.current) {
                tagRef.current.style.transform = `translateX(${lerp(0, -100, p)}px)`;
                tagRef.current.style.opacity   = String(lerp(1, 0, p));
            }
            if (descRef.current) {
                descRef.current.style.transform = `translateX(${lerp(0, 80, p)}px)`;
                descRef.current.style.opacity   = String(lerp(1, 0, p));
            }
            if (bottomRowRef.current) {
                bottomRowRef.current.style.opacity = String(lerp(1, 0, easeInOutQuart(Math.min(raw / 0.35, 1))));
            }
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            clearTimeout(enterTimer);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <>
            <FloatingTitle
                metricsReady={metrics.ready}
                startX={metrics.x}
                startY={metrics.y}
                startH={metrics.h}
                currentSlide={current}
            />

            <section
                className="relative w-full overflow-hidden min-h-[600px] h-svh bg-[hsl(var(--hero-bg))] cursor-default"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {/* Grain */}
                <div
                    className="absolute inset-0 z-[3] pointer-events-none opacity-[0.04]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Slides */}
                {slides.map((slide, i) => {
                    const state = getSlideState(i);
                    if (!state) return null;
                    return (
                        <div key={i} className={`${styles["hero-slide"]} absolute inset-0 overflow-hidden`}>
                            <img
                                src={cloudinaryUrl(slide.img, 1280, 85)}
                                srcSet={buildSrcSet(slide.img)}
                                sizes="100vw"
                                alt={slide.tag}
                                className={`${styles["hero-img"]} ${
                                    state === "entering" ? styles["hero-img-entering"] :
                                        state === "active"   ? styles["hero-img-active"]   :
                                            styles["hero-img-leaving"]
                                }`}
                                fetchPriority={i === 0 ? "high" : "auto"}
                                loading={i === 0 ? "eager" : "lazy"}
                                decoding="async"
                            />
                        </div>
                    );
                })}

                {/* Gradient overlay — stronger at bottom on mobile for readability */}
                <div
                    className="absolute inset-0 pointer-events-none z-[2]"
                    style={{
                        background: `
                            linear-gradient(to top,  hsl(var(--hero-bg) / 0.97) 0%, hsl(var(--hero-bg) / 0.55) 40%, hsl(var(--hero-bg) / 0.15) 100%),
                            linear-gradient(to right, hsl(var(--hero-bg) / 0.65) 0%, transparent 60%)
                        `,
                    }}
                />

                {/* Side decoration — desktop only */}
                <span
                    className="absolute right-10 top-1/2 -translate-y-1/2 z-10 hidden md:block"
                    style={{
                        writingMode:   "vertical-rl",
                        fontSize:      "0.62rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color:         "hsl(var(--primary-foreground) / 0.2)",
                        fontWeight:    300,
                    }}
                >
                    Toowoomba · Australia · {slides[current].year}
                </span>

                {/* UI Layer */}
                <div className="absolute inset-0 z-10 flex flex-col justify-between px-6 pt-7 pb-8 md:px-10 md:pt-10 md:pb-11">

                    {/* Top row */}
                    <div className="flex justify-between items-start">
                        {/* Mobile: location tag top-left */}
                        <span
                            className="block md:hidden"
                            style={{
                                fontSize:      "0.58rem",
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                color:         "hsl(var(--primary-foreground) / 0.28)",
                                fontWeight:    300,
                                paddingTop:    "0.15rem",
                            }}
                        >
                            Toowoomba · AU
                        </span>

                        {/* Counter — top right always */}
                        <div className="text-right ml-auto">
                            <span
                                className="block leading-none font-light"
                                style={{
                                    fontSize: "clamp(2rem, 8vw, 3.5rem)",
                                    color:    "hsl(var(--primary-foreground) / 0.9)",
                                }}
                            >
                                {pad(current)}
                            </span>
                            <span
                                style={{
                                    fontSize:      "0.7rem",
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color:         "hsl(var(--primary-foreground) / 0.35)",
                                    fontWeight:    400,
                                }}
                            >
                                — {pad(slides.length - 1)}
                            </span>
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div className="flex flex-col gap-5 md:flex-row md:justify-between md:items-end md:gap-8">

                        {/* Title block */}
                        <div className="flex-1 overflow-hidden">

                            {/* Tag */}
                            <span
                                ref={tagRef}
                                className="inline-block mb-3"
                                style={{
                                    opacity:    0,
                                    transition: "opacity 0.5s ease",
                                    willChange: "transform, opacity",
                                }}
                            >
                                <span
                                    key={`tag-${current}`}
                                    style={{
                                        display:       "inline-block",
                                        fontSize:      "0.65rem",
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase",
                                        color:         "hsl(var(--hero-accent))",
                                        fontWeight:    500,
                                    }}
                                >
                                    {slides[current].tag}
                                </span>
                            </span>

                            {/* Ghost anchor */}
                            <h1
                                ref={ghostRef}
                                aria-label="Julian Delgado"
                                className="font-semibold leading-[0.92] tracking-[-0.02em]"
                                style={{
                                    fontSize:   "clamp(3.2rem, 8vw, 8rem)",
                                    color:      "transparent",
                                    userSelect: "none",
                                    visibility: "hidden",
                                }}
                            >
                                {["Julian", "Delgado"].map((word) => (
                                    <span key={word} className="block overflow-hidden pb-[0.18em] -mb-[0.18em]">
                                        <span className="block">{word}</span>
                                    </span>
                                ))}
                            </h1>

                            {/* Description — visible on all screen sizes */}
                            <p
                                ref={descRef}
                                className="mt-4 md:mt-6 font-light leading-relaxed max-w-[300px] md:max-w-[320px]"
                                style={{
                                    fontSize: "clamp(0.78rem, 2.2vw, 0.875rem)",
                                    color:    "hsl(var(--primary-foreground) / 0.42)",
                                    opacity:    0,
                                    transition: "opacity 0.5s ease",
                                    willChange: "transform, opacity",
                                }}
                            >
                                Crafting digital experiences that connect brands with people — from concept to pixel.
                            </p>
                        </div>

                        {/* Right block */}
                        <div
                            ref={bottomRowRef}
                            className="flex items-center justify-between md:flex-col md:items-end gap-6 md:gap-8 shrink-0"
                            style={{ opacity: 0, transition: "opacity 0.5s ease", willChange: "opacity" }}
                        >
                            {/* Desktop: progress bars / Mobile: dots inline with CTA */}
                            <div className="hidden md:flex flex-col gap-[0.6rem] items-end">
                                {slides.map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-[0.6rem] cursor-pointer"
                                        onClick={() => goTo(i)}
                                    >
                                        <span
                                            style={{
                                                fontSize:      "0.62rem",
                                                letterSpacing: "0.12em",
                                                textTransform: "uppercase",
                                                fontWeight:    400,
                                                color:         i === current
                                                    ? "hsl(var(--primary-foreground) / 0.8)"
                                                    : "hsl(var(--primary-foreground) / 0.3)",
                                                transition: "color 0.3s",
                                            }}
                                        >
                                            {pad(i)}
                                        </span>
                                        <div
                                            className="w-14 rounded-sm overflow-hidden"
                                            style={{
                                                height:     "1.5px",
                                                background: "hsl(var(--primary-foreground) / 0.12)",
                                            }}
                                        >
                                            <div
                                                className="h-full rounded-sm"
                                                style={{
                                                    width:      i === current ? `${progress}%` : "0%",
                                                    background: "hsl(var(--hero-accent))",
                                                    transition: "width 0.1s linear",
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Mobile: dots on the left of CTA */}
                            <div className="md:hidden">
                                <MobileDots
                                    slides={slides}
                                    current={current}
                                    progress={progress}
                                    onDotTap={goTo}
                                />
                            </div>

                            {/* CTA */}
                            <a
                                href="/contact"
                                className="group flex items-center gap-[0.75rem] md:gap-[0.9rem] rounded-full no-underline whitespace-nowrap"
                                style={{
                                    background:    "hsl(var(--hero-accent))",
                                    color:         "hsl(var(--primary-foreground))",
                                    padding:       "0.75rem 1.4rem",
                                    fontSize:      "0.75rem",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    fontWeight:    500,
                                    transition:    "background 0.25s, transform 0.25s, box-shadow 0.25s",
                                }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLAnchorElement;
                                    el.style.background = "hsl(var(--hero-accent-dark))";
                                    el.style.transform  = "translateY(-2px)";
                                    el.style.boxShadow  = "0 12px 32px hsl(var(--hero-accent) / 0.4)";
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLAnchorElement;
                                    el.style.background = "hsl(var(--hero-accent))";
                                    el.style.transform  = "";
                                    el.style.boxShadow  = "";
                                }}
                            >
                                Start a project
                                <span
                                    className="group-hover:rotate-45 flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full text-[0.85rem]"
                                    style={{
                                        border:     "1.5px solid hsl(var(--primary-foreground) / 0.4)",
                                        transition: "transform 0.25s",
                                    }}
                                >
                                    ↗
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Scroll hint — desktop */}
                <div
                    className="hidden md:flex absolute bottom-11 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2"
                    style={{ opacity: 0, animation: "fadeUp 0.8s 1s ease forwards" }}
                >
                    <div
                        className="w-px h-10"
                        style={{
                            background: "linear-gradient(to bottom, hsl(var(--primary-foreground) / 0.6), transparent)",
                            animation:  "scrollLine 1.8s ease infinite",
                        }}
                    />
                    <span
                        style={{
                            fontSize:      "0.58rem",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color:         "hsl(var(--primary-foreground) / 0.3)",
                            writingMode:   "vertical-rl",
                            transform:     "rotate(180deg)",
                            fontWeight:    400,
                        }}
                    >
                        Scroll
                    </span>
                </div>

                {/* Mobile swipe hint — shows briefly then fades */}
                <div
                    className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5"
                    style={{
                        opacity:   0,
                        animation: "fadeUp 0.6s 1.2s ease forwards, fadeOut 0.6s 3s ease forwards",
                    }}
                >
                    <span style={{
                        fontSize:      "0.55rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color:         "hsl(var(--primary-foreground) / 0.28)",
                    }}>
                        ← swipe →
                    </span>
                </div>
            </section>
        </>
    );
}