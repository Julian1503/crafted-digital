import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Case Studies | Web Development Projects for Australian Businesses",
    description:
        "Explore real examples of web development and software projects delivered for Australian businesses. See how Julian Delgado helps service businesses build digital products that convert.",
    openGraph: {
        title: "Case Studies | Web Development Projects for Australian Businesses",
        description:
            "Real examples of web development projects delivered for Australian service businesses.",
        type: "website",
        url: "https://juliandelgado.com.au/case-studies",
    },
    alternates: {
        canonical: "https://juliandelgado.com.au/case-studies",
    },
};

/**
 * Case study preview data for the listing page.
 */
const caseStudies = [
    {
        slug: "ai-contract-automation",
        title: "AI-Powered Contract Automation",
        client: "Legal Tech Startup",
        category: "AI / Automation",
        description:
            "Automating contract interpretation and memo drafting — cutting hours of manual work down to minutes for Australian legal professionals.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    },
    {
        slug: "tradie-booking-platform",
        title: "Tradie Booking Platform",
        client: "Queensland Trade Services",
        category: "Web Application",
        description:
            "A custom booking and job management platform built for a growing Queensland trade services business, streamlining operations and improving customer experience.",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
    },
    {
        slug: "clinic-management-system",
        title: "Clinic Management System",
        client: "Allied Health Practice",
        category: "Healthcare / SaaS",
        description:
            "A modern patient management system for an Australian allied health practice, featuring online booking, patient records, and billing integration.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800",
    },
];

export default function CaseStudiesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
            <Header />

            <main className="pt-24">
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        {/* Header */}
                        <div className="max-w-3xl mb-16">
                            <Link
                                href="/#work"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to homepage
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Case Studies
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Real examples of web development and software projects I&apos;ve delivered for Australian businesses. Each case study shows the problem, approach, and results.
                            </p>
                        </div>

                        {/* Case study grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {caseStudies.map((study) => (
                                <Link
                                    key={study.slug}
                                    href={`/case-studies/${study.slug}`}
                                    className="group rounded-3xl border border-border bg-card overflow-hidden transition-all hover:shadow-xl hover:border-secondary/50"
                                >
                                    <div className="aspect-video relative overflow-hidden">
                                        <Image
                                            src={study.image}
                                            alt={study.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 rounded-full bg-background/90 text-xs font-medium">
                                                {study.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                            {study.client}
                                        </p>
                                        <h2 className="text-xl font-semibold mb-3 group-hover:text-secondary transition-colors">
                                            {study.title}
                                        </h2>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {study.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-16 text-center">
                            <p className="text-muted-foreground mb-4">
                                Ready to create your own success story?
                            </p>
                            <Link
                                href="/#contact"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/90 transition-colors"
                            >
                                Start your project
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
