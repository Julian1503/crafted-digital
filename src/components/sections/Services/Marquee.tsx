const BG     = "hsl(var(--background))";
const BORDER = "rgba(10,10,10,0.08)";

interface MarqueeProps { items: string[]; }

export function Marquee({ items }: MarqueeProps) {
    const doubled = [...items, ...items];
    return (
        <div className="relative overflow-hidden py-5" style={{ borderTop: `1px solid ${BORDER}` }}>
            <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"  style={{ background: `linear-gradient(to right, ${BG}, transparent)` }} />
            <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none" style={{ background: `linear-gradient(to left, ${BG}, transparent)` }} />
            <div className="flex gap-8 w-max" style={{ animation: "marquee 30s linear infinite" }}>
                {doubled.map((item, i) => (
                    <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                        <span className="text-[0.65rem] tracking-[0.18em] uppercase font-medium" style={{ color: "rgba(10,10,10,0.38)" }}>{item}</span>
                        <span aria-hidden="true" className="inline-block w-1 h-1 rounded-full" style={{ background: "rgba(10,10,10,0.15)" }} />
                    </span>
                ))}
            </div>
            <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
        </div>
    );
}
