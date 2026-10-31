"use client";

import { useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { StudyData } from "@/components/sections/Case-study/case-study.types";
import { DARK, ACCENT } from "@/components/sections/Case-study/case-study.constants";

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

export function HeroSection({ study }: { study: StudyData }) {
  const ref      = useRef<HTMLElement>(null);
  const readTime = useMemo(() => estimateReadTime(study), [study]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY   = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const titleY   = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity  = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-20"
      style={{ minHeight: "100svh", background: DARK.bgDeep }}
    >
      {/* Parallax cover image */}
      {study.image && (
        <motion.div
          className="absolute inset-0"
          style={{ y: imageY }}
        >
          <Image
            src={study.image}
            alt={study.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ filter: "saturate(0.55) brightness(0.32)" }}
          />
        </motion.div>
      )}

      {/* Atmospheric gradients */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(5,5,4,0.2) 0%, transparent 25%, rgba(5,5,4,0.65) 60%, #0c0c0b 100%)"
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to right, rgba(5,5,4,0.5) 0%, transparent 50%, rgba(5,5,4,0.3) 100%)"
      }} />

      {/* Top bar */}
      <motion.div
        className="relative z-10 flex items-center justify-between px-5 sm:px-8 md:px-14 lg:px-20 pt-8"
        style={{ opacity }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href="/case-studies"
          className="group flex items-center gap-2 transition-colors duration-200"
          style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true">←</span>
          All work
        </Link>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <span
            className="text-[0.7rem] tracking-[0.18em] uppercase border rounded-full px-2.5 py-1"
            style={{
              color: "rgba(255,255,255,0.42)",
              borderColor: "rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)"
            }}
          >
            {study.category}
          </span>
          {(study.publishedAt || study.year) && (
            <time
              dateTime={study.publishedAt ?? String(study.year)}
              className="font-mono text-[0.7rem] tracking-[0.22em]"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {study.publishedAt
                ? new Date(study.publishedAt).toLocaleDateString("en-AU", { month: "short", year: "numeric", timeZone: "UTC" })
                : study.year}
            </time>
          )}
          <span
            className="font-mono text-[0.7rem] tracking-[0.18em] flex items-center gap-1"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            <span aria-hidden="true">◷</span> {readTime}
          </span>
        </div>
      </motion.div>

      {/* Bottom-anchored title block */}
      <motion.div
        className="relative z-10 flex flex-col justify-end px-5 sm:px-8 md:px-14 lg:px-20"
        style={{
          minHeight: "calc(100svh - 80px)",
          paddingBottom: "clamp(3.5rem, 9vw, 7rem)",
          y: titleY,
          opacity,
        }}
      >
        {/* Client name */}
        <motion.p
          className="font-mono text-[0.6rem] tracking-[0.3em] uppercase mb-5"
          style={{ color: ACCENT }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {study.client}
        </motion.p>

        {/* Title */}
        <div className="overflow-hidden">
          <motion.h1
            className="font-serif font-normal leading-[0.9] tracking-[-0.04em]"
            style={{
              fontSize: "clamp(3rem, 8.5vw, 8.5rem)",
              color: "rgba(255,255,255,0.94)",
              maxWidth: "15ch",
            }}
            initial={{ y: "105%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            {study.title}
          </motion.h1>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="mt-10 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          <div className="w-10 h-px" style={{ background: ACCENT }} aria-hidden="true" />
          <span className="font-mono text-[0.7rem] tracking-[0.26em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>
            Scroll to read
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
