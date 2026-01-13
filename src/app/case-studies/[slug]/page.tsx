import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Case study data structure.
 */
interface CaseStudy {
    slug: string;
    title: string;
    client: string;
    category: string;
    description: string;
    image: string;
    challenge: string;
    approach: string[];
    solution: string;
    results: string[];
    technologies: string[];
    testimonial?: {
        quote: string;
        author: string;
        role: string;
    };
}

/**
 * Full case study data.
 */
const caseStudies: CaseStudy[] = [
    {
        slug: "ai-contract-automation",
        title: "AI-Powered Contract Automation",
        client: "Legal Tech Startup",
        category: "AI / Automation",
        description:
            "Automating contract interpretation and memo drafting — cutting hours of manual work down to minutes for Australian legal professionals.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
        challenge:
            "A growing Australian legal tech startup needed to automate the time-consuming process of reviewing contracts and drafting response memos. Their legal professionals were spending 3-4 hours per contract on repetitive tasks that could be systematised.",
        approach: [
            "Conducted discovery sessions to understand the exact workflow and pain points",
            "Designed a human-in-the-loop system that automates 80% of the work while keeping humans in control of final decisions",
            "Built a clean, intuitive interface that legal professionals could adopt without extensive training",
            "Implemented secure document handling to meet Australian privacy and legal requirements",
        ],
        solution:
            "I built a Next.js web application that uses AI to analyse contracts, extract key clauses, and generate draft response memos. The system flags potential issues and presents them in a clear dashboard, allowing legal professionals to review, edit, and approve outputs in minutes rather than hours.",
        results: [
            "Reduced contract review time from 3-4 hours to 20-30 minutes",
            "Improved consistency across contract responses",
            "Enabled the team to handle 3x more contracts without hiring additional staff",
            "Achieved 95% user adoption within the first month",
        ],
        technologies: ["Next.js", "TypeScript", "OpenAI API", "PostgreSQL", "Tailwind CSS"],
    },
    {
        slug: "tradie-booking-platform",
        title: "Tradie Booking Platform",
        client: "Queensland Trade Services",
        category: "Web Application",
        description:
            "A custom booking and job management platform built for a growing Queensland trade services business.",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200",
        challenge:
            "A Queensland-based trade services company was managing bookings through phone calls, text messages, and spreadsheets. As they grew, this manual approach became unsustainable — jobs were being double-booked, quotes were getting lost, and customer follow-ups were inconsistent.",
        approach: [
            "Mapped out the entire customer journey from initial enquiry to job completion",
            "Designed a mobile-first interface that tradies could use on-site from their phones",
            "Built an automated quote and booking system that reduces admin time",
            "Integrated with their existing accounting software to streamline invoicing",
        ],
        solution:
            "I delivered a custom web application that handles the full job lifecycle: customer enquiries come in through the website, get automatically routed to the right trade, quotes are generated and sent, bookings are scheduled, and jobs are tracked to completion. The business owner can see everything in a real-time dashboard.",
        results: [
            "Eliminated double-bookings completely",
            "Reduced admin time by 15 hours per week",
            "Improved quote-to-booking conversion by 40%",
            "Enabled 24/7 online booking, capturing leads outside business hours",
        ],
        technologies: ["Next.js", "React", "Node.js", "PostgreSQL", "Stripe", "Twilio SMS"],
        testimonial: {
            quote: "Julian understood exactly what we needed. The booking system has transformed how we run the business — we can actually focus on the work now instead of chasing paperwork.",
            author: "Business Owner",
            role: "Queensland Trade Services",
        },
    },
    {
        slug: "clinic-management-system",
        title: "Clinic Management System",
        client: "Allied Health Practice",
        category: "Healthcare / SaaS",
        description:
            "A modern patient management system for an Australian allied health practice.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200",
        challenge:
            "An allied health practice in regional Queensland was using outdated software that didn't meet their needs. They wanted a modern system that could handle online booking, patient records, appointment reminders, and Medicare/health fund billing — all while complying with Australian healthcare privacy requirements.",
        approach: [
            "Researched Australian healthcare compliance requirements (privacy, Medicare, health funds)",
            "Designed a patient-friendly online booking experience",
            "Built practitioner dashboards optimised for their specific workflows",
            "Implemented secure data handling that meets Australian Privacy Principles",
        ],
        solution:
            "I built a custom clinic management system that puts patients first. They can book appointments online, fill out intake forms before their visit, and receive automated reminders. Practitioners have a streamlined dashboard for managing their day, accessing patient notes, and processing payments. The system integrates with Medicare and major health funds for seamless billing.",
        results: [
            "Reduced no-shows by 35% through automated SMS reminders",
            "Cut reception time per booking from 5 minutes to under 1 minute",
            "Improved patient satisfaction scores by 25%",
            "Enabled the practice to expand services without hiring additional admin staff",
        ],
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Twilio", "Medicare Integration"],
    },
];

