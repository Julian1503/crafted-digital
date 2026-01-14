/**
 * @fileoverview Carousel controls component for the Work section.
 * Renders the scrollable container with project cards.
 * Implements WCAG 2.x accessible carousel patterns with keyboard navigation.
 */
"use client";

import { cn } from "@/lib/utils";
import { Project } from "@/components/sections/Work/work.types";
import ProjectCard from "@/components/sections/Work/ProjectCard";
import { RefObject, useCallback, KeyboardEvent } from "react";

/**
 * Props for the CarouselControls component.
 */
interface CarouselControlsProps {
    /** Array of projects to display */
    projects: Project[];
    /** Ref to the scroller container element */
    scrollerRef: React.RefObject<HTMLDivElement | null>;
    /** Ref to the progress bar elements array */
    progressRefSet: RefObject<(HTMLDivElement | null)[]>;
    /** Currently active/centered card index */
    activeIndex?: number;
    /** Whether the reveal animation has completed */
    hasRevealed: boolean;
}

/**
 * Carousel controls component.
 * Renders a horizontally scrollable container with project cards.
 * Supports keyboard navigation with Left/Right arrow keys.
 *
 * @param props - Projects data and animation state
 * @returns The rendered carousel container with cards
 */
export default function CarouselControls({ projects, scrollerRef, progressRefSet, hasRevealed, activeIndex }: CarouselControlsProps) {
    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
        const el = scrollerRef.current;
        if (!el) return;

        // Calculate scroll amount based on first card width for consistent behavior
        const cards = el.querySelectorAll<HTMLElement>("[data-work-card]");
        const scrollAmount = cards.length > 0 ? cards[0].offsetWidth + 20 : 300; // card width + gap

        if (e.key === "ArrowLeft") {
            e.preventDefault();
            el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            el.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    }, [scrollerRef]);

    return (
        <div className="mt-10">
            <div
                ref={scrollerRef}
                className={cn(
                    "flex gap-5 overflow-x-auto pb-4 outline-none",
                    "snap-x snap-mandatory",
                    "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                )}
                role="region"
                tabIndex={0}
                aria-label="Featured work carousel - use arrow keys to scroll"
                aria-roledescription="carousel"
                onKeyDown={handleKeyDown}
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