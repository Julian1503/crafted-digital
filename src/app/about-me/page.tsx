import {Header} from "@/components/layout/Header";
import {Footer} from "@/components/layout/Footer";
import {SkipLink} from "@/components/ui/skip-link";
import AboutContent from "@/app/about-me/AboutContent";
import { getContentBlocks } from "@/lib/services/content-blocks";
import {
    toAboutPrinciples,
    toAboutHighlights,
    toAboutStoryBlocks,
} from "@/lib/mappers/content-block.mapper";

export const revalidate = 60;

const DEFAULT_PRINCIPLES = [
    {
        title: "Human-first design",
        description:
            "Every interaction should feel obvious, calm, and supportive so people can focus on their work.",
    },
    {
        title: "Simplicity scales",
        description:
            "Clear architecture and lean interfaces keep products fast as your business grows.",
    },
    {
        title: "Evidence-driven",
        description:
            "Decisions are backed by research, analytics, and stakeholder alignment—not guesswork.",
    },
    {
        title: "Quality in every layer",
        description:
            "From typography to API design, I obsess over the details that build trust.",
    },
];

const DEFAULT_HIGHLIGHTS = [
    "Senior product designer + engineer hybrid mindset",
    "Transparent weekly updates and collaborative planning",
    "Performance, accessibility, and SEO baked in",
    "Launch support and iteration after go-live",
];

const DEFAULT_STORY_BLOCKS = [
    {
        title: "The mission",
        body: "I help thoughtful teams ship digital products that feel premium, fast, and effortless to use. That means shaping strategy, designing systems, and engineering resilient experiences with the end user in mind.",
    },
    {
        title: "The method",
        body: "We start with clarity. I translate your goals into a shared plan, then deliver in focused sprints—research, design, development, and launch—so momentum never stalls.",
    },
    {
        title: "The partnership",
        body: "You work directly with me end-to-end. No handoffs, no layers, just a calm, proactive partner who treats your product like it is my own.",
    },
];

export default async function About() {
    let principles = DEFAULT_PRINCIPLES;
    let experienceHighlights = DEFAULT_HIGHLIGHTS;
    let storyBlocks = DEFAULT_STORY_BLOCKS;

    try {
        const [principleBlocks, highlightBlocks, storyBlocksData] = await Promise.all([
            getContentBlocks("about-principles"),
            getContentBlocks("about-highlights"),
            getContentBlocks("about-story"),
        ]);

        if (principleBlocks.length > 0) principles = toAboutPrinciples(principleBlocks);
        if (highlightBlocks.length > 0) experienceHighlights = toAboutHighlights(highlightBlocks);
        if (storyBlocksData.length > 0) storyBlocks = toAboutStoryBlocks(storyBlocksData);
    } catch {
        // Use defaults if DB is not available
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-secondary/30">
            <SkipLink />
            <Header />

            <main id="main-content" className="pt-2 md:pt-24">
                <AboutContent
                    principles={principles}
                    experienceHighlights={experienceHighlights}
                    storyBlocks={storyBlocks}
                />
            </main>

            <Footer />
        </div>
    );
}
