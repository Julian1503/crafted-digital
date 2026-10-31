const BG     = "hsl(var(--background))";
const BORDER = "rgba(10,10,10,0.08)";

import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/hooks/use-media-query";

interface MarqueeProps { items: string[]; }

export function Marquee({ items }: MarqueeProps) {
    const reduced = useMediaQuery(REDUCED_MOTION_QUERY);

    // Reduced motion: a plain wrapped list, nothing moves.
    if (reduced) {
        return (
            <ul className="flex flex-wrap gap-x-8 gap-y-3 py-5 list-none m-0 p-0" style={{ borderTop: `1px solid ${BORDER}` }} aria-label="Add-ons">
                {items.map((item) => (
                    <li key={item} className="text-[0.72rem] tracking-[0.18em] uppercase font-medium" style={{ color: "rgba(10,10,10,0.65)" }}>{item}</li>
                ))}
            </ul>
        );
    }

    return (
        <div className="group relative overflow-hidden py-5" style={{ borderTop: `1px solid ${BORDER}` }}>
            <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"  style={{ background: `linear-gradient(to right, ${BG}, transparent)` }} />
            <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none" style={{ background: `linear-gradient(to left, ${BG}, transparent)` }} />
            {/* Pauses on hover and keyboard focus (WCAG 2.2.2) */}
            <div className="flex gap-8 w-max marquee-track" tabIndex={0} aria-label="Add-ons, scrolling list. Focus to pause.">
                <ul className="flex gap-8 list-none m-0 p-0">
                    {items.map((item) => (
                        <li key={item} className="flex items-center gap-8 whitespace-nowrap">
                            <span className="text-[0.72rem] tracking-[0.18em] uppercase font-medium" style={{ color: "rgba(10,10,10,0.65)" }}>{item}</span>
                            <span aria-hidden="true" className="inline-block w-1 h-1 rounded-full" style={{ background: "rgba(10,10,10,0.15)" }} />
                        </li>
                    ))}
                </ul>
                <ul className="flex gap-8 list-none m-0 p-0" aria-hidden="true">
                    {items.map((item) => (
                        <li key={item} className="flex items-center gap-8 whitespace-nowrap">
                            <span className="text-[0.72rem] tracking-[0.18em] uppercase font-medium" style={{ color: "rgba(10,10,10,0.65)" }}>{item}</span>
                            <span className="inline-block w-1 h-1 rounded-full" style={{ background: "rgba(10,10,10,0.15)" }} />
                        </li>
                    ))}
                </ul>
            </div>
            <style>{`
                @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
                .marquee-track { animation: marquee 30s linear infinite; }
                .group:hover .marquee-track, .marquee-track:focus-visible { animation-play-state: paused; }
            `}</style>
        </div>
    );
}
