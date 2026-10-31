"use client";
import { REDUCED_MOTION_QUERY, useMediaQuery } from "@/hooks/use-media-query";

/** True when the OS asks for reduced motion; false during SSR and the first paint. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY, false);
}
