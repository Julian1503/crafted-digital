/**
 * @fileoverview Hero section component.
 * The main landing section featuring headline content and visual media.
 */
import HeroContent from "@/components/sections/Hero/HeroContent";
import HeroVisual from "@/components/sections/Hero/HeroVisual";

/**
 * Hero section component displayed at the top of the homepage.
 * Features a two-column layout with animated content and visual elements.
 *
 * @returns The rendered Hero section with content and visual components
 */
export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center py-20 overflow-hidden bg-linear-to-b from-background/80 via-foreground/10 to-muted/30">
            {/* Subtler background for a "Premium" feel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <HeroContent />
                    <HeroVisual />
                </div>
            </div>
        </section>
    );
}