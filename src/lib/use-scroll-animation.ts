/**
 * @fileoverview Custom hook for scroll-triggered reveal animations.
 * Uses Intersection Observer API to detect when elements enter the viewport.
 * Respects user preferences for reduced motion accessibility.
 */
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Configuration options for the scroll animation hook.
 */
interface UseScrollAnimationOptions {
    /** Visibility threshold (0-1) for triggering animation. Default: 0.1 */
    threshold?: number;
    /** Root margin for the Intersection Observer. Default: "0px 0px -50px 0px" */
    rootMargin?: string;
    /** Whether to trigger animation only once. Default: true */
    once?: boolean;
    /** Whether the animation is enabled. Default: true */
    enabled?: boolean;
}

/**
 * Return type for the scroll animation hook.
 */
interface UseScrollAnimationResult<T extends HTMLElement> {
    /** Ref to attach to the target element */
    ref: React.RefObject<T | null>;
    /** Whether the element is currently visible in the viewport */
    isVisible: boolean;
}

/**
 * Checks if the user prefers reduced motion.
 * @returns True if user prefers reduced motion, false otherwise.
 */
function getPrefersReducedMotion(): boolean {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Custom hook for scroll-triggered reveal animations using Intersection Observer.
 * Automatically handles reduced motion preferences for accessibility.
 *
 * @template T - The HTML element type for the ref (defaults to HTMLDivElement)
 * @param options - Configuration options for the animation behavior
 * @returns Object containing the ref to attach and visibility state
 *
 * @example
 * ```tsx
 * const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
 * return <div ref={ref} className={isVisible ? 'visible' : 'hidden'}>Content</div>;
 * ```
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
    options: UseScrollAnimationOptions = {}
): UseScrollAnimationResult<T> {
    const {
        threshold = 0.1,
        rootMargin = "0px 0px -50px 0px",
        once = true,
        enabled = true,
    } = options;

    // Check reduced motion preference once on mount
    const prefersReducedMotion = getPrefersReducedMotion();
    const ref = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(prefersReducedMotion);

    useEffect(() => {
        if (!enabled || prefersReducedMotion) return;

        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.unobserve(entry.target);
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, once, enabled, prefersReducedMotion]);

    return { ref, isVisible };
}
