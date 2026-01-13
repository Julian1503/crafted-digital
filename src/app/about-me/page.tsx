"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {Header} from "@/components/layout/Header";
import {Footer} from "@/components/layout/Footer";
import RevealSection from "@/components/ui/RevealSection";

const metrics = [
    {
        label: "Projects shipped",
        value: "60+",
        detail: "Launches across SaaS, fintech, and e-commerce.",
    },
    {
        label: "Avg. performance lift",
        value: "2.3×",
        detail: "Measured improvements to Core Web Vitals.",
    },
    {
        label: "Client partnerships",
        value: "5+ yrs",
        detail: "Long-term relationships built on trust.",
    },
];

const principles = [
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

const experienceHighlights = [
    "Senior product designer + engineer hybrid mindset",
    "Transparent weekly updates and collaborative planning",
    "Performance, accessibility, and SEO baked in",
    "Launch support and iteration after go-live",
];

const storyBlocks = [
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


export default function About() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-secondary/30">
            <Header />

            <main className="pt-24">
                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-secondary/10 blur-[120px] animate-float-slow" />
                        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-primary/5 blur-[100px] animate-float-slow" />
                    </div>

                    <div className="container mx-auto px-4 md:px-6 py-20 md:py-28">
                        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
                            <div className="space-y-8">
                                <RevealSection delay={0} variant="left">
                                    <p className="uppercase text-sm tracking-[0.3em] text-muted-foreground">
                                        About the studio
                                    </p>
                                </RevealSection>
                                <RevealSection delay={80} variant="left">
                                    <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] text-balance">
                                        Crafting digital experiences that feel human and perform
                                        like they should.
                                    </h1>
                                </RevealSection>
                                <RevealSection delay={140} variant="left">
                                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                                        I am Julian Delgado—designer, engineer, and strategic partner
                                        for teams who need their product to communicate clearly, move
                                        fast, and scale responsibly.
                                    </p>
                                </RevealSection>
                                <RevealSection delay={200} variant="left">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-full px-8 text-base shadow-lg shadow-secondary/20"
                                        >
                                            <Link href="/#contact">
                                                Book a discovery call
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="lg"
                                            className="rounded-full px-8 text-base"
                                        >
                                            <Link href="/#work">See recent work</Link>
                                        </Button>
                                    </div>
                                </RevealSection>
                            </div>

                            <RevealSection delay={120} variant="right">
                                <div className="rounded-3xl border border-border bg-card p-8 shadow-xl">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                                                What I deliver
                                            </p>
                                            <h2 className="text-2xl font-bold mt-2">
                                                High-end digital craft with measurable impact.
                                            </h2>
                                        </div>
                                        <ul className="space-y-4 text-muted-foreground">
                                            {experienceHighlights.map((highlight) => (
                                                <li key={highlight} className="flex items-start gap-3">
                                                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-secondary" />
                                                    <span>{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="rounded-2xl bg-muted/40 p-4 text-sm text-muted-foreground">
                                            Currently based in Texas • Serving clients worldwide
                                        </div>
                                    </div>
                                </div>
                            </RevealSection>
                        </div>
                    </div>
                </section>

                {/* Story */}
                <section className="bg-muted/20">
                    <div className="container mx-auto px-4 md:px-6 py-24">
                        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
                            <RevealSection className="space-y-6" variant="left">
                                <p className="uppercase text-sm tracking-[0.3em] text-muted-foreground">
                                    The story
                                </p>
                                <h2 className="text-4xl font-bold">
                                    Calm, collaborative, and focused on outcomes.
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    I build digital products for teams that value clarity over
                                    noise. My role is to translate your vision into an experience
                                    that feels confident, premium, and easy to trust.
                                </p>
                            </RevealSection>

                            <div className="space-y-8">
                                {storyBlocks.map((block, index) => (
                                    <RevealSection
                                        key={block.title}
                                        className="rounded-3xl border border-border bg-card p-8 shadow-sm"
                                        delay={index * 140}
                                        variant="right"
                                    >
                                        <h3 className="text-2xl font-semibold mb-4">
                                            {block.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {block.body}
                                        </p>
                                    </RevealSection>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Principles */}
                <section className="bg-background">
                    <div className="container mx-auto px-4 md:px-6 py-24">
                        <RevealSection className="text-center max-w-3xl mx-auto mb-16" variant="up">
                            <p className="uppercase text-sm tracking-[0.3em] text-muted-foreground">
                                Principles
                            </p>
                            <h2 className="text-4xl font-bold mt-4">What guides every project</h2>
                            <p className="text-lg text-muted-foreground mt-6">
                                The same core values show up in every deliverable, from early
                                wireframes to launch day.
                            </p>
                        </RevealSection>

                        <div className="grid gap-8 md:grid-cols-2">
                            {principles.map((principle, index) => (
                                <RevealSection
                                    key={principle.title}
                                    className="rounded-3xl border border-border bg-card p-8"
                                    delay={index * 120}
                                    variant="scale"
                                >
                                    <h3 className="text-2xl font-semibold mb-4">
                                        {principle.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {principle.description}
                                    </p>
                                </RevealSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Collaboration */}
                <section className="bg-foreground text-background">
                    <div className="container mx-auto px-4 md:px-6 py-24">
                        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
                            <RevealSection className="space-y-6" variant="left">
                                <p className="uppercase text-sm tracking-[0.3em] text-background/60">
                                    Collaboration
                                </p>
                                <h2 className="text-4xl font-bold">A senior partner in your corner.</h2>
                                <p className="text-lg text-background/80 leading-relaxed">
                                    I bring the polish of a studio with the focus of a specialist.
                                    You get thoughtful direction, hands-on execution, and a partner
                                    who keeps things moving without the overhead.
                                </p>
                            </RevealSection>
                            <RevealSection
                                className="rounded-3xl border border-background/10 bg-background/5 p-8"
                                variant="right"
                                delay={120}
                            >
                                <h3 className="text-2xl font-semibold mb-4">What you can expect</h3>
                                <ul className="space-y-4 text-background/80">
                                    <li className="flex items-center gap-3">
                                        <span className="h-2 w-2 rounded-full bg-secondary" />
                                        Strategic discovery and positioning support.
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="h-2 w-2 rounded-full bg-secondary" />
                                        A polished interface system that scales.
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="h-2 w-2 rounded-full bg-secondary" />
                                        Production-ready code with documentation.
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="h-2 w-2 rounded-full bg-secondary" />
                                        Launch guidance and post-launch optimization.
                                    </li>
                                </ul>
                            </RevealSection>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-muted/30">
                    <div className="container mx-auto px-4 md:px-6 py-24 text-center">
                        <RevealSection className="max-w-3xl mx-auto" variant="scale">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Ready to build something refined?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-10">
                                Let&apos;s align on your goals and craft an experience your customers
                                will remember.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    asChild
                                    size="lg"
                                    className="rounded-full px-8 text-base shadow-lg shadow-primary/10"
                                >
                                    <Link href="/#contact">
                                        Start a project
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full px-8 text-base"
                                >
                                    <Link href="/#pricing">View pricing</Link>
                                </Button>
                            </div>
                        </RevealSection>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}