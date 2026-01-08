"use client";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useScrollAnimation } from "@/lib/use-scroll-animation";
import { cn } from "@/lib/utils";
import Link from "next/link";

const plans = [
    {
        name: "Starter Build",
        price: "From AUD 3,000",
        description:
            "Ideal for a landing page with real logic: forms, integrations, and a polished first version.",
        features: [
            "High-converting landing page",
            "Forms + basic integrations",
            "SEO + performance basics",
            "Analytics setup",
            "1-2 Weeks Delivery",
        ],
        cta: "Get a quote",
        featured: false,
    },
    {
        name: "MVP Build",
        price: "From AUD 8,000",
        description:
            "Launch a production-ready MVP with a clean stack, strong UX, and room to scale.",
        features: [
            "Next.js & React Development",
            "Database + API setup",
            "Authentication & security",
            "Deploy + monitoring basics",
            "4-6 Weeks Delivery",
        ],
        cta: "Book a call",
        featured: true,
    },
    {
        name: "Ongoing Support",
        price: "From AUD 1,000 / month",
        description:
            "For teams who want continuous improvements, fixes, and a reliable technical partner.",
        features: [
            "Bug fixes + small enhancements",
            "Performance improvements",
            "Security updates",
            "Prioritized support",
            "Monthly development hours",
        ],
        cta: "Talk to me",
        featured: false,
    },
];

export function Pricing() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="pricing" className="py-24 bg-muted/20 border-t border-border/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                        Pricing
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Simple packages for most projects. Final pricing depends on scope and
                        complexity.
                    </p>
                </div>

                <div ref={ref} className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={cn(
                                "relative flex flex-col p-8 rounded-3xl border bg-background transition-all duration-300 reveal-on-scroll",
                                plan.featured
                                    ? "border-secondary shadow-2xl shadow-secondary/10 scale-105 z-10"
                                    : "border-border hover:border-border/80 hover:shadow-lg",
                                isVisible && "is-visible"
                            )}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            {plan.featured && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="text-4xl font-bold text-foreground mb-2">
                                    {plan.price}
                                </div>
                                <p className="text-muted-foreground">{plan.description}</p>
                            </div>

                            <ul className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm">
                                        <Check className="h-5 w-5 text-secondary shrink-0" />
                                        <span className="text-foreground/80">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                asChild
                                variant={plan.featured ? "default" : "outline"}
                                className={cn(
                                    "w-full rounded-full",
                                    plan.featured && "shadow-lg shadow-secondary/25"
                                )}
                            >
                                <Link href="#contact">{plan.cta}</Link>
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center text-sm text-muted-foreground">
                    Not sure which package fits?{" "}
                    <Link href="#contact" className="text-secondary hover:underline font-medium">
                        Message me
                    </Link>{" "}
                    and I’ll help you choose.
                </div>
            </div>
        </section>
    );
}
