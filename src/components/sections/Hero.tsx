"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useScrollAnimation } from "@/lib/use-scroll-animation";
import { cn } from "@/lib/utils";

export function Hero() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-20 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
                <div ref={ref} className={cn("space-y-8 reveal-on-scroll", isVisible && "is-visible")}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
                        Accepting new projects for Q1 2026
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground">
                        I build digital products that <span className="text-secondary italic">perform.</span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-lg leading-relaxed text-balance">
                        I’m Julian Delgado, a software engineer focused on building fast, polished, and scalable web applications.
                        I help ambitious teams turn complex problems into clean, user-friendly products.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            size="lg"
                            className="rounded-full text-base px-8 h-12 shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all"
                        >
                            Book a free discovery call
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full text-base px-8 h-12 border-muted-foreground/20 hover:bg-muted/50"
                        >
                            View my work
                        </Button>
                    </div>

                    <div className="pt-8 flex flex-col gap-3">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Ideal for
                        </p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {["SaaS Startups", "Internal Tools", "E-commerce Brands"].map((item) => (
                                <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Visual / Abstract Illustration placeholder */}
                <div className="hidden lg:block relative h-[600px] w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent rounded-3xl border border-border/50 shadow-2xl overflow-hidden backdrop-blur-sm p-8 flex flex-col gap-6 transform rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
                        {/* Abstract UI representation */}
                        <div className="w-full h-12 bg-white rounded-lg shadow-sm flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                            <div className="w-3 h-3 rounded-full bg-green-400/80" />
                        </div>
                        <div className="flex-1 flex gap-6">
                            <div className="w-64 bg-white/50 rounded-lg shadow-sm" />
                            <div className="flex-1 bg-white rounded-lg shadow-lg border border-border/50 p-6 space-y-4">
                                <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
                                <div className="h-32 w-full bg-secondary/5 rounded-xl border border-secondary/10" />
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-muted/50 rounded" />
                                    <div className="h-3 w-5/6 bg-muted/50 rounded" />
                                    <div className="h-3 w-4/6 bg-muted/50 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
