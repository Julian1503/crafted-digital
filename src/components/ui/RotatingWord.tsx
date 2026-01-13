import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function RotatingWord({
                          words,
                          intervalMs = 2000,
                         slotWidthCh = 18,
                      }: {
    words: string[];
    intervalMs?: number;
    slotWidthCh?: number;
}) {
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
