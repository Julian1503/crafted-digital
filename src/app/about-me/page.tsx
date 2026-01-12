"use client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/lib/use-scroll-animation";
import Image from "next/image";
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
                <section className="py-16 md:py-24 bg-background relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid gap-10 items-center lg:grid-cols-2">
                            <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight text-foreground">
                                    About <span className="text-secondary">Julian Delgado</span>
                                </h1>

                                <p className="mt-5 text-lg md:text-xl text-muted-foreground leading-relaxed">
                                    I’m a software engineer who cares deeply about UX. I build fast, polished web apps that feel human and scale cleanly.
                                </p>

                                {/* credibility chips */}
                                <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-2">
                                    {["Based in Australia", "Next.js + Node", "Performance-first", "Weekly demos"].map((t) => (
                                        <span
                                            key={t}
                                            className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                                        >
              {t}
            </span>
                                    ))}
                                </div>
                            </div>

                            {/* Photo */}
                            <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
                                <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl">
                                    <Image
                                        src="/julian.jpg"
                                        alt="Julian Delgado"
                                        width={900}
                                        height={1100}
                                        priority
                                        className="h-auto w-full object-cover"
                                    />
                                    {/* subtle overlay */}
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-secondary/10 via-transparent to-transparent" />
                                </div>

                                {/* small card badge */}
                                <div className="absolute w-full -bottom-4 left-1/2 -translate-x-1/2 rounded-2xl border border-border/60 bg-background/80 backdrop-blur px-4 py-3 text-center shadow-lg">
                                    <p className="text-xs text-muted-foreground">Worked with teams building</p>
                                    <p className="text-sm font-semibold">SaaS · Platforms · Internal Tools</p>
                                </div>
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
