import { INTERVAL } from "@/components/sections/Hero/hero.constants";

interface ProgressFillProps {
    /** True for the slide currently shown. */
    active:  boolean;
    /** True while autoplay is running; the bar restarts whenever this or the slide changes. */
    running: boolean;
    /** Remount key: changes on every slide change so the CSS animation restarts. */
    cycle:   number;
}

/**
 * Slide progress bar driven by a CSS animation on `transform`, so the hero
 * no longer re-renders every animation frame to update a width.
 */
export function ProgressFill({ active, running, cycle }: ProgressFillProps) {
    if (!active || !running) return <span aria-hidden="true" className="absolute inset-y-0 left-0 w-full origin-left" style={{ transform: "scaleX(0)" }} />;
    return (
        <span
            key={cycle}
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
            style={{
                background: "hsl(var(--hero-accent))",
                animation:  `heroProgress ${INTERVAL}ms linear forwards`,
            }}
        />
    );
}
