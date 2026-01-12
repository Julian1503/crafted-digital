import {cn} from "@/lib/utils";
import {Project} from "@/components/sections/Work/work.types";
import {CARD_MS, STAGGER_MS_DESKTOP} from "@/components/sections/Work/work-data";
import {ArrowRight} from "lucide-react";
import {RefObject, useRef} from "react";

type ProjectCardProps = {
    project: Project,
    index: number,
    hasRevealed: boolean,
    progressRefSet: RefObject<(HTMLDivElement | null)[]>;
    activeIndex: number | undefined;
}

export default function ProjectCard({project, index, progressRefSet, hasRevealed, activeIndex}: ProjectCardProps) {
    const progressRefs = useRef<(HTMLDivElement | null)[]>(progressRefSet?.current);

    return (
        <a
            key={project.title}
            href={project.href}
            data-work-card
            className={cn(
                "group relative snap-start shrink-0",
                "w-[78%] sm:w-[52%] lg:w-[36%] xl:w-[30%]",
                "aspect-[3/4] rounded-[28px] overflow-hidden",
                "border border-white/10 bg-background/5 backdrop-blur",
                "transition-transform duration-500 hover:-translate-y-1"
            )}
        >
            {/* Inner wrapper = entrance animation (so hover transform stays on <a>) */}
            <div
                className={cn(
                    "absolute inset-0 will-change-[transform,opacity,filter]",
                    "transition-[transform,opacity,filter] ease-out",
                    !hasRevealed && "opacity-0 translate-y-3 scale-[0.985] blur-[2px]",
                    hasRevealed && "opacity-100 translate-y-0 scale-100 blur-0"
                )}
                style={{
                    transitionDuration: `${CARD_MS}ms`,
                    transitionDelay: hasRevealed
                        ? `${(index * STAGGER_MS_DESKTOP)}ms`
                        : "0ms",
                }}
            >
                {/* Progress bar (solo para el card activo) */}
                {activeIndex === index && (
                    <div className="absolute left-5 right-5 top-5 z-40 pointer-events-none">
                        <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
                            <div
                                ref={(el) => progressRefs.current[index] = el}
                                className="h-full w-full rounded-full bg-white/80 origin-left will-change-transform"
                                style={{transform: "scaleX(0)"}}
                            />
                        </div>
                    </div>
                )}


                {/* Image */}
                <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/35 to-black/85"/>
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10"/>
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
                />

                <div
                    className={cn(
                        "absolute inset-x-0 bottom-0 z-30 p-6",
                        "translate-y-5 opacity-0",
                        "group-hover:translate-y-0 group-hover:opacity-100",
                        "transition-all duration-300"
                    )}
                >
                    <div className="rounded-2xl border border-white/10 bg-black/45 p-5">
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
                            Open case study <ArrowRight className="h-4 w-4"/>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
}