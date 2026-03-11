import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { StudyData } from "@/components/sections/Case-study/case-study.types";
import { C } from "@/components/sections/Case-study/case-study.constants";

// ─── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, active: boolean, duration = 1.4): number {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!active) return;
        let raf: number;
        const start = performance.now();
        const tick = (now: number) => {
            const t = Math.min((now - start) / (duration * 1000), 1);
            // ease-out quart
            const eased = 1 - Math.pow(1 - t, 4);
            setCount(Math.round(eased * target));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [active, target, duration]);
    return count;
}

// ─── Stat tile with count-up ───────────────────────────────────────────────────
function StatTile({
                      stat,
                      isInView,
                      delay
                  }: {
    stat: NonNullable<StudyData["stats"]>[number];
    isInView: boolean;
    delay: number;
}) {
    const numeric =
        stat.numericValue;

    const counted = useCountUp(numeric, isInView, 1.4);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            <p
                className="font-serif font-normal leading-none tracking-[-0.04em]"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", color: "#fff" }}
            >
                {stat.prefix}
                {counted.toLocaleString()}
                {stat.suffix}
            </p>
            <p
                className="mt-2 text-[0.62rem] tracking-[0.14em] uppercase"
                style={{ color: C.dim }}
            >
                {stat.label}
            </p>
        </motion.div>
    );
}

// ─── Section ───────────────────────────────────────────────────────────────────
interface ContextSectionProps {
    study: StudyData;
    image?: string;
}

export function ContextSection({ study, image }: ContextSectionProps) {
    const ref      = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section
            ref={ref}
            className="px-5 sm:px-8 md:px-14 lg:px-20 max-w-7xl mx-auto"
            style={{ paddingTop: "clamp(6rem, 16vw, 12rem)" }}
        >
            <div className={`grid gap-10 md:gap-16 ${image ? "md:grid-cols-[1fr_420px]" : ""} items-start`}>

                <motion.p
                    className="font-serif italic leading-[1.45] tracking-[-0.02em]"
                    style={{ fontSize: "clamp(1.2rem, 2.4vw, 1.85rem)", color: "rgba(255,255,255,0.65)" }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    {study.description}
                </motion.p>

                {/* Clip-reveal image */}
                {image && (
                    <motion.div
                        className="relative overflow-hidden rounded-sm"
                        style={{ aspectRatio: "4/3", border: `1px solid ${C.border}` }}
                        initial={{ clipPath: "inset(0 100% 0 0)" }}
                        animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
                        transition={{ duration: 0.9, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <Image src={image} alt="" fill sizes="420px" className="object-cover"
                            style={{ filter: "brightness(0.88) saturate(0.8)" }} />
                    </motion.div>
                )}
            </div>

            {/* Stats with count-up */}
            {study.stats && study.stats.length > 0 && (
                <motion.div
                    className="mt-14 md:mt-20 pt-10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 border-t"
                    style={{ borderColor: C.border }}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {study.stats.map((stat, i) => (
                        <StatTile
                            key={stat.label}
                            stat={stat}
                            isInView={isInView}
                            delay={0.3 + i * 0.08}
                        />
                    ))}
                </motion.div>
            )}
        </section>
    );
}
