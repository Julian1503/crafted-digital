"use client";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/lib/use-scroll-animation";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

const projects = [
    {
        title: "FinDash",
        category: "Fintech Dashboard",
        description:
            "A real-time financial analytics platform designed and built to handle high-volume transaction data with speed and clarity.",
        color: "bg-emerald-500/10",
    },
    {
        title: "Lumina",
        category: "E-commerce Experience",
        description:
            "A high-performance headless storefront created to deliver a fast, seamless shopping experience for a premium lighting brand.",
        color: "bg-orange-500/10",
    },
    {
        title: "TaskFlow",
        category: "SaaS Productivity Tool",
        description:
            "A collaborative project management tool built to help remote teams stay aligned, productive, and focused.",
        color: "bg-blue-500/10",
    },
];

export function Work() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="work" className="py-24 bg-foreground text-background overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-background">
                            Featured Work
                        </h2>
                        <p className="text-xl text-muted-foreground/80">
                            A selection of projects that showcase my focus on quality,
                            performance, and thoughtful execution.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="text-foreground bg-background hover:bg-background/90 rounded-full"
                    >
                        See all projects
                    </Button>
                </div>

                <div ref={ref} className="grid md:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className={cn(
                                "group relative block reveal-on-scroll",
                                isVisible && "is-visible"
                            )}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            {/* Project Card Image Placeholder */}
                            <div
                                className={cn(
                                    "aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-white/10 transition-transform duration-500 group-hover:-translate-y-2",
                                    project.color
                                )}
                            >
                                <div className="w-full h-full flex items-center justify-center opacity-30 font-serif text-6xl font-bold text-white/20">
                                    {project.title[0]}
                                </div>
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-bold text-background group-hover:text-secondary transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm font-medium text-secondary uppercase tracking-wider mt-1">
                                            {project.category}
                                        </p>
                                    </div>
                                    <ArrowUpRight className="text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                                <p className="text-muted-foreground/70 leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
