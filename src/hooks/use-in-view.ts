"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is visible in the viewport.
 * Disconnects after the first intersection (fire-once).
 *
 * @param threshold - IntersectionObserver threshold (0–1). Default 0.08.
 * @returns A tuple of [ref to attach, boolean visibility flag].
 */
export function useInView<T extends Element>(
  threshold = 0.08
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, visible];
}

