"use client";

import { useScrollAnimation } from "@/lib/use-scroll-animation";
import { cn } from "@/lib/utils";
import {steps} from "@/components/sections/Process/process-data";


export function Process() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="process" className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
                        How I work
                    </h2>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                        A transparent, collaborative process optimized for shipping — with clear scope, weekly demos, and no surprises.
                    </p>
                </div>

                {/* Steps */}
                <div ref={ref} className="relative grid gap-6 md:grid-cols-4">
                    {/* Connector line (desktop) */}
                    <div className="pointer-events-none hidden md:block absolute left-6 right-6 top-[28px] h-px bg-border/70" />

                    {steps.map((step, index) => (
                        <div
                            key={step.title}
                            className={cn(
                                "relative rounded-3xl border border-border/70 bg-card p-7 transition-all duration-500 hover:border-secondary/50 hover:shadow-2xl hover:shadow-secondary/5 reveal-on-scroll",
                                isVisible && "is-visible"
                            )}
                            style={{ transitionDelay: `${index * 120}ms` }}
                        >
                            {/* Icon bubble pinned to connector */}
                            <div className="relative mb-5">
                                <div className="mx-auto md:mx-0 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-background/70 text-secondary shadow-sm">
                                    <step.icon className="h-6 w-6" />
                                </div>

                                {/* Pin dot over connector (desktop) */}
                                <div className="hidden md:block absolute left-[26px] top-[22px] h-2 w-2 rounded-full bg-secondary/80" />
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                                <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/20 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                  {step.range}
                </span>
                            </div>

                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                {step.description}
                            </p>

                            <div className="mt-5 space-y-2">
                                {step.bullets.map((b) => (
                                    <div key={b} className="text-sm text-foreground/80">
                                        • {b}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom reassurance row */}
                <div className="mt-10 mx-auto max-w-4xl rounded-2xl border border-border/60 bg-muted/20 p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        You’ll get <span className="font-medium text-foreground">weekly progress updates</span>,{" "}
                        <span className="font-medium text-foreground">clear milestones</span>, and a{" "}
                        <span className="font-medium text-foreground">production-ready deployment</span>.
                    </p>
                </div>
            </div>
        </section>
    );
}
