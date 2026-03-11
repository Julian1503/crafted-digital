import * as React from "react";
import { HERO_THRESHOLD, LOGO_FADE_START } from "@/components/layout/header/header.data";

interface ScrollState {
    isScrolled:   boolean;
    logoOpacity:  number;
    pastHero:     boolean;
}

/**
 * Tracks scroll position to derive:
 * - whether the header background should appear (isScrolled)
 * - logo opacity (fades in as the floating hero title completes its journey)
 * - whether the CTA button should be visible (pastHero)
 */
export function useScrollState(isHome: boolean): ScrollState {
    const [isScrolled,  setIsScrolled]  = React.useState(false);
    const [logoOpacity, setLogoOpacity] = React.useState(isHome ? 0 : 1);
    const [pastHero,    setPastHero]    = React.useState(!isHome);

    React.useEffect(() => {
        const onScroll = () => {
            const s         = window.scrollY;
            const threshold = window.innerHeight * HERO_THRESHOLD;
            const raw       = Math.min(s / threshold, 1);

            setIsScrolled(s > 12);

            if (isHome) {
                const logoP = raw < LOGO_FADE_START
                    ? 0
                    : (raw - LOGO_FADE_START) / (1 - LOGO_FADE_START);
                setLogoOpacity(logoP);
                setPastHero(s >= window.innerHeight * 0.9);
            }
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [isHome]);

    return { isScrolled, logoOpacity, pastHero };
}
