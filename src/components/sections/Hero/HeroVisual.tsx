/**
 * @fileoverview Hero visual component.
 * Displays the video/image section of the hero with animated entrance.
 * Implements WCAG 2.x accessible media patterns.
 */
"use client";
import { motion } from "framer-motion";

/**
 * Hero visual component displaying a promotional video with gradient overlays.
 * Features entrance animation and a caption overlay.
 *
 * @returns The rendered hero visual with video and caption
 */
export default function HeroVisual() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-[680px] lg:ml-auto"
        >
            {/* Grey Background */}
            <div className="absolute inset-0 -z-20 rounded-[2.25rem] bg-gradient-to-b from-[#7f7f7f] via-[#6b6b6b] to-[#9a9a9a] opacity-90" aria-hidden="true" />

            {/* Warm Glow */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 -z-10 h-64 w-[90%] rounded-full bg-[#ccaf98]/60 blur-[70px]" aria-hidden="true" />
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 -z-10 h-64 w-[70%] rounded-full bg-[#ccaf98]/35 blur-[90px]" aria-hidden="true" />

            {/* Content Card */}
            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/30 shadow-2xl aspect-[4/3]">
                {/* Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" aria-hidden="true" />

                {/* Video - decorative background video, not informational content */}
                <video
                    className="h-full w-full object-cover"
                    src="/hero.mp4"
                    poster="/images/hero-poster.jpg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                >
                    {/* Fallback text for browsers that don't support video */}
                    Your browser does not support the video tag.
                </video>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 p-8 text-white">
                    <p className="font-semibold text-xl italic tracking-tight">
                        I&apos;ll help you launch your dream project.
                    </p>
                    <p className="text-sm opacity-80 mt-1">Julian Delgado</p>
                </div>
            </div>
        </motion.div>
    );
};