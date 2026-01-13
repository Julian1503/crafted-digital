/**
 * @fileoverview Project card component for the Work section carousel.
 * Displays individual portfolio projects with hover effects and animations.
 * Implements WCAG 2.x accessible card patterns.
 */
import { cn } from "@/lib/utils";
import { Project } from "@/components/sections/Work/work.types";
import { CARD_MS, STAGGER_MS_DESKTOP } from "@/components/sections/Work/work-data";
import { ArrowRight } from "lucide-react";
import { RefObject, useRef } from "react";

/**
 * Props for the ProjectCard component.
 */
interface ProjectCardProps {
    /** Project data to display */
    project: Project;
    /** Index of the card for stagger animation */
    index: number;
    /** Whether the reveal animation has completed */
    hasRevealed: boolean;
    /** Ref to the progress bar elements array */
    progressRefSet: RefObject<(HTMLDivElement | null)[]>;
    /** Currently active/centered card index */
    activeIndex: number | undefined;
}

/**
 * Project card component displaying a portfolio project.
 * Features hover effects, progress bar for autoplay, and tier-based scaling.
 *
 * @param props - Project data and animation state
 * @returns The rendered project card
 */
export default function ProjectCard({
                                        project,
                                        index,
                                        progressRefSet,
                                        hasRevealed = true,
                                        activeIndex,
                                    }: ProjectCardProps) {
    const progressRefs = useRef<(HTMLDivElement | null)[]>(progressRefSet?.current);

    const dist = activeIndex == null ? 999 : Math.abs(activeIndex - index);

    const tier =
        dist === 0 ? "center" : dist === 1 ? "near" : dist === 2 ? "far" : "rest";

    const tierClass =
        tier === "center"
            ? "scale-100 opacity-100"
            : tier === "near"
                ? "scale-[0.93] opacity-95"
                : tier === "far"
                    ? "scale-[0.88] opacity-85"
                    : "scale-[0.84] opacity-75";

    return (
        <a
            href={project.href}
            data-work-card
            aria-label={`${project.title} - ${project.brand}. ${project.description}`}
            className={cn(
                "group relative snap-center shrink-0",
                "w-[88%] sm:w-[44%] lg:w-[35%] xl:w-[30%]",
                "aspect-3/4 rounded-[28px] overflow-hidden",
                "bg-transparent",
                "transition-transform duration-500 hover:-translate-y-1",
                "will-change-transform",
                tierClass
            )}
        >
            {/* Inner wrapper = reveal + float */}
            <div
                className={cn(
                    "absolute inset-0 will-change-[transform,opacity,filter]",
                    "transition-[transform,opacity,filter] ease-out",
                    !hasRevealed &&
                    "opacity-0 translate-y-10 transform-[translateY(40px)_rotateX(55deg)_scale(0.98)] blur-[2px]",
                    hasRevealed &&
                    "opacity-100 translate-y-0 transform-[translateY(0px)_rotateX(0deg)_scale(1)] blur-0",
                    "motion-safe:animate-[workFloat_6s_ease-in-out_infinite] motion-reduce:animate-none"
                )}
                style={{
                    transitionDuration: `${CARD_MS}ms`,
                    transitionDelay: hasRevealed ? `${index * STAGGER_MS_DESKTOP}ms` : "0ms",
                }}
            >
                {/* Progress bar */}
                {activeIndex === index && (
                    <div className="absolute left-5 right-5 top-5 z-40 pointer-events-none" aria-hidden="true">
                        <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
                            <div
                                ref={(el): void => {
                                    progressRefs.current[index] = el;
                                }}
                                className="h-full w-full rounded-full bg-white/80 origin-left will-change-transform"
                                style={{ transform: "scaleX(0)" }}
                            />
                        </div>
                    </div>
                )}

                {/* Image */}
                <div className="absolute inset-0">
                    <img
                        src={project.image}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        aria-hidden="true"
                    />
                    <div className="absolute inset-0  bg-linear-to-b from-black/0 via-black/35 to-black/85" aria-hidden="true" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10" aria-hidden="true" />
                </div>

                {/* Default content */}
                <div className="relative z-10 flex h-full flex-col justify-end p-6">
                    <p className="text-xs tracking-[0.28em] font-medium text-white/80">
                        {project.brand}
                    </p>
                    <h3 className="mt-2 text-2xl sm:text-3xl font-semibold leading-[1.05] tracking-tight text-white">
                        {project.title}
                    </h3>
                    <p className="mt-3 text-xs tracking-[0.22em] text-white/70">{project.readTime}</p>
                </div>

                {/* Hover overlay */}
                <div
                    className={cn(
                        "absolute inset-0 z-20",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        "bg-secondary/75 backdrop-blur-[2px]"
                    )}
                    aria-hidden="true"
                />

                <div
                    className={cn(
                        "absolute inset-x-0 bottom-0 z-30 p-6",
                        "translate-y-5 opacity-0",
                        "group-hover:translate-y-0 group-hover:opacity-100",
                        "transition-all duration-300"
                    )}
                    aria-hidden="true"
                >
                    <div className="rounded-2xl border border-white/10 bg-black/80 p-5 group-hover:bg-black/30">
                        <p className="text-xs tracking-[0.28em] font-medium text-white/80">
                            {project.category}
                        </p>

                        <h4 className="mt-2 text-xl font-semibold text-white leading-snug">
                            {project.title}
                        </h4>

                        <p className="mt-2 text-sm text-white/75 leading-relaxed">
                            {project.description}
                        </p>

                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white">
                            Open case study <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
}
