import { useEffect, useRef } from "react";
import { THRESHOLD, HEADER_H, HEADER_PX, easeInOutQuart, lerp } from "@/components/sections/Hero/hero.constants";

const TARGET_H = 20;

interface FloatingTitleProps {
    metricsReady: boolean;
    startX:       number;
    startY:       number;
    startH:       number;
    currentSlide: number;
}

export function FloatingTitle({ metricsReady, startX, startY, startH }: FloatingTitleProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!metricsReady) return;

        const targetScale = startH > 0 ? TARGET_H / (startH / 2) : 0.18;

        const onScroll = () => {
            if (!ref.current) return;
            const scrollY   = window.scrollY;
            const threshold = window.innerHeight * THRESHOLD;
            const raw       = Math.min(scrollY / threshold, 1);
            const p         = easeInOutQuart(raw);

            const isMobile = window.innerWidth < 768;
            const headerPx = isMobile ? 16 : HEADER_PX;

            const targetX = headerPx;
            const targetY = (HEADER_H - TARGET_H) / 2;

            const x = lerp(startX, targetX, p);
            const y = lerp(startY - scrollY, targetY, p);
            const scale = lerp(1, targetScale, p);

            ref.current.style.transform       = `translate(${x}px, ${y}px) scale(${scale})`;
            ref.current.style.transformOrigin = "top left";
            ref.current.style.opacity         = raw >= 0.92 ? String(lerp(1, 0, (raw - 0.92) / 0.08)) : "1";
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [metricsReady, startX, startY, startH]);

    if (!metricsReady) return null;

    return (
        <div
            ref={ref}
            aria-hidden="true"
            style={{ position: "fixed", top: 0, left: 0, zIndex: 60, pointerEvents: "none", willChange: "transform, opacity" }}
        >
            <h1
                className="font-semibold leading-[0.92] tracking-[-0.02em]"
                style={{ fontSize: "clamp(3.5rem, 8vw, 8rem)", color: "hsl(var(--primary-foreground))", whiteSpace: "nowrap" }}
            >
                {["Julian", "Delgado"].map((word) => (
                    <span key={word} className="block">{word}</span>
                ))}
            </h1>
        </div>
    );
}
