import {useInView} from "@/hooks/use-in-view";
import * as React from "react";

export default function FeatureRow({
                        label,
                        delay,
                        light,
                    }: {
    label: string;
    delay: number;
    light: boolean;
}) {
    const [ref, visible] = useInView<HTMLDivElement>(0.1);

    return (
        <div
            ref={ref}
            className={`flex items-center justify-between gap-4 py-[0.65rem] ${
                light ? "border-b border-white/[0.07]" : "border-b border-black/[0.07]"
            }`}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateX(-10px)",
                transition: `opacity 360ms ease ${delay}ms, transform 360ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
            }}
        >
            <span
                className="font-mono text-[0.68rem] leading-[1.5]"
                style={{ color: light ? "rgba(255,255,255,0.56)" : "rgba(10,10,10,0.52)" }}
            >
                {label}
            </span>

            <span
                aria-hidden
                className="shrink-0 text-[0.46rem]"
                style={{ color: light ? "rgba(255,255,255,0.22)" : "hsl(var(--hero-accent))" }}
            >
                ✦
            </span>
        </div>
    );
}