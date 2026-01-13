/**
 * @fileoverview Rotating word animation component.
 * Displays words that cycle with a smooth animation effect.
 */
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Props for the RotatingWord component.
 */
interface RotatingWordProps {
    /** Array of words to rotate through */
    words: string[];
    /** Interval between word changes in milliseconds. Default: 2000 */
    intervalMs?: number;
    /** Minimum width of the word slot in ch units. Default: 18 */
    slotWidthCh?: number;
}

/**
 * Animated rotating word component.
 * Cycles through an array of words with a smooth fade and slide transition.
 *
 * @param props - Component configuration
 * @returns A span with animated rotating words
 *
 * @example
 * ```tsx
 * <RotatingWord words={["Build", "Launch", "Scale"]} intervalMs={3000} />
 * ```
 */
export default function RotatingWord({
                          words,
                          intervalMs = 2000,
                         slotWidthCh = 18,
                      }: RotatingWordProps) {
    const [i, setI] = React.useState(0);



    React.useEffect(() => {
        if (words.length <= 1) return;
        const t = setInterval(() => setI((v) => (v + 1) % words.length), intervalMs);

        return () => clearInterval(t);
    }, [words.length, intervalMs]);

    const word = words[i];

    return (
        <span
            className="relative inline-flex align-baseline justify-center"
            style={{ minWidth: `${slotWidthCh}ch` }}
            aria-live="polite"
        >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
            key={word}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-0 right-0 text-left"
        >
          {word}
        </motion.span>
      </AnimatePresence>

            <span className="invisible text-nowrap">{words.reduce((a, b) => (a.length > b.length ? a : b), "")}</span>
    </span>
    );
}
