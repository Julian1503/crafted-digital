import {AnimatePresence, motion} from "framer-motion";

export default function ScrollHint({ visible }: { visible: boolean }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-30
                               flex flex-col items-center gap-2 pointer-events-none"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="w-px h-10"
                        style={{
                            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.25), transparent)",
                        }}
                        animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span
                        className="font-mono text-[0.48rem] tracking-[0.3em] uppercase"
                        style={{
                            color: "rgba(255,255,255,0.2)",
                            writingMode: "vertical-rl",
                            letterSpacing: "0.3em",
                        }}
                    >
                        Scroll
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
