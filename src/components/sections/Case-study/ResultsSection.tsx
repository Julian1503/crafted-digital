"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform, type Variants } from "framer-motion";
import { StudyData, ResultItem } from "@/components/sections/Case-study/case-study.types";
import { ChapterLabel } from "@/components/sections/Case-study/ChapterLabel";
import { DARK, ACCENT, parseResultMetric } from "@/components/sections/Case-study/case-study.constants";

// ─── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, active: boolean, duration = 1.6): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t     = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setCount(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return count;
}

// ─── Single result row ────────────────────────────────────────────────────────
interface ResultRowProps {
  item:      ResultItem;
  index:     number;
  total:     number;
  isInView:  boolean;
}

function ResultRow({ item, index, total, isInView }: ResultRowProps) {
  const isLast    = index === total - 1;
  const isEven    = index % 2 === 0;

  // Metric fields
  const isMetric  = item.type === "metric";
  const rawNum    = isMetric ? (item as ResultItem & { type: "metric" }).metric.replace(/[^0-9.]/g, "") : "0";
  const target    = parseFloat(rawNum) || 0;
  const metricStr = isMetric ? (item as ResultItem & { type: "metric" }).metric : "";
  const prefix    = metricStr.match(/^[+\-]?/)?.[0] ?? "";
  const suffix    = metricStr.replace(/^[+\-]?[\d,.]+/, "").trim();
  const label     = isMetric ? (item as ResultItem & { type: "metric" }).label : "";
  const bodyText  = !isMetric ? (item as ResultItem & { type: "text" }).body : "";
  const counted   = useCountUp(target, isInView && isMetric);

  const delay = 0.06 + index * 0.07;

  return (
      <motion.div
          className="relative grid md:grid-cols-[64px_1fr_auto] gap-6 md:gap-10 items-start py-10 md:py-14 border-b group"
          style={{ borderColor: isLast ? "transparent" : DARK.border }}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      >

        {/* ── Index number */}
        <div className="flex items-start pt-1 md:pt-0.5">
        <span
            className="font-mono text-[0.7rem] tracking-[0.26em]"
            style={{ color: DARK.label }}
            aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        </div>

        {/* ── Main content */}
        <div className="relative">
          {isMetric ? (
              // Metric treatment: giant number + supporting label
              <div className="flex flex-col gap-3">
                <p
                    className="font-serif font-normal leading-none tracking-[-0.05em]"
                    style={{ fontSize: "clamp(4rem, 9vw, 7.5rem)", color: ACCENT, lineHeight: 0.9 }}
                    aria-label={metricStr}
                >
                  {prefix}{target > 0 ? counted.toLocaleString() : metricStr}{suffix}
                </p>
                <p
                    className="text-[0.9rem] leading-[1.7]"
                    style={{ color: DARK.mid, maxWidth: "46ch" }}
                >
                  {label}
                </p>
              </div>
          ) : (
              // Text treatment: serif italic, generous size
              <p
                  className="font-serif italic leading-[1.25] tracking-[-0.025em]"
                  style={{
                    fontSize:  "clamp(1.3rem, 2.8vw, 2.2rem)",
                    color:     isEven ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.72)",
                    maxWidth:  "42ch",
                  }}
              >
                {bodyText}
              </p>
          )}
        </div>

        {/* ── Accent dot — right side, desktop only */}
        <div className="hidden md:flex items-center justify-end pt-2">
          <motion.span
              className="block w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: ACCENT }}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: delay + 0.3, ease: "backOut" }}
              aria-hidden="true"
          />
        </div>

        {/* ── Reveal line that grows left-to-right on scroll */}
        <motion.div
            className="absolute bottom-0 left-0 h-px"
            style={{ background: ACCENT, transformOrigin: "left" }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: delay + 0.15, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden="true"
        />
      </motion.div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────
export function ResultsSection({ study }: { study: StudyData }) {
  const ref      = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Parallax on the ghost "Results" watermark
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const watermarkY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  // Build rich items — prefer V2 resultsRich, fall back to parsing plain strings
  const items: ResultItem[] = study.resultsRich?.length
      ? study.resultsRich
      : study.results.map(text => {
        const m = parseResultMetric(text);
        return m
            ? { type: "metric" as const, metric: m.metric, label: m.rest }
            : { type: "text"   as const, body: text };
      });

  return (
      <section
          ref={ref}
          style={{ background: DARK.bg }}
          className="relative overflow-hidden px-5 sm:px-8 md:px-14 lg:px-20 py-24 md:py-36"
      >
        {/* Ghost watermark */}
        <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden md:block"
            style={{ y: watermarkY }}
            aria-hidden="true"
        >
        <span
            className="font-serif italic leading-none"
            style={{
              fontSize:       "clamp(10rem, 22vw, 20rem)",
              color:          "rgba(255,255,255,0.025)",
              letterSpacing:  "-0.05em",
              whiteSpace:     "nowrap",
              marginRight:    "-0.1em",
            }}
        >
          Results
        </span>
        </motion.div>

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Header row */}
          <div className="flex items-end justify-between mb-4 md:mb-8">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
            >
              <ChapterLabel index="IV" label="The Results" theme="dark" />
            </motion.div>

            {/* Count pill */}
            <motion.div
                className="hidden sm:flex items-center gap-2 mb-10 md:mb-14"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
            <span
                className="font-mono text-[0.7rem] tracking-[0.22em] uppercase"
                style={{ color: DARK.dim }}
            >
              {items.length} outcomes
            </span>
            </motion.div>
          </div>

          {/* Result rows */}
          <div>
            {items.map((item, i) => (
                <ResultRow
                    key={i}
                    item={item}
                    index={i}
                    total={items.length}
                    isInView={isInView}
                />
            ))}
          </div>

        </div>
      </section>
  );
}