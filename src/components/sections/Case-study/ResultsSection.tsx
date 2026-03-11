import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { StudyData } from "@/components/sections/Case-study/case-study.types";
import { ChapterLabel } from "@/components/sections/Case-study/ChapterLabel";
import { C, parseResultMetric } from "@/components/sections/Case-study/case-study.constants";

// ─── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, active: boolean, duration = 1.5): number {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!active || target === 0) return;
        let raf: number;
        const start = performance.now();
        const tick = (now: number) => {
            const t = Math.min((now - start) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - t, 4); // ease-out quart
            setCount(Math.round(eased * target));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [active, target, duration]);
    return count;
}

// ─── Single result card ────────────────────────────────────────────────────────
function ResultCard({ result, isInView }: { result: string; isInView: boolean }) {
    const parsed   = parseResultMetric(result);
    const rawNum   = parsed?.metric.replace(/[+\-%×x,]/g, "") ?? "0";
    const target   = parseFloat(rawNum) || 0;
    const prefix   = parsed?.metric.match(/^[+\-]/)?.[0] ?? "";
    const suffix   = parsed?.metric.replace(/^[+\-]/, "").replace(/[\d,.]+/, "").trim() ?? "";
    const counted  = useCountUp(target, isInView, 1.5);

    return (
        <div className="flex flex-col gap-4 p-8 md:p-12" style={{ background: C.bg }}>
            {parsed ? (
                <>
                    <p
                        className="font-serif font-normal leading-none tracking-[-0.045em]"
                        style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", color: C.accent }}
                        aria-label={parsed.metric}
                    >
                        {prefix}{counted.toLocaleString()}{suffix}
                    </p>
                    <p className="text-[0.88rem] leading-[1.75]"
                        style={{ color: "rgba(255,255,255,0.52)", maxWidth: "36ch" }}>
                        {parsed.rest}
                    </p>
                </>
            ) : (
                <>
                    <span className="text-[0.9rem]" style={{ color: C.accent }} aria-hidden="true">✦</span>
                    <p className="font-serif italic leading-[1.3] tracking-[-0.02em]"
                        style={{ fontSize: "clamp(1.2rem, 2.4vw, 1.75rem)", color: "rgba(255,255,255,0.8)", maxWidth: "30ch" }}>
                        {result}
                    </p>
                </>
            )}
        </div>
    );
}

// ─── Section ───────────────────────────────────────────────────────────────────
const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const cardVariants = {
    hidden:  { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

export function ResultsSection({ study }: { study: StudyData }) {
    const ref      = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section
            ref={ref}
            className="mt-24 md:mt-36 px-5 sm:px-8 md:px-14 lg:px-20 max-w-7xl mx-auto border-t"
            style={{ borderColor: C.border, paddingTop: "4rem" }}
        >
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
            >
                <ChapterLabel index="IV" label="The Results" />
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-px"
                style={{ background: C.border }}
                variants={gridVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {study.results.map((result, i) => (
                    <motion.div key={i} variants={cardVariants}>
                        <ResultCard result={result} isInView={isInView} />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
