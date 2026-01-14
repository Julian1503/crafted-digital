/**
 * @fileoverview Services section component displaying available service offerings.
 * Features scroll-triggered animations and a grid layout for service cards.
 */
"use client";

import * as React from "react";
import { useScrollAnimation } from "@/lib/use-scroll-animation";
import ServicesCard from "@/components/sections/Services/ServicesCard";
import { services } from "@/components/sections/Services/services-data";

/** Available service add-ons that can be included with main packages */
const ADD_ONS = [
    "SEO Optimization",
    "Performance Audits",
    "CMS Integration",
    "API Development",
    "Auth & Roles",
    "Monitoring & Alerts",
];

/** Process steps displayed below the service cards */
const PROCESS_STEPS = [
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
];

/**
 * Services section component displaying available software development services.
 * Renders service cards, process steps, and available add-ons.
 *
 * @returns The rendered Services section
 */
export function Services() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="services" className="py-24 bg-background" aria-labelledby="services-heading">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="mb-14 max-w-3xl">
                    <h2 id="services-heading" className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
                        Web Development Services for Australian Businesses
                    </h2>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                        I help service-based businesses across Australia — from tradies and consultants to clinics and agencies — build websites and web applications that convert visitors into customers.
                    </p>
                    <p className="mt-4 text-base text-muted-foreground">
                        Based in Toowoomba, Queensland, I work with clients Australia-wide to deliver custom digital solutions that look premium, perform fast, and scale with your business.
                    </p>
                </div>

                {/* Service cards */}
                <div ref={ref} className="grid md:grid-cols-3 gap-8 mb-14">
                    {services.map((service, index) => (
                        <ServicesCard key={service.title} index={index} isVisible={isVisible} service={service} />
                    ))}
                </div>

                {/* Process steps section */}
                <div className="grid gap-6 md:grid-cols-3 mb-14">
                    {PROCESS_STEPS.map((step) => (
                        <div
                            key={step.title}
                            className="rounded-2xl border border-border/60 bg-muted/20 p-6"
                        >
                            <p className="text-sm font-semibold text-foreground">{step.title}</p>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Add-ons section */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-8 rounded-2xl bg-muted/30 border border-border/60">
                    <div className="flex flex-col">
                        <span className="font-semibold text-lg whitespace-nowrap">Add-ons</span>
                        <span className="text-sm text-muted-foreground">
                            Optional extras when you need more firepower.
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {ADD_ONS.map((addon) => (
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
