/**
 * @fileoverview Work/Portfolio section showcasing featured projects.
 * Implements an auto-playing carousel with accessibility features.
 */
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import CarouselControls from "@/components/sections/Work/CarouselControls";
import { HEADER_MS, PROJECTS } from "@/components/sections/Work/work-data";

/** Duration of the autoplay interval in milliseconds */
const AUTOPLAY_MS = 4500;

/**
 * Checks if the user prefers reduced motion.
 * @returns True if user prefers reduced motion, false otherwise.
 */
function getPrefersReducedMotion(): boolean {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

/**
 * Work section component displaying featured projects in a carousel.
 * Features auto-play functionality, keyboard navigation, and reduced motion support.
 *
 * @returns The rendered Work section with project carousel
 */
export function Work() {
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const sectionRef = useRef<HTMLElement | null>(null);
    const progressRefs = useRef<Array<HTMLDivElement | null>>([]);

    const prefersReducedMotion = useMemo(() => getPrefersReducedMotion(), []);

    // Initialize hasRevealed based on motion preference to avoid setState in effect
    const [hasRevealed, setHasRevealed] = useState(prefersReducedMotion);
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (prefersReducedMotion || hasRevealed) return;

        const el = sectionRef.current;
        if (!el) return;

        const io = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first?.isIntersecting) {
                    setHasRevealed(true);
                    io.disconnect();
                }
            },
            { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [hasRevealed, prefersReducedMotion]);

    const scrollToIndex = useCallback((index: number) => {
        const el = scrollerRef.current;
        if (!el) return;

        const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-work-card]"));
        const target = cards[index];
        if (!target) return;

        const left =
            target.offsetLeft - (el.clientWidth - target.clientWidth) / 2;

        el.scrollTo({ left, behavior: "smooth" });
    }, []);

    const scrollByCard = useCallback(
        (dir: "left" | "right") => {
            const el = scrollerRef.current;
            if (!el) return;

            const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-work-card]"));
            if (!cards.length) return;

            const nextIndex =
                dir === "right"
                    ? activeIndex === cards.length - 1
                        ? 0
                        : activeIndex + 1
                    : activeIndex === 0
                        ? cards.length - 1
                        : activeIndex - 1;

            scrollToIndex(nextIndex);
            setActiveIndex(nextIndex);
        },
        [activeIndex, scrollToIndex]
    );

    const computeActiveIndex = useCallback(() => {
        const el = scrollerRef.current;
        if (!el) return 0;

        const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-work-card]"));
        if (cards.length === 0) return 0;

        const viewportCenter = el.scrollLeft + el.clientWidth / 2;

        let best = 0;
        let bestDist = Infinity;

        cards.forEach((card, i) => {
            const cardCenter = card.offsetLeft + card.clientWidth / 2;
            const d = Math.abs(cardCenter - viewportCenter);
            if (d < bestDist) {
                bestDist = d;
                best = i;
            }
        });

        return best;
    }, []);

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        let raf = 0;

        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const idx = computeActiveIndex();
                setActiveIndex(idx);
            });
        };

        const onResize = () => {
            const idx = computeActiveIndex();
            setActiveIndex(idx);
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);

        onResize();

        return () => {
            el.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            cancelAnimationFrame(raf);
        };
    }, [computeActiveIndex]);

    // Autoplay + progress bar via rAF
    useEffect(() => {
        if (prefersReducedMotion) return;
        if (paused) return;

        const el = scrollerRef.current;
        if (!el) return;

        let raf = 0;
        let start = performance.now();

        const loop = (now: number) => {
            const t = now - start;
            const p = Math.min(1, t / AUTOPLAY_MS);
            const elBar = progressRefs.current[activeIndex];
            if (elBar) elBar.style.transform = `scaleX(${p})`;

            if (p >= 1) {
                const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-work-card]"));
                if (!cards.length) return;

                const isLast = activeIndex === cards.length - 1;
                const nextIndex = isLast ? 0 : activeIndex + 1;

                if (isLast) el.scrollTo({ left: 0, behavior: "smooth" });
                else scrollToIndex(nextIndex);

                setActiveIndex(nextIndex);
                start = now;
            }

            raf = requestAnimationFrame(loop);
        };

        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [activeIndex, paused, prefersReducedMotion, scrollToIndex]);

    // Pause interactions (hover / touch / focus)
    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        const onEnter = () => setPaused(true);
        const onLeave = () => setPaused(false);
        const onDown = () => setPaused(true);
        const onUp = () => setPaused(false);
        const onFocusIn = () => setPaused(true);
        const onFocusOut = () => setPaused(false);

        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        el.addEventListener("pointerdown", onDown);
        window.addEventListener("pointerup", onUp);
        el.addEventListener("focusin", onFocusIn);
        el.addEventListener("focusout", onFocusOut);

        return () => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
            el.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
            el.removeEventListener("focusin", onFocusIn);
            el.removeEventListener("focusout", onFocusOut);
        };
    }, []);


    return (
        <section
            ref={sectionRef}
            id="work"
            className="py-24 bg-foreground text-background overflow-hidden"
        >
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div
                    className={cn(
                        "flex flex-col md:flex-row md:items-end justify-between gap-6",
                        "transition-all ease-out will-change-[transform,opacity,filter]",
                        !hasRevealed && "opacity-0 translate-y-3 blur-[2px]",
                        hasRevealed && "opacity-100 translate-y-0 blur-0"
                    )}
                    style={{ transitionDuration: `${HEADER_MS}ms` }}
                >
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/5 px-3 py-1 text-sm text-background/80 backdrop-blur">
                            <Sparkles className="h-4 w-4 text-secondary" />
                            Selected projects · Built to ship
                        </div>

                        <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight text-background">
                            Featured Work
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground/80">
                            Real examples of websites and web applications built for Australian businesses.{" "}
                            <Link href="/case-studies" className="text-secondary hover:underline">
                                View all case studies →
                            </Link>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="rounded-full text-background border-white/20 bg-transparent hover:bg-background/10"
                            onClick={() => scrollByCard("left")}
                            aria-label="Previous project"
                        >
                            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-full text-background border-white/20 bg-transparent hover:bg-background/10"
                            onClick={() => scrollByCard("right")}
                            aria-label="Next project"
                        >
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                    </div>
                </div>

                {/* Carousel */}
                <CarouselControls progressRefSet={progressRefs}
                                  activeIndex={activeIndex}
                                  hasRevealed={hasRevealed}
                                  scrollerRef={scrollerRef}
                                  projects={PROJECTS}/>
            </div>
        </section>
    );
}
