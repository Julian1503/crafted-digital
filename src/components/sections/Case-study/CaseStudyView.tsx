"use client";

import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { DARK, LIGHT, ACCENT } from "@/components/sections/Case-study/case-study.constants";
import { CaseStudyViewProps } from "@/components/sections/Case-study/case-study.types";

// ─── Sections ─────────────────────────────────────────────────────────────────
import { HeroSection }        from "@/components/sections/Case-study/HeroSection";
import { OverviewSection }    from "@/components/sections/Case-study/OverviewSection";
import { ImageBreak }         from "@/components/sections/Case-study/ImageBreak";
import { ProblemSection }     from "@/components/sections/Case-study/ProblemSection";
import { ApproachSection }    from "@/components/sections/Case-study/ApproachSection";
import { SolutionSection }    from "@/components/sections/Case-study/SolutionSection";
import { ResultsSection }     from "@/components/sections/Case-study/ResultsSection";
import { TestimonialSection } from "@/components/sections/Case-study/TestimonialSection";
import { NavSlice }           from "@/components/sections/Case-study/NavSlice";
import { pickFigures }        from "@/components/sections/Case-study/gallery";

/**
 * Layout rhythm (alternating dark / light):
 *
 *  ①  Hero           – DARK  (full viewport, cover image, parallax)
 *  ②  Overview       – LIGHT (description + meta — first breath of warmth)
 *  ③  Image break    – gallery[0] (full bleed, parallax)
 *  ④  Problem        – DARK  (big headline, detail text)
 *  ⑤  Approach       – LIGHT (titled steps)
 *  ⑥  Image break    – gallery[1] (full bleed, parallax)
 *  ⑦  Solution       – DARK  (headline + body + tech pills)
 *  ⑧  Image break    – gallery[2] (full bleed, parallax)
 *  ⑨  Results        – DARK  (deep — big metric / text cards)
 *  ⑩  Testimonial    – LIGHT (warm, human)
 *  ⑪  Prev / Next    – DARK
 *  ⑫  CTA            – DARK
 */
export function CaseStudyView({ study, prevStudy, nextStudy }: CaseStudyViewProps) {
  // A MotionValue drives the progress bar without re-rendering the view on scroll.
  const { scrollYProgress } = useScroll();

  // Product screenshots live inside the study; the cover photo is for listings.
  const { hero: heroFigure, breaks } = pickFigures(study.title, study.gallery ?? [], study.image);
  const leadFigure = heroFigure ?? (study.image ? { src: study.image, alt: "", photo: true } : undefined);

  const ctaHeading = "Got a workflow like this in your business?";
  const ctaSubcopy = "Tell me what takes your team the most time. In a 30-minute call I will tell you honestly whether software would fix it.";

  return (
    <motion.div
      style={{ background: DARK.bg, color: "#fff" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Reading progress bar — fixed, top of viewport */}
      <motion.div
        className="fixed top-0 left-0 z-50 h-[2px] w-full pointer-events-none"
        style={{ background: ACCENT, scaleX: scrollYProgress, transformOrigin: "left" }}
        aria-hidden="true"
      />

      {/* ① Hero */}
      <HeroSection study={study} figure={leadFigure} />

      {/* ② Overview — LIGHT */}
      <OverviewSection study={study} />

      {/* ③ Image break */}
      {breaks[0] && <ImageBreak src={breaks[0].src} alt={breaks[0].alt} caption={breaks[0].caption} tone="dark" />}

      {/* ④ Problem — DARK */}
      <ProblemSection study={study} />

      {/* ⑤ Approach — LIGHT */}
      <ApproachSection study={study} />

      {/* ⑥ Image break */}
      {breaks[1] && <ImageBreak src={breaks[1].src} alt={breaks[1].alt} caption={breaks[1].caption} tone="dark" />}

      {/* ⑦ Solution — DARK */}
      <SolutionSection study={study} />

      {/* ⑧ Image break (wider aspect for solution screenshots) */}

      {/* ⑨ Results — deep dark */}
      <ResultsSection study={study} />

      {/* ⑩ Testimonial — LIGHT */}
      {study.testimonial && <TestimonialSection testimonial={study.testimonial} />}

      {/* ⑪ Prev / Next nav — DARK */}
      {(prevStudy || nextStudy) && (
        <div
          className="flex flex-col sm:flex-row border-t"
          style={{ borderColor: DARK.border }}
          aria-label="Navigate case studies"
        >
          {prevStudy
            ? <NavSlice study={prevStudy} direction="prev" />
            : <div className="flex-1" style={{ background: DARK.bgAlt }} />}
          <div className="w-px hidden sm:block" style={{ background: DARK.border }} />
          {nextStudy
            ? <NavSlice study={nextStudy} direction="next" />
            : <div className="flex-1" style={{ background: DARK.bgAlt }} />}
        </div>
      )}

      {/* ⑫ Contextual CTA */}
      <section
        className="px-5 sm:px-8 md:px-14 lg:px-20 py-24 md:py-36 border-t"
        style={{ background: DARK.bg, borderColor: DARK.border }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div>
            <p
              className="font-serif font-normal italic leading-[1.05] tracking-[-0.03em] mb-5"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                color:    "rgba(255,255,255,0.88)",
                maxWidth: "20ch",
              }}
            >
              {ctaHeading}
            </p>
            <p
              className="text-[0.82rem] leading-relaxed"
              style={{ color: DARK.dim, maxWidth: "44ch" }}
            >
              {ctaSubcopy}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <Link
              href="/contact"
              className="group flex items-center gap-2.5 rounded-full font-medium transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                background:    ACCENT,
                color:         "#fff",
                padding:       "0.9rem 2rem",
                fontSize:      "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Start your project
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[0.7rem] group-hover:rotate-45 transition-transform duration-300"
                style={{ border: "1.5px solid rgba(255,255,255,0.4)" }}
                aria-hidden="true"
              >↗</span>
            </Link>
            <Link
              href="/#services"
              className="text-[0.7rem] tracking-[0.1em] uppercase transition-colors duration-200 hover:text-white"
              style={{ color: DARK.dim }}
            >
              View services →
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
