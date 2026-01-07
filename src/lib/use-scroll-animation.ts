// src/hooks/use-scroll-animation.ts
"use client";

import { useEffect, useRef, useState } from "react";

type UseScrollAnimationOptions = {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
    enabled?: boolean;
};

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
    options: UseScrollAnimationOptions = {}
) {
    const {
        threshold = 0.1,
        rootMargin = "0px 0px -50px 0px",
        once = true,
        enabled = true,
    } = options;

    const ref = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        // Accessibility: respect reduced motion
        if (typeof window !== "undefined") {
            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            if (prefersReducedMotion) {
                setIsVisible(true);
                return;
            }
        }

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
    }, [threshold, rootMargin, once, enabled]);

    return { ref, isVisible };
}
