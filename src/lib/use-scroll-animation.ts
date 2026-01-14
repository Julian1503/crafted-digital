/**
 * @fileoverview Custom hook for scroll-triggered reveal animations.
 * Uses Intersection Observer API to detect when elements enter the viewport.
 * Respects user preferences for reduced motion accessibility.
 */
"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface UseScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    once?:  boolean;
    enabled?: boolean;
}

interface UseScrollAnimationResult<T extends HTMLElement> {
    ref: React.RefObject<T | null>;
    isVisible:  boolean;
}

function subscribeToReducedMotion(callback:  () => void): () => void {
    if (typeof window === "undefined") return () => {};
    const mql = window. matchMedia("(prefers-reduced-motion: reduce)");
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
    return window.matchMedia("(prefers-reduced-motion:  reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
    return false;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
    options: UseScrollAnimationOptions = {}
): UseScrollAnimationResult<T> {
    const {
        threshold = 0.1,
        rootMargin = "0px 0px -50px 0px",
        once = true,
        enabled = true,
    } = options;

    const ref = useRef<T | null>(null);

    const prefersReducedMotion = useSyncExternalStore(
        subscribeToReducedMotion,
        getReducedMotionSnapshot,
        getReducedMotionServerSnapshot
    );

    const [observerVisible, setObserverVisible] = useState(false);

    useEffect(() => {
        if (prefersReducedMotion || !enabled) return;

        const el = ref.current;
        if (! el) return;

        let didUnobserve = false;

        const observer = new IntersectionObserver(
            (entries) => {
                // ✅ setState in callback - responding to an external system
                const entry = entries[0];
                if (entry.isIntersecting) {
                    setObserverVisible(true);
                    if (once && !didUnobserve) {
                        didUnobserve = true;
                        observer.unobserve(entry.target);
                    }
                } else if (!once) {
                    setObserverVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        // observe() will trigger the callback synchronously if an element
        // is already intersecting (per IntersectionObserver spec).
        // This handles the hard-refresh case correctly.
        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, once, enabled, prefersReducedMotion]);

    const isVisible = prefersReducedMotion || observerVisible;

    return { ref, isVisible };
}