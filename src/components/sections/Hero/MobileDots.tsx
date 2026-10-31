import { Slide } from "@/components/sections/Hero/hero.constants";

interface MobileDotsProps {
    slides:    Slide[];
    current:   number;
    progress:  number;
    onDotTap:  (i: number) => void;
}

export function MobileDots({ slides, current, progress, onDotTap }: MobileDotsProps) {
    return (
        <div className="flex items-center gap-1" role="group" aria-label="Choose slide">
            {slides.map((slide, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => onDotTap(i)}
                    aria-label={`Show slide ${i + 1}: ${slide.tag}`}
                    aria-current={i === current ? "true" : undefined}
                    // 44 px tall tap target; the visible bar stays thin.
                    className="relative flex items-center min-h-[44px] px-1"
                >
                    <span
                        aria-hidden="true"
                        className="relative block h-[3px] rounded-full overflow-hidden"
                        style={{
                            width:      i === current ? "2rem" : "0.75rem",
                            background: "hsl(var(--primary-foreground) / 0.3)",
                            transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
                        }}
                    >
                        <span
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{
                                width:      i === current ? `${progress}%` : "0%",
                                background: "hsl(var(--hero-accent))",
                                transition: "width 0.1s linear",
                            }}
                        />
                    </span>
                </button>
            ))}
        </div>
    );
}
