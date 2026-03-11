/**
 * Generic scroll-step hook.
 * Maps scroll progress [0,1] → discrete step index [0, totalSteps-1].
 *
 * Used by both Process and Services sections.
 */
import * as React from "react";
import { useScroll, useSpring } from "framer-motion";

interface ScrollStepResult {
    scrollYProgress: ReturnType<typeof useSpring>;
    step:        number;
    rawProgress: number;
    sectionEntered: boolean;
}

export function useScrollStep(
    containerRef: React.RefObject<HTMLDivElement | null>,
    totalSteps:   number,
): ScrollStepResult {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });
    const [sectionEntered, setSectionEntered] = React.useState(false);

    const smooth = useSpring(scrollYProgress, {
        stiffness: 85,
        damping:   26,
        restDelta: 0.001,
    });

    const [step,        setStep]        = React.useState(0);
    const [rawProgress, setRawProgress] = React.useState(0);

    React.useEffect(() => {
        return smooth.on("change", (v) => {
            setRawProgress(v);
            setStep(Math.max(0, Math.min(Math.floor(v * totalSteps), totalSteps - 1)));
            if (!sectionEntered && v > 0.015) setSectionEntered(true);
        });
    }, [smooth, totalSteps, sectionEntered]);

    return {scrollYProgress: smooth, step, rawProgress, sectionEntered};
}
