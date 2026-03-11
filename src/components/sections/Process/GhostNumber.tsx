import {AnimatePresence, motion} from "framer-motion";
import * as React from "react";


export default function GhostNumber({ step }: { step: number }) {
    return (
        <AnimatePresence mode="wait">
            <motion.span
                key={step}
                className="absolute inset-0 flex items-center justify-center
                           pointer-events-none select-none font-serif"
                style={{
                    fontSize: "clamp(18rem, 40vw, 32rem)",
                    lineHeight: 1,
                    color: "rgba(255,255,255,0.03)",
                    letterSpacing: "-0.06em",
                    zIndex: 1,
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden="true"
            >
                {String(step + 1).padStart(2, "0")}
            </motion.span>
        </AnimatePresence>
    );
}