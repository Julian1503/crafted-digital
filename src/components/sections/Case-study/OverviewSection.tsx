"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { StudyData } from "@/components/sections/Case-study/case-study.types";
import { LIGHT, ACCENT } from "@/components/sections/Case-study/case-study.constants";

interface OverviewSectionProps {
  study: StudyData;
}

export function OverviewSection({ study }: OverviewSectionProps) {
  const ref      = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const metaItems = [
    { label: "Client",    value: study.client },
    { label: "Category",  value: study.category },
    { label: "Year",      value: study.year ? String(study.year) : null },
    { label: "Built with", value: study.technologies.length ? study.technologies.slice(0, 4).join(", ") : null },
  ].filter(m => m.value);

  return (
    <section
      ref={ref}
      style={{ background: LIGHT.bg }}
      className="px-5 sm:px-8 md:px-14 lg:px-20"
    >
      {/* Accent line at top — carries the dark-to-light transition */}
      <div className="w-full h-px" style={{ background: LIGHT.border }} />

      <div className="max-w-7xl mx-auto py-20 md:py-28 grid md:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-12 md:gap-20 items-start">

        {/* Description */}
        <motion.p
          className="font-serif italic leading-[1.5] tracking-[-0.02em]"
          style={{
            fontSize: "clamp(1.3rem, 2.8vw, 2.1rem)",
            color: LIGHT.mid,
            maxWidth: "34ch",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {study.description}
        </motion.p>

        {/* Meta grid */}
        <motion.dl
          className="pt-2 space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {metaItems.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 pt-4 border-t"
              style={{ borderColor: LIGHT.border }}
            >
              <dt
                className="font-mono text-[0.7rem] tracking-[0.26em] uppercase"
                style={{ color: LIGHT.dim }}
              >
                {item.label}
              </dt>
              <dd
                className="text-[0.88rem] font-medium tracking-[-0.01em]"
                style={{ color: LIGHT.text }}
              >
                {item.value}
              </dd>
            </div>
          ))}

          {/* Accent dot */}
          <div className="pt-4">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: ACCENT }}
              aria-hidden="true"
            />
          </div>
        </motion.dl>
      </div>
    </section>
  );
}
