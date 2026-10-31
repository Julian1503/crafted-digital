import Image from "next/image";
import {Vec2} from "@/hooks/use-spring-cursor";

interface FloatingPreviewProps {
    src?:     string;
    title:    string;
    visible:  boolean;
    pos:      Vec2;
}

/**
 * Cursor-following thumbnail for the Work list (desktop only). The outer
 * element follows the cursor with a plain translate so it never lags; the
 * inner one eases scale and opacity. Both stay on the compositor.
 */
export function FloatingPreview({ src, title, visible, pos }: FloatingPreviewProps) {
    const shown = visible && !!src;
    return (
        <div
            className="fixed left-0 top-0 pointer-events-none z-50 hidden lg:block"
            style={{ transform: `translate3d(${pos.x + 28}px, ${pos.y - 80}px, 0)` }}
            aria-hidden="true"
        >
            <div
                className="relative overflow-hidden rounded-xl shadow-2xl"
                style={{
                    width:      "260px",
                    height:     "180px",
                    opacity:    shown ? 1 : 0,
                    transform:  shown ? "scale(1)" : "scale(0.88)",
                    transition: "opacity 300ms ease, transform 300ms cubic-bezier(0.16,1,0.3,1)",
                }}
            >
                {src && (
                    <Image src={src} alt={title} fill sizes="260px" className="object-cover" style={{ filter: "saturate(0.88) brightness(0.85)" }} />
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />
                <span className="absolute bottom-3 left-3 font-serif text-[0.75rem] leading-tight tracking-[-0.01em] text-white" style={{ maxWidth: "20ch" }}>
                    {title}
                </span>
            </div>
        </div>
    );
}
