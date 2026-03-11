import {Project} from "@/components/sections/Work/work.types";
import Link from "next/link";

export default function ProjectRow({ project, index, total, isHovered, onHover, onLeave, visible }: {
    project: Project;
    index: number;
    total: number;
    isHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
    visible: boolean;
}) {
    const href = project.href ?? `/case-studies/${project.slug}`;
    const chars = project.title.split("").map(c => c === " " ? "\u00A0" : c);
    const MAX_MS = 220;
    const cd = (i: number) => Math.min((i / Math.max(chars.length - 1, 1)) * MAX_MS, MAX_MS);

    return (
        <li
            className="relative border-b"
            style={{
                borderColor: "rgba(255,255,255,0.06)",
                opacity:    visible ? 1 : 0,
                transform:  visible ? "translateY(0)" : "translateY(1rem)",
                transition: `opacity 550ms ease ${index * 80 + 200}ms, transform 550ms cubic-bezier(0.16,1,0.3,1) ${index * 80 + 200}ms`,
            }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            {/* Hover fill bar */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:      "rgba(255,255,255,0.025)",
                    transform:       isHovered ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transition:      "transform 500ms cubic-bezier(0.16,1,0.3,1)",
                }}
            />

            <Link
                href={href}
                className="relative flex items-center gap-4 sm:gap-8 py-5 md:py-7"
                style={{ paddingLeft: 0, paddingRight: 0 }}
            >
                {/* Index number */}
                <span
                    className="shrink-0 font-mono text-[0.58rem] tracking-[0.22em] w-6 transition-colors duration-300"
                    style={{ color: isHovered ? "hsl(var(--hero-accent))" : "rgba(255,255,255,0.2)" }}
                >
                    {String(index + 1).padStart(2, "0")}
                </span>

                {/* Title — char-by-char lift */}
                <span className="flex-1 min-w-0 overflow-hidden" aria-label={project.title}>
                    <span
                        className="block font-serif font-normal leading-none tracking-[-0.025em]"
                        style={{ fontSize: "clamp(1.4rem, 3.2vw, 2.8rem)" }}
                    >
                        {chars.map((char, i) => (
                            <span
                                key={i}
                                aria-hidden="true"
                                style={{
                                    display:    "inline-block",
                                    color:      isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)",
                                    transform:  isHovered ? "translateY(0) skewX(0deg)" : "translateY(0.15em) skewX(-2deg)",
                                    transition: `transform 420ms cubic-bezier(0.16,1,0.3,1) ${cd(i)}ms,
                                                 color 320ms ease ${cd(i) * 0.3}ms`,
                                    willChange: "transform",
                                }}
                            >
                                {char}
                            </span>
                        ))}
                    </span>
                </span>

                {/* Category */}
                <span
                    className="hidden sm:block shrink-0 text-[0.62rem] uppercase tracking-[0.16em] transition-colors duration-300"
                    style={{ color: isHovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)" }}
                >
                    {project.industry ?? project.category}
                </span>

                {/* Year */}
                {project.year && (
                    <time
                        dateTime={String(project.year)}
                        className="hidden md:block shrink-0 font-mono text-[0.58rem] transition-colors duration-300"
                        style={{ color: isHovered ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.16)" }}
                    >
                        {project.year}
                    </time>
                )}

                {/* Arrow */}
                <span
                    className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full text-[0.62rem]"
                    aria-hidden="true"
                    style={{
                        border:     "1px solid rgba(255,255,255,0.14)",
                        color:      "#fff",
                        opacity:    isHovered ? 1 : 0,
                        transform:  isHovered ? "rotate(0deg) scale(1)" : "rotate(-45deg) scale(0.8)",
                        transition: "opacity 220ms ease, transform 280ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                >
                    ↗
                </span>
            </Link>
        </li>
    );
}