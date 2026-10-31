"use client";

import Link from "next/link";
import Image from "next/image";
import { NavStudy } from "@/components/sections/Case-study/case-study.types";
import { DARK, ACCENT } from "@/components/sections/Case-study/case-study.constants";

interface NavSliceProps {
  study:     NavStudy;
  direction: "prev" | "next";
}

export function NavSlice({ study, direction }: NavSliceProps) {
  const href   = `/case-studies/${study.slug}`;
  const isPrev = direction === "prev";
  const teaser = study.description;

  return (
    <Link
      href={href}
      className="group relative flex-1 overflow-hidden min-h-[36vh] md:min-h-[44vh] flex flex-col justify-end p-8 md:p-12"
      style={{ background: DARK.bgAlt }}
    >
      {/* Background image — scale on hover */}
      {study.image && (
        <div
          className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        >
          <Image
            src={study.image}
            alt=""
            fill
            sizes="50vw"
            className="object-cover"
            style={{ filter: "saturate(0.12) brightness(0.22)", transition: "filter 700ms ease" }}
          />
          {/* Lift brightness on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: "rgba(255,255,255,0.04)" }}
          />
        </div>
      )}

      {/* Directional gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isPrev
            ? "linear-gradient(to right, rgba(5,5,4,0.9) 0%, rgba(5,5,4,0.3) 100%)"
            : "linear-gradient(to left,  rgba(5,5,4,0.9) 0%, rgba(5,5,4,0.3) 100%)",
        }}
      />

      {/* Accent side bar — grows from top on hover */}
      <div
        className={`absolute ${isPrev ? "left-0" : "right-0"} top-0 bottom-0 w-[2px]
          transition-transform duration-500 origin-top scale-y-0 group-hover:scale-y-100`}
        style={{ background: ACCENT }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className={`relative z-10 ${isPrev ? "" : "text-right"}`}>
        <span
          className="block text-[0.7rem] tracking-[0.3em] uppercase mb-3 transition-colors duration-300"
          style={{ color: DARK.dim }}
        >
          {isPrev ? "← Previous" : "Next →"}
        </span>

        {study.category && (
          <span
            className="block text-[0.7rem] tracking-[0.2em] uppercase mb-2"
            style={{ color: ACCENT }}
          >
            {study.category}
          </span>
        )}

        <h3
          className="font-serif font-normal leading-[1.05] tracking-[-0.025em] transition-colors duration-300"
          style={{ fontSize: "clamp(1.3rem, 2.5vw, 2.2rem)", color: "rgba(255,255,255,0.82)" }}
        >
          {study.title}
        </h3>

        {/* Teaser — slides in on hover */}
        {teaser && (
          <p
            className={`
              mt-3 text-[0.75rem] leading-[1.7]
              overflow-hidden max-h-0 opacity-0
              group-hover:max-h-[5rem] group-hover:opacity-100 group-focus-visible:max-h-[5rem] group-focus-visible:opacity-100
              transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${isPrev ? "" : "ml-auto"}
            `}
            style={{ color: "rgba(255,255,255,0.35)", maxWidth: "30ch" }}
          >
            {teaser.length > 120 ? teaser.slice(0, 117) + "…" : teaser}
          </p>
        )}

        {/* Micro CTA */}
        <span
          className={`
            inline-flex items-center gap-1.5 mt-4
            text-[0.7rem] tracking-[0.18em] uppercase
            opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100
            translate-y-1 group-hover:translate-y-0 group-focus-visible:translate-y-0
            transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isPrev ? "" : "ml-auto"}
          `}
          style={{ color: ACCENT }}
        >
          Read case study
          <span aria-hidden="true">{isPrev ? "←" : "→"}</span>
        </span>
      </div>
    </Link>
  );
}
