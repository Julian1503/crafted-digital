"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface ImageBreakProps {
  src: string;
  alt?: string;
  /** Height as a CSS value. Default "60vh" */
  height?: string;
  /** 0–1 brightness. Default 0.82 */
  brightness?: number;
  /** 0–1 saturation. Default 0.75 */
  saturation?: number;
}

export function ImageBreak({
  src,
  alt = "",
  height = "60vh",
  brightness = 0.82,
  saturation = 0.75,
}: ImageBreakProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Image moves slower than scroll → creates parallax
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden w-full"
      style={{ height }}
      aria-hidden={!alt}
    >
      <motion.div className="absolute inset-[-10%]" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          style={{
            filter: `brightness(${brightness}) saturate(${saturation})`,
          }}
        />
      </motion.div>
    </div>
  );
}