/**
 * Generate static params for all case studies.
 */
export async function generateStaticParams() {
    return caseStudies.map((study) => ({
        slug: study.slug,
    }));
}

/**
 * Generate metadata for individual case study pages.
 */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const study = caseStudies.find((s) => s.slug === slug);

    if (!study) {
        return {
            title: "Case Study Not Found",
        };
    }

    return {
        title: `${study.title} | Case Study`,
        description: study.description,
        openGraph: {
            title: `${study.title} | Julian Delgado Case Study`,
            description: study.description,
            type: "article",
            url: `https://juliandelgado.com.au/case-studies/${study.slug}`,
            images: [study.image],
        },
        alternates: {
            canonical: `https://juliandelgado.com.au/case-studies/${study.slug}`,
        },
    };
}

export default async function CaseStudyPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const study = caseStudies.find((s) => s.slug === slug);

    if (!study) {
        notFound();
    }

    // Find next and previous case studies for navigation
    const currentIndex = caseStudies.findIndex((s) => s.slug === slug);
    const prevStudy = currentIndex > 0 ? caseStudies[currentIndex - 1] : null;
    const nextStudy = currentIndex < caseStudies.length - 1 ? caseStudies[currentIndex + 1] : null;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
            <Header />

            <main className="pt-24">
                {/* Hero */}
                <section className="py-12 md:py-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <Link
                            href="/case-studies"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            All case studies
                        </Link>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                                        {study.category}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {study.client}
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                    {study.title}
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    {study.description}
                                </p>
                            </div>

                            <div className="rounded-3xl overflow-hidden relative aspect-video">
                                <Image
                                    src={study.image}
                                    alt={study.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Challenge */}
                <section className="py-12 bg-muted/20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-3xl">
                            <h2 className="text-2xl font-bold mb-6">The Challenge</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {study.challenge}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Approach */}
                <section className="py-12">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-3xl">
                            <h2 className="text-2xl font-bold mb-6">The Approach</h2>
                            <ul className="space-y-4">
                                {study.approach.map((item, index) => (
                                    <li key={index} className="flex items-start gap-4">
                                        <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                                        <span className="text-muted-foreground leading-relaxed">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Solution */}
                <section className="py-12 bg-muted/20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-3xl">
                            <h2 className="text-2xl font-bold mb-6">The Solution</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                {study.solution}
                            </p>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Technologies Used</h3>
                                <div className="flex flex-wrap gap-2">
                                    {study.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-2 rounded-full bg-background border border-border text-sm font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Results */}
                <section className="py-12">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-3xl">
                            <h2 className="text-2xl font-bold mb-6">The Results</h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {study.results.map((result, index) => (
                                    <div
                                        key={index}
                                        className="p-6 rounded-2xl border border-border bg-card"
                                    >
                                        <CheckCircle2 className="h-6 w-6 text-secondary mb-3" />
                                        <p className="text-muted-foreground">{result}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonial */}
                {study.testimonial && (
                    <section className="py-12 bg-foreground text-background">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="max-w-3xl mx-auto text-center">
                                <blockquote className="text-2xl md:text-3xl font-serif italic mb-6 leading-relaxed">
                                    &ldquo;{study.testimonial.quote}&rdquo;
                                </blockquote>
                                <div>
                                    <p className="font-semibold">{study.testimonial.author}</p>
                                    <p className="text-muted-foreground/80">{study.testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Navigation */}
                <section className="py-12 border-t border-border">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col sm:flex-row justify-between gap-6">
                            {prevStudy ? (
                                <Link
                                    href={`/case-studies/${prevStudy.slug}`}
                                    className="group flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-secondary/50 transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-secondary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Previous</p>
                                        <p className="font-medium group-hover:text-secondary">
                                            {prevStudy.title}
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <div />
                            )}

                            {nextStudy ? (
                                <Link
                                    href={`/case-studies/${nextStudy.slug}`}
                                    className="group flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-secondary/50 transition-colors text-right"
                                >
                                    <div>
                                        <p className="text-xs text-muted-foreground">Next</p>
                                        <p className="font-medium group-hover:text-secondary">
                                            {nextStudy.title}
                                        </p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-secondary" />
                                </Link>
                            ) : (
                                <div />
                            )}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-muted/30">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to build something similar?
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            Let&apos;s discuss your project and how I can help you achieve similar results for your Australian business.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/#contact"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/90 transition-colors"
                            >
                                Start a conversation
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/#services"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border font-medium hover:border-secondary/50 transition-colors"
                            >
                                View services
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
