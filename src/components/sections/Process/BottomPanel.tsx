import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface Step {
    title:       string;
    range:       string;
    description: string;
    bullets:     string[];
}

interface BottomPanelProps { step: Step; index: number; total: number; }

export function BottomPanel({ step }: BottomPanelProps) {
    const prefersReducedMotion = useReducedMotion();
    const d = (n: number) => n;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step.title}
                className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-10 lg:px-16 xl:px-20 pb-10 md:pb-14"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion   ? { opacity: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                <motion.span
                    className="inline-block text-[0.62rem] tracking-[0.22em] uppercase mb-4"
                    style={{ color: "hsl(var(--hero-accent))" }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: d(0.1) }}
                >
                    {step.range}
                </motion.span>

                <motion.h3
                    className="font-serif font-normal leading-[1.04] tracking-[-0.03em] mb-4"
                    style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)", color: "rgba(255,255,255,0.95)", maxWidth: "18ch" }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: d(0.12), ease: [0.16, 1, 0.3, 1] }}
                >
                    {step.title}
                </motion.h3>

                <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-10">
                    <motion.p
                        className="text-[0.85rem] leading-[1.75] max-w-[44ch]"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: d(0.22) }}
                    >
                        {step.description}
                    </motion.p>

                    {step.bullets?.length > 0 && (
                        <motion.div
                            className="flex flex-wrap gap-2 sm:justify-end"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: d(0.3) }}
                        >
                            {step.bullets.map((b, i) => (
                                <motion.span
                                    key={b}
                                    className="text-[0.62rem] tracking-[0.1em] rounded-full px-3 py-1.5"
                                    style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: d(0.32 + i * 0.04) }}
                                >
                                    {b}
                                </motion.span>
                            ))}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
