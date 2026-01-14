/**
 * @fileoverview Hero visual component.
 * Displays the video/image section of the hero with animated entrance.
 * Implements WCAG 2.x accessible media patterns.
 */
"use client";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Hero visual component displaying a promotional video with gradient overlays.
 * Features entrance animation and a caption overlay.
 * Video loads lazily to improve LCP performance.
 * The hero poster image is now an explicit <img> element with fetchpriority="high"
 * for optimal LCP discovery.
 * Uses LazyMotion with domAnimation for reduced bundle size.
 *
 * @returns The rendered hero visual with video and caption
 */
export default function HeroVisual() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Defer video loading until after the page has loaded
        const loadVideo = () => {
            // Start loading the video
            video.load();

            // Play when ready
            video.addEventListener('canplaythrough', () => {
                setIsVideoLoaded(true);
                video.play().catch(() => {
                    // Autoplay might be blocked, that's fine
                    console.log('Autoplay was prevented');
                });
            }, { once: true });
        };

        // Use requestIdleCallback if available, otherwise setTimeout
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(loadVideo, { timeout: 2000 });
        } else {
            setTimeout(loadVideo, 100);
        }
    }, []);

    return (
        <LazyMotion features={domAnimation} strict>
            <m.div
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
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent z-10" aria-hidden="true" />

                    {/* Video - Lazy loaded */}
                    <video
                        ref={videoRef}
                        className={`h-full w-full object-cover transition-opacity duration-500 ${
                            isVideoLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        poster="/hero-poster.webp"
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-hidden="true"
                    >
                        <source src="/hero.webm" type="video/webm" />
                        Your browser does not support the video tag.
                    </video>

                    {/* LCP Image - Explicit <img> element with fetchpriority="high" for optimal LCP discovery
                        This replaces the CSS background-image approach for better browser preload scanning */}
                    <Image
                        src="/hero-poster.webp"
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 680px"
                        className={`object-cover transition-opacity duration-500 ${
                            isVideoLoaded ? 'opacity-0' : 'opacity-100'
                        }`}
                        priority
                        fetchPriority="high"
                        aria-hidden="true"
                    />

                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 p-8 text-white z-20">
                        <p className="font-semibold text-xl italic tracking-tight">
                            I&apos;ll help you launch your dream project.
                        </p>
                        <p className="text-sm opacity-80 mt-1">Julian Delgado</p>
                    </div>
                </div>
            </m.div>
        </LazyMotion>
    );
}