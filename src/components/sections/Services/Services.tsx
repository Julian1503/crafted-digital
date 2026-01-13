"use client";

import * as React from "react";
import { useScrollAnimation } from "@/lib/use-scroll-animation";
import ServicesCard from "@/components/sections/Services/ServicesCard";
import {Service} from "@/components/sections/Services/services.types";
import {services} from "@/components/sections/Services/services-data";



const addons = [
    "SEO Optimization",
    "Performance Audits",
    "CMS Integration",
    "API Development",
    "Auth & Roles",
    "Monitoring & Alerts",
];
type ServicesProps = {
    services: Service[];
}

export function Services() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="services" className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="mb-14 max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
                        Services built for teams that ship
                    </h2>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                        I don’t just write code — I help you launch a product that solves a real problem, feels premium, and scales.
                    </p>
                </div>

                {/* Cards */}
                <div ref={ref} className="grid md:grid-cols-3 gap-8 mb-14">
                    {services.map((service, index) => (
                        <ServicesCard key={service.title} index={index} isVisible={isVisible} service={service} />
                    ))}
                </div>

                {/* Process (adds “software services” credibility) */}
                <div className="grid gap-6 md:grid-cols-3 mb-14">
                    {[
                        {
                            title: "1) Discover",
                            desc: "Clarify scope, risks, and success metrics. Align on MVP or milestones.",
                        },
                        {
                            title: "2) Build",
                            desc: "Ship iteratively with weekly demos. Clean code, tests where needed, fast feedback.",
                        },
                        {
                            title: "3) Launch",
                            desc: "Deploy, monitor, and stabilize. Hand-off docs + next steps roadmap.",
                        },
                    ].map((step) => (
                        <div
                            key={step.title}
                            className="rounded-2xl border border-border/60 bg-muted/20 p-6"
                        >
                            <p className="text-sm font-semibold text-foreground">{step.title}</p>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Add-ons */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-8 rounded-2xl bg-muted/30 border border-border/60">
                    <div className="flex flex-col">
                        <span className="font-semibold text-lg whitespace-nowrap">Add-ons</span>
                        <span className="text-sm text-muted-foreground">
              Optional extras when you need more firepower.
            </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {addons.map((addon) => (
                            <span
                                key={addon}
                                className="px-4 py-2 rounded-full bg-background/60 border border-border/60 text-sm font-medium text-muted-foreground"
                            >
                {addon}
              </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
