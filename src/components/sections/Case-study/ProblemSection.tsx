"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { StudyData } from "@/components/sections/Case-study/case-study.types";
import { ChapterLabel } from "@/components/sections/Case-study/ChapterLabel";
import { DARK, ACCENT } from "@/components/sections/Case-study/case-study.constants";
import { splitChallenge } from "@/components/sections/Case-study/case-study.constants";

interface ProblemSectionProps {
  study: StudyData;
}

export function ProblemSection({ study }: ProblemSectionProps) {
  const ref      = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // V2: use problemHeadline; V1 fallback: split first sentence
  const [fallbackHeadline, fallbackRest] = splitChallenge(study.challenge);
  const headline = study.problemHeadline ?? fallbackHeadline;
  const detail   = study.problemHeadline
    ? study.challenge            // full text is the detail in V2
    : fallbackRest || "";        // V1: rest after first sentence

  return (
    <section
      ref={ref}
      style={{ background: DARK.bg }}
      className="px-5 sm:px-8 md:px-14 lg:px-20 py-24 md:py-36"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <ChapterLabel index="I" label="The Problem" theme="dark" />
        </motion.div>

        <div className="grid md:grid-cols-[1fr_400px] xl:grid-cols-[1fr_480px] gap-12 md:gap-20 items-start">

          {/* Headline */}
          <motion.h2
            className="font-serif italic leading-[1.1] tracking-[-0.035em]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 4rem)",
              color: "rgba(255,255,255,0.93)",
              maxWidth: "22ch",
            }}
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {headline}
          </motion.h2>

          {/* Detail text in right column */}
          {detail && (
            <motion.div
              className="md:pt-2"
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="w-6 h-px mb-7"
                style={{ background: ACCENT }}
                aria-hidden="true"
              />
              <p
                className="text-[0.9rem] leading-[1.95]"
                style={{ color: DARK.dim, maxWidth: "52ch" }}
              >
                {detail}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
