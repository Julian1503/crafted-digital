"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { StudyData, ApproachStep } from "@/components/sections/Case-study/case-study.types";
import { ChapterLabel } from "@/components/sections/Case-study/ChapterLabel";
import { LIGHT, ACCENT } from "@/components/sections/Case-study/case-study.constants";

const listVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

interface StepRowProps {
  step:  ApproachStep;
  index: number;
  total: number;
}

function StepRow({ step, index, total }: StepRowProps) {
  const isLast = index === total - 1;
  return (
    <motion.li
      variants={itemVariants}
      className="grid md:grid-cols-[80px_1fr] gap-6 md:gap-10 py-9 border-b"
      style={{ borderColor: isLast ? "transparent" : LIGHT.border }}
    >
      {/* Number */}
      <div className="flex md:flex-col items-start md:items-end gap-4 md:gap-0 md:pt-1">
        <span
          className="font-serif italic select-none leading-none"
          aria-hidden="true"
          style={{
            fontSize: "clamp(2.4rem, 5vw, 3.5rem)",
            color: "rgba(15,14,14,0.08)",
            letterSpacing: "-0.04em",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Content */}
      <div>
        {step.title && step.title !== `Step ${String(index + 1).padStart(2, "0")}` && (
          <p
            className="text-[0.7rem] tracking-[0.2em] uppercase font-medium mb-3"
            style={{ color: ACCENT }}
          >
            {step.title}
          </p>
        )}
        <p
          className="text-[0.92rem] leading-[1.9]"
          style={{ color: LIGHT.mid, maxWidth: "60ch" }}
        >
          {step.body}
        </p>
      </div>
    </motion.li>
  );
}

interface ApproachSectionProps {
  study: StudyData;
}

export function ApproachSection({ study }: ApproachSectionProps) {
  const ref      = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Use titled steps when available (V2), fall back to plain strings (V1)
  const steps: ApproachStep[] = study.approachSteps?.length
    ? study.approachSteps
    : study.approach.map((body, i) => ({ title: `Step ${String(i + 1).padStart(2, "0")}`, body }));

  return (
    <section
      ref={ref}
      style={{ background: LIGHT.bg }}
      className="px-5 sm:px-8 md:px-14 lg:px-20 py-24 md:py-36"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <ChapterLabel index="II" label="The Approach" theme="light" />
        </motion.div>

        <div className="grid md:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-16 items-start">
          <motion.ol
            variants={listVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {steps.map((step, i) => (
              <StepRow key={i} step={step} index={i} total={steps.length} />
            ))}
          </motion.ol>

          {/* Decorative right column */}
          <motion.div
            className="hidden md:block pt-2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <p
              className="font-mono text-[0.7rem] tracking-[0.24em] uppercase mb-8"
              style={{ color: LIGHT.dim }}
            >
              Process
            </p>
            <div className="flex flex-col gap-3">
              {steps.map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: i === 0 ? ACCENT : LIGHT.ghost }}
                  />
                  <div
                    className="flex-1 h-px"
                    style={{ background: LIGHT.border }}
                  />
                  <span
                    className="font-mono text-[0.7rem] tracking-wider"
                    style={{ color: LIGHT.dim }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
