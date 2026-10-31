"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { StudyData } from "@/components/sections/Case-study/case-study.types";
import { ChapterLabel } from "@/components/sections/Case-study/ChapterLabel";
import { DARK, ACCENT } from "@/components/sections/Case-study/case-study.constants";

const pillVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.25 } },
};

const pillItem = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

interface SolutionSectionProps {
  study: StudyData;
}

export function SolutionSection({ study }: SolutionSectionProps) {
  const ref      = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const headline = study.solutionHeadline ?? null;

  return (
    <section
      ref={ref}
      style={{ background: DARK.bgAlt }}
      className="px-5 sm:px-8 md:px-14 lg:px-20 py-24 md:py-36"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <ChapterLabel index="III" label="The Solution" theme="dark" />
        </motion.div>

        <div className="grid md:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-12 md:gap-20 items-start">
          <div>
            {/* Optional bold headline */}
            {headline && (
              <motion.h2
                className="font-serif italic leading-[1.1] tracking-[-0.035em] mb-8"
                style={{
                  fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                  color: "rgba(255,255,255,0.94)",
                  maxWidth: "24ch",
                }}
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {headline}
              </motion.h2>
            )}

            {/* Body */}
            <motion.p
              className="font-serif italic leading-[1.5] tracking-[-0.02em]"
              style={{
                fontSize: "clamp(1.05rem, 2vw, 1.5rem)",
                color: "rgba(255,255,255,0.62)",
                maxWidth: "46ch",
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: headline ? 0.2 : 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {study.solution}
            </motion.p>
          </div>

          {/* Tech stack as pills */}
          <div>
            <motion.p
              className="font-mono text-[0.7rem] tracking-[0.28em] uppercase mb-6"
              style={{ color: DARK.label }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Stack
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-2"
              variants={pillVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {study.technologies.map(tech => (
                <motion.span
                  key={tech}
                  variants={pillItem}
                  className="font-mono text-[0.7rem] tracking-[0.04em] px-3 py-1.5 rounded-full border"
                  style={{
                    color: DARK.mid,
                    borderColor: DARK.border,
                    background: DARK.ghost,
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* Accent line */}
            <motion.div
              className="mt-10 w-8 h-px"
              style={{ background: ACCENT }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
