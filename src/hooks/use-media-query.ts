"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query without a setState-in-effect round trip.
 * Returns `fallback` during SSR and the first client render so markup matches.
 */
export function useMediaQuery(query: string, fallback = false): boolean {
    return useSyncExternalStore(
        (onChange) => {
            if (typeof window === "undefined") return () => {};
            const mql = window.matchMedia(query);
            mql.addEventListener("change", onChange);
            return () => mql.removeEventListener("change", onChange);
        },
        () => (typeof window === "undefined" ? fallback : window.matchMedia(query).matches),
        () => fallback
    );
}

export const DESKTOP_QUERY = "(min-width: 1024px)";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
