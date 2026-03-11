import Image from "next/image";
import {Vec2} from "@/hooks/use-spring-cursor";

interface FloatingPreviewProps {
    src?:     string;
    title:    string;
    visible:  boolean;
    pos:      Vec2;
}

export function FloatingPreview({ src, title, visible, pos }: FloatingPreviewProps) {
    return (
        <div
            className="fixed pointer-events-none z-50 hidden lg:block"
            style={{
                left:       pos.x + 28,
                top:        pos.y - 80,
                opacity:    visible && src ? 1 : 0,
                transform:  visible && src ? "scale(1)" : "scale(0.88)",
                transition: "opacity 300ms ease, transform 300ms cubic-bezier(0.16,1,0.3,1)",
                willChange: "transform, opacity, left, top",
            }}
            aria-hidden="true"
        >
            <div className="relative overflow-hidden rounded-xl shadow-2xl" style={{ width: "260px", height: "180px" }}>
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
