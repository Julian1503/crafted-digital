/**
 * @fileoverview Scroll-triggered reveal animation wrapper component.
 * Applies entrance animations when elements scroll into view.
 */
"use client";

import { useScrollAnimation } from "@/lib/use-scroll-animation";
import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

/** Available animation variants for reveal the effect */
type RevealVariant = "up" | "left" | "right" | "scale";

/**
 * Props for the RevealSection component.
 */
interface RevealSectionProps {
    /** Content to be revealed with animation */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Delay before animation starts in milliseconds. Default: 0 */
    delay?: number;
    /** Animation direction/type. Default: "up" */
    variant?: RevealVariant;
}

/**
 * Wrapper component that applies scroll-triggered reveal animations.
 * Uses Intersection Observer to detect when content enters the viewport.
 *
 * @param props - Component configuration
 * @returns A div with reveal animation applied when scrolled into view
 */
export default function RevealSection({
                           children,
                           className,
                           delay = 0,
                           variant = "up",
                       }: RevealSectionProps) {
    const { ref, isVisible } = useScrollAnimation();
    const variantClass =
        variant === "left"
            ? "reveal-left"
            : variant === "right"
                ? "reveal-right"
                : variant === "scale"
                    ? "reveal-scale"
                    : "";

    // Runtime guard: Log if content stays hidden for too long (dev only)
    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return;

        const el = ref.current;
        if (!el) return;

        const timeout = setTimeout(() => {
            if (! isVisible) {
                const rect = el.getBoundingClientRect();
                const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
                if (isInViewport) {
                    console.warn(
                        '[RevealSection] Content is in viewport but not visible.  ' +
                        'This may indicate a scroll animation bug.',
                        { element: el, rect }
                    );
                }
            }
        }, 2000);

        return () => clearTimeout(timeout);
    }, [ref, isVisible]);

    return (
        <div
            ref={ref}
            style={{ ["--reveal-delay" as string]: `${delay}ms` }}
            className={cn(
                "reveal-on-scroll",
                variantClass,
                isVisible && "is-visible",
                className
            )}
        >
            {children}
        </div>
    );
}