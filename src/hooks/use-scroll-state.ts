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
    // Logo starts hidden if a hide-logo hero is present, visible otherwise.
    // We read the DOM after mount, so initialise conservatively to 0 and
    // correct synchronously in useLayoutEffect before the first paint.
    const [isScrolled,  setIsScrolled]  = React.useState(false);
    const [logoOpacity, setLogoOpacity] = React.useState(0);
    const [pastHero,    setPastHero]    = React.useState(!isHome);

    React.useLayoutEffect(() => {
        const onScroll = () => {
            const s         = window.scrollY;
            const threshold = window.innerHeight * HERO_THRESHOLD;
            const raw       = Math.min(s / threshold, 1);

            setIsScrolled(s > 12);

            // Does this page have a hero that already shows the name?
            const hasHideLogoHero = !!document.querySelector("[data-hide-logo]");

            if (hasHideLogoHero) {
                const logoP = raw < LOGO_FADE_START
                    ? 0
                    : (raw - LOGO_FADE_START) / (1 - LOGO_FADE_START);
                setLogoOpacity(logoP);
            } else {
                setLogoOpacity(1);
            }

            // CTA visibility (home only)
            if (isHome) {
                setPastHero(s >= window.innerHeight * 0.9);
            }
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [isHome]);

    return { isScrolled, logoOpacity, pastHero };
}