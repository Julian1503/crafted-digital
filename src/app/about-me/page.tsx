"use client";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/lib/use-scroll-animation";
import { cn } from "@/lib/utils";
import { ArrowRight, Lightbulb, Target, Users, Heart } from "lucide-react";
import Link from "next/link";

const values = [
    {
        icon: Lightbulb,
        title: "Clarity First",
        description:
            "I avoid jargon and unnecessary complexity. I solve problems with simple, effective solutions that just work.",
    },
    {
        icon: Target,
        title: "Precision",
        description:
            "Details matter. From the first pixel to the last line of code, I aim for pixel-perfect execution.",
    },
    {
        icon: Users,
        title: "Partnership",
        description:
            "I am not just a vendor. I am your technical partner, invested in your long-term success.",
    },
    {
        icon: Heart,
        title: "Honesty",
        description:
            "I am transparent about timelines, costs, and capabilities. No overpromising, just real results.",
    },
];

export default function About() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
            <Header />

            <main className="pt-24 pb-12">
                {/* About Hero */}
                <section className="py-20 md:py-32 bg-background relative overflow-hidden">
                    {/* Background Blob */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

                    <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground mb-8">
                            About Julian Delgado
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed text-balance">
                            I am an engineer and a passionate designer obsessed with quality. I
                            build software that feels human, works smoothly, and helps your
                            business grow.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-24 bg-muted/20 border-y border-border/40">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div
                                ref={ref}
                                className={cn(
                                    "space-y-6 reveal-on-scroll",
                                    isVisible && "is-visible"
                                )}
                            >
                                <h2 className="text-4xl font-bold font-serif text-foreground">
                                    My Mission
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    The web has become cluttered with slow, bloated, and confusing
                                    experiences. My mission is to fix that.
                                </p>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    I believe great software should feel invisible. It should help
                                    you do your best work without getting in the way. That is why I
                                    focus on performance, accessibility, and clean design above all
                                    else.
                                </p>
                            </div>

                            <div className="relative h-[400px] bg-card rounded-2xl shadow-xl border border-border/50 p-8 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent" />
                                {/* Abstract Geometric Mark */}
                                <svg
                                    width="200"
                                    height="200"
                                    viewBox="0 0 200 200"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-secondary opacity-20"
                                >
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <line
                                        x1="20"
                                        y1="100"
                                        x2="180"
                                        y2="100"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <line
                                        x1="100"
                                        y1="20"
                                        x2="100"
                                        y2="180"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-24 bg-background">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-4xl font-bold font-serif mb-6 text-foreground">
                                My Values
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                These are the principles that guide how I work and how I make
                                decisions.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="p-8 rounded-3xl bg-card border border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/5"
                                >
                                    <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                                        <value.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Personal Story / Approach */}
                <section className="py-24 bg-foreground text-background">
                    <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
                        <h2 className="text-4xl font-bold font-serif mb-8 text-background">
                            How I Work
                        </h2>
                        <div className="prose prose-lg prose-invert mx-auto text-muted-foreground/80">
                            <p className="mb-6">
                                I started doing this work because I got tired of seeing great
                                businesses struggle with technology. I saw too many solid ideas
                                lose momentum because the execution did not match the vision.
                            </p>
                            <p className="mb-6">
                                My approach is simple: I listen first. I do not write a single
                                line of code until I understand your business and your goals.
                                Then I build exactly what you need—nothing more, nothing less.
                            </p>
                            <p>
                                I keep the process direct and transparent. You work with me
                                end-to-end, without layers of middle management. That keeps
                                things fast, focused, and accountable.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-muted/30">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold font-serif mb-8 text-foreground">
                            Let&apos;s work together
                        </h2>
                        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                            Ready to turn your vision into reality? Let&apos;s have a
                            conversation about your project.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                asChild
                                size="lg"
                                className="rounded-full text-base px-8 h-12 shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all"
                            >
                                <Link href="/#contact">
                                    Book a free discovery call
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="rounded-full text-base px-8 h-12 bg-background"
                            >
                                <Link href="/#work">View my work</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
