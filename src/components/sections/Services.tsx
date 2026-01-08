"use client";
import { useScrollAnimation } from "@/lib/use-scroll-animation";
import { cn } from "@/lib/utils";
import {
    Palette,
    Code2,
    LineChart
} from "lucide-react";

const services = [
    {
        title: "Web Application Development",
        description: "Scalable, secure, and high-performance web apps built with React, Next.js, and Node.js. We focus on clean code and long-term maintainability.",
        icon: Code2,
    },
    {
        title: "Product Design & UX",
        description: "User-centric design that balances aesthetics with functionality. We create design systems, high-fidelity mockups, and interactive prototypes.",
        icon: Palette,
    },
    {
        title: "Technical Strategy",
        description: "CTO-level guidance for startups. We help you choose the right stack, plan your architecture, and roadmap your MVP.",
        icon: LineChart,
    },
];

const addons = [
    "SEO Optimization",
    "Performance Audits",
    "CMS Integration",
    "API Development",
];

export function Services() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="services" className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                        Our Expertise
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        We don&apos;t just write code. We partner with you to build products that solve real business problems.
                    </p>
                </div>

                <div ref={ref} className="grid md:grid-cols-3 gap-8 mb-16">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={cn(
                                "p-8 rounded-3xl bg-card border border-border hover:border-secondary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/5 group reveal-on-scroll",
                                isVisible && "is-visible"
                            )}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
                                <service.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-2xl bg-muted/30 border border-border/50">
                    <span className="font-bold text-lg whitespace-nowrap">Also available:</span>
                    <div className="flex flex-wrap gap-4">
                        {addons.map((addon) => (
                            <span key={addon} className="px-4 py-2 rounded-full bg-background border border-border text-sm font-medium text-muted-foreground">
                {addon}
              </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
