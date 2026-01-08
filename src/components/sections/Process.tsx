"use client";
import { useScrollAnimation } from "@/lib/use-scroll-animation";
import { cn } from "@/lib/utils";

const steps = [
    {
        number: "01",
        title: "Discovery",
        description:
            "I dive deep into your goals, your users, and your technical constraints so we can build a clear plan and avoid surprises later.",
        range: "1-2 Weeks",
    },
    {
        number: "02",
        title: "Design",
        description:
            "I create intuitive, high-fidelity designs and interactive prototypes to validate the experience before any heavy build starts.",
        range: "2-4 Weeks",
    },
    {
        number: "03",
        title: "Development",
        description:
            "I build your product using modern, scalable technologies with clean code, strong performance, and careful attention to details.",
        range: "4-8 Weeks",
    },
    {
        number: "04",
        title: "Launch & Scale",
        description:
            "I handle deployment, testing, and iteration support so your product can launch smoothly and keep improving over time.",
        range: "Ongoing",
    },
];

export function Process() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="process" className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                        How I Work
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        A transparent, collaborative process designed to deliver results on
                        time and within budget.
                    </p>
                </div>

                <div ref={ref} className="grid md:grid-cols-4 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-border -z-10" />

                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={cn(
                                "relative bg-background pt-4 md:pt-0 reveal-on-scroll",
                                isVisible && "is-visible"
                            )}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="h-24 w-24 rounded-full bg-background border-2 border-border flex items-center justify-center mb-6 text-3xl font-bold font-serif text-muted-foreground shadow-sm mx-auto md:mx-0">
                                {step.number}
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                            <div className="mb-4 inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wide">
                                {step.range}
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
