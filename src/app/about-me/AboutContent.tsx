"use client";

import type {
    AboutPrinciple,
    AboutStoryBlock,
} from "@/lib/mappers/content-block.mapper";
import { bg } from "./_components/about-constants";
import { AboutHero } from "./_components/AboutHero";
import { OriginStory } from "./_components/OriginStory";
import { Experience } from "./_components/Experience";
import { WhatIBuilt } from "./_components/WhatIBuilt";
import { Principles } from "./_components/Principles";
import { AboutCTA } from "./_components/AboutCTA";

interface AboutContentProps {
    principles: AboutPrinciple[];
    experienceHighlights: string[];
    storyBlocks: AboutStoryBlock[];
}

export default function AboutContent({
    principles,
    experienceHighlights,
    storyBlocks,
}: AboutContentProps) {
    return (
        <div className="text-white" style={{ background: bg }}>
            <AboutHero />
            <OriginStory />
            <Experience experienceHighlights={experienceHighlights} />
            <WhatIBuilt />
            <Principles principles={principles} />
            <AboutCTA />
        </div>
    );
}