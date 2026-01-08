"use client";
import { useScrollAnimation } from "@/lib/use-scroll-animation";
import { cn } from "@/lib/utils";

// Simple placeholder logos as SVGs
const LogoPlaceholder = ({ label }: { label: string }) => (
    <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
        <div className="h-8 w-8 bg-foreground rounded-lg flex items-center justify-center text-background font-bold font-serif text-lg">
            {label[0]}
        </div>
        <span className="font-bold text-xl tracking-tight">{label}</span>
    </div>
);

export function SocialProof() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section className="py-20 border-b border-border/40 bg-muted/20">
            <div className="container mx-auto px-4 md:px-6">
                <div
                    ref={ref}
                    className={cn(
                        "flex flex-col lg:flex-row gap-12 items-center justify-between reveal-on-scroll",
                        isVisible && "is-visible"
                    )}
                >
                    <div className="w-full lg:w-1/2 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center lg:justify-items-start">
                        <LogoPlaceholder label="Acme" />
                        <LogoPlaceholder label="Bolt" />
                        <LogoPlaceholder label="Nexus" />
                        <LogoPlaceholder label="Sphere" />
                    </div>

                    <div className="w-full lg:w-1/2 pl-0 lg:pl-12 border-l-0 lg:border-l border-border/50">
                        <figure className="relative">
                            <svg
                                className="absolute -top-4 -left-4 h-8 w-8 text-secondary/20"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9.00001 15 9.00001 14 9.00001 13C9.00001 12 9.00001 11 9.00001 10C9.00001 9 9.00001 8 9.00001 7V5C9.00001 3.89543 9.89544 3 11 3H19C20.1046 3 21 3.89543 21 5V7C21 8 21 9 21 10C21 11 21 12 21 13C21 14 21 15 21 16C21 17.1046 20.1046 18 19 18H14.983L14.017 21Z" />
                            </svg>

                            <blockquote className="text-lg font-medium leading-relaxed italic text-foreground/80">
                                &quot;Julian transformed our MVP into a fully scalable platform. His
                                attention to detail in both code and design was exceptional.&quot;
                            </blockquote>

                            <figcaption className="mt-4 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary to-primary" />
                                <div>
                                    <div className="font-bold text-sm">Sarah Jenkins</div>
                                    <div className="text-xs text-muted-foreground">
                                        CTO at TechFlow
                                    </div>
                                </div>
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </div>
        </section>
    );
}
