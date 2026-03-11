"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { accent, border, dim, E } from "./about-constants";

export function ChapterLabel({ n, label }: { n: string; label: string }) {
    return (
        <div className="mb-10 flex items-center gap-3">
            <span
                className="rounded-[4px] border px-[0.3rem] py-[0.65rem] font-mono text-[0.62rem] tracking-[0.14em]"
                style={{ color: accent, borderColor: border }}
            >
                {n}
            </span>
            <span
                className="font-mono text-[0.56rem] uppercase tracking-[0.26em]"
                style={{ color: dim }}
            >
                {label}
            </span>
            <span className="h-px flex-1" style={{ background: border }} />
            <span className="font-mono text-[0.58rem] text-white/[0.10]">_</span>
        </div>
    );
}

export function FadeUp({
    children,
    delay = 0,
    className,
    style,
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    style?: React.CSSProperties;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            className={className}
            style={style}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay, ease: E }}
        >
            {children}
        </motion.div>
    );
}

