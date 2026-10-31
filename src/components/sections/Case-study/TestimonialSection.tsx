"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Testimonial } from "@/components/sections/Case-study/case-study.types";
import { LIGHT, ACCENT } from "@/components/sections/Case-study/case-study.constants";

export function TestimonialSection({ testimonial }: { testimonial: Testimonial }) {
  const ref      = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const initials = testimonial.author
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section
      ref={ref}
      style={{ background: LIGHT.bgAlt }}
      className="px-5 sm:px-8 md:px-14 lg:px-20 py-28 md:py-44 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">

        {/* Huge opening quote mark */}
        <motion.div
          className="font-serif leading-none select-none mb-0"
          aria-hidden="true"
          style={{
            fontSize:    "clamp(6rem, 18vw, 16rem)",
            color:       ACCENT,
            lineHeight:  0.75,
            marginLeft:  "-0.05em",
          }}
          initial={{ opacity: 0, y: "1.5rem" }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          &ldquo;
        </motion.div>

        <blockquote>
          <motion.p
            className="font-serif italic leading-[1.15] tracking-[-0.03em]"
            style={{
              fontSize: "clamp(1.6rem, 3.8vw, 3.2rem)",
              color:    LIGHT.text,
              maxWidth: "26ch",
            }}
            initial={{ opacity: 0, y: "2rem" }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.95, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {testimonial.quote}
          </motion.p>

          <motion.footer
            className="mt-10 md:mt-14 flex items-center gap-4"
            initial={{ opacity: 0, y: "1rem" }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {testimonial.avatar ? (
              <Image
                src={testimonial.avatar}
                alt={testimonial.author}
                width={44}
                height={44}
                className="rounded-full object-cover shrink-0"
              />
            ) : (
              <span
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-semibold tracking-wider"
                style={{
                  background: "rgba(15,14,14,0.08)",
                  color:      LIGHT.mid,
                  border:     `1px solid ${LIGHT.border}`,
                }}
              >
                {initials}
              </span>
            )}
            <div>
              <p
                className="text-[0.85rem] font-medium tracking-[-0.01em]"
                style={{ color: LIGHT.text }}
              >
                {testimonial.author}
              </p>
              <p
                className="text-[0.7rem] mt-0.5"
                style={{ color: LIGHT.dim }}
              >
                {testimonial.role}
              </p>
            </div>
          </motion.footer>
        </blockquote>
      </div>
    </section>
  );
}
