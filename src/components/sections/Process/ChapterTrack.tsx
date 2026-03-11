import { motion } from "framer-motion";

interface Step { title: string; }

interface ChapterTrackProps {
    steps:       Step[];
    active:      number;
    rawProgress: number;
    total:       number;
}

export function ChapterTrack({ steps, active, rawProgress, total }: ChapterTrackProps) {
    return (
        <div className="absolute top-0 left-0 right-0 z-30 flex">
            {steps.map((s, i) => {
                const segStart = i / total;
                const segEnd   = (i + 1) / total;
                const fill = Math.max(0, Math.min(1, (rawProgress - segStart) / (segEnd - segStart)));

                return (
                    <div key={s.title} className="flex-1 relative h-[2px]" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <motion.div
                            className="absolute inset-y-0 left-0"
                            style={{
                                width:      `${fill * 100}%`,
                                background: i < active ? "rgba(255,255,255,0.35)" : "hsl(var(--hero-accent))",
                            }}
                        />
                        <motion.span
                            className="absolute top-3 left-0 font-mono text-[0.5rem] tracking-[0.22em] uppercase whitespace-nowrap"
                            animate={{
                                opacity: i === active ? 1 : 0.28,
                                color:   i === active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
                            }}
                            transition={{ duration: 0.4 }}
                        >
                            {String(i + 1).padStart(2, "0")}
                            <span className="hidden sm:inline ml-1 normal-case tracking-normal opacity-70">{s.title}</span>
                        </motion.span>
                    </div>
                );
            })}
        </div>
    );
}
