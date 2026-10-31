"use client";

import * as React from "react";
import { HERO_THRESHOLD, LOGO_FADE_START } from "@/components/layout/header/header.data";

interface ScrollState {
    isScrolled:  boolean;
    logoOpacity: number;
    pastHero:    boolean;
}

/**
 * Tracks scroll position to derive:
 * - isScrolled:   whether the header background should appear
 * - logoOpacity:  fades in once the page hero (which already shows the name)
 *                 has scrolled out of view. Triggered by the presence of a
 *                 [data-hide-logo] element anywhere on the page — so ANY hero
 *                 that displays the name can opt in without touching this hook.
 * - pastHero:     whether the CTA button should be visible (home only)
 */
export function useScrollState(isHome: boolean): ScrollState {
    const [isScrolled,      setIsScrolled]      = React.useState(false);
    const [logoOpacity,     setLogoOpacity]     = React.useState(0);
    const [pastHero,        setPastHero]        = React.useState(!isHome);
    const [hideLogoVisible, setHideLogoVisible] = React.useState(false);

    // — Scroll: fade del hero superior (igual que antes) —
    React.useLayoutEffect(() => {
        // Looked up once: the hero that hides the logo does not change while mounted.
        const hasHideLogoHero = !!document.querySelector("[data-hide-logo]");
        let raf = 0;

        const update = () => {
            raf = 0;
            const s         = window.scrollY;
            const threshold = window.innerHeight * HERO_THRESHOLD;
            const raw       = Math.min(s / threshold, 1);

            setIsScrolled((prev) => { const next = s > 12; return prev === next ? prev : next; });
            if (isHome) setPastHero((prev) => { const next = s >= window.innerHeight * 0.9; return prev === next ? prev : next; });

            const logoP = hasHideLogoHero
                ? (raw < LOGO_FADE_START ? 0 : (raw - LOGO_FADE_START) / (1 - LOGO_FADE_START))
                : 1;
            // Round to 2 decimals so tiny scroll deltas do not re-render the header.
            const rounded = Math.round(logoP * 100) / 100;
            setLogoOpacity((prev) => (prev === rounded ? prev : rounded));
        };

        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
    }, [isHome]);

    React.useEffect(() => {
        const targets = document.querySelectorAll("[data-hide-logo]");
        if (!targets.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const anyVisible = entries.some((e) => e.isIntersecting);
                setHideLogoVisible(anyVisible);
            },
            { threshold: 0.05 }
        );

        targets.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const finalOpacity = hideLogoVisible
        ? Math.min(logoOpacity, 0)
        : logoOpacity;

    return { isScrolled, logoOpacity: finalOpacity, pastHero };
}