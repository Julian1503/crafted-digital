import {cn} from "@/lib/utils";
import {Project} from "@/components/sections/Work/work.types";
import ProjectCard from "@/components/sections/Work/ProjectCard";
import {RefObject} from "react";

type CarouselControlsProps = {
    projects: Project[],
    scrollerRef: React.RefObject<HTMLDivElement | null>,
    progressRefSet: RefObject<(HTMLDivElement | null)[]>,
    activeIndex?: number
    hasRevealed: boolean;
}



export default function CarouselControls({projects, scrollerRef, progressRefSet, hasRevealed, activeIndex}: CarouselControlsProps) {
    return (
        <div className="mt-10">
            <div
                ref={scrollerRef}
                className={cn(
                    "flex gap-5 overflow-x-auto pb-4 outline-none",
                    "snap-x snap-mandatory",
                    "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                )}
                tabIndex={0}
                aria-label="Featured work carousel"
            >
                {projects.map((p, i) => (
                    <ProjectCard key={p.title}
                                 project={p}
                                 index={i}
                                 hasRevealed={hasRevealed}
                                 progressRefSet={progressRefSet}
                                 activeIndex={activeIndex}/>
                ))}
            </div>
        </div>
    );
}