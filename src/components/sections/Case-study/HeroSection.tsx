"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { StudyData } from "@/components/sections/Case-study/case-study.types";
import { DARK } from "@/components/sections/Case-study/case-study.constants";

const EASE = [0.16, 1, 0.3, 1] as const;

function estimateReadTime(study: StudyData): string {
  const words = [
    study.description,
    study.challenge,
    study.solution,
    ...study.approach,
    ...study.results,
    study.testimonial?.quote ?? "",
  ].join(" ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/**
 * Typographic hero: client, title and meta on a dark field, with the main
 * product screenshot shown below as a framed figure instead of a darkened
 * background behind the headline.
 */
export function HeroSection({ study, figure }: { study: StudyData; figure?: { src: string; alt: string; photo?: boolean } }) {
  const readTime = useMemo(() => estimateReadTime(study), [study]);
  const date = study.publishedAt
    ? new Date(study.publishedAt).toLocaleDateString("en-AU", { month: "short", year: "numeric", timeZone: "UTC" })
    : study.year ? String(study.year) : null;

  return (
    <section className="relative overflow-hidden pt-28 md:pt-32" style={{ background: DARK.bgDeep }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14 lg:px-20">
        {/* Top bar */}
        <motion.div
          className="flex flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Link
            href="/case-studies"
            className="group inline-flex items-center gap-2 py-2 text-[0.7rem] tracking-[0.16em] uppercase transition-colors duration-200 hover:text-white focus-visible:text-white"
            style={{ color: "rgba(255,255,255,0.62)" }}
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true">←</span>
            All work
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className="text-[0.7rem] tracking-[0.18em] uppercase border rounded-full px-2.5 py-1"
              style={{ color: "rgba(255,255,255,0.72)", borderColor: "rgba(255,255,255,0.16)" }}
            >
              {study.category}
            </span>
            {date && (
              <time
                dateTime={study.publishedAt ?? String(study.year)}
                className="font-mono text-[0.7rem] tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.62)" }}
              >
                {date}
              </time>
            )}
            <span className="font-mono text-[0.7rem] tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.62)" }}>
              {readTime}
            </span>
          </div>
        </motion.div>

        {/* Client + title */}
        <div className="pt-14 md:pt-20 pb-12 md:pb-16">
          <motion.p
            className="text-[0.75rem] tracking-[0.2em] uppercase mb-5"
            style={{ color: "hsl(var(--hero-accent-light))" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            {study.client}
          </motion.p>
          <motion.h1
            className="font-serif font-normal leading-[0.98] tracking-[-0.035em] text-balance"
            style={{ fontSize: "clamp(2.6rem, 6.4vw, 6rem)", color: "rgba(255,255,255,0.95)", maxWidth: "16ch" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.05, ease: EASE }}
          >
            {study.title}
          </motion.h1>
        </div>
      </div>

      {/* Figure: the product, framed and readable */}
      {figure && (
        <motion.figure
          className="mx-auto max-w-6xl px-5 sm:px-8 md:px-14 pb-16 md:pb-24"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
        >
          <div
            className="relative w-full overflow-hidden rounded-xl border"
            style={{ aspectRatio: "16 / 10", borderColor: "rgba(255,255,255,0.1)", background: "#141414", boxShadow: "0 40px 80px -40px rgba(0,0,0,0.8)" }}
          >
            {/* Screenshots are shown whole; a photo fills the frame. */}
            <Image src={figure.src} alt={figure.alt} fill priority sizes="(min-width: 1152px) 1100px, 100vw" className={figure.photo ? "object-cover" : "object-contain"} />
          </div>
        </motion.figure>
      )}
    </section>
  );
}
