import { Slide } from "@/components/sections/Hero/hero.constants";

interface MobileDotsProps {
    slides:    Slide[];
    current:   number;
    progress:  number;
    onDotTap:  (i: number) => void;
}

export function MobileDots({ slides, current, progress, onDotTap }: MobileDotsProps) {
    return (
        <div className="flex items-center gap-2">
            {slides.map((_, i) => (
                <button
                    key={i}
                    onClick={() => onDotTap(i)}
                    aria-label={`Slide ${i + 1}`}
                    className="relative h-[2px] rounded-full overflow-hidden"
                    style={{
                        width:      i === current ? "2rem" : "0.75rem",
                        background: "hsl(var(--primary-foreground) / 0.18)",
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
                </button>
            ))}
        </div>
    );
}
