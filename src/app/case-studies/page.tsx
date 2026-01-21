import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/ui/skip-link";
import {CaseStudyCard} from "@/components/sections/Case-study/CaseStudyCard";
import {caseStudies} from "@/components/sections/Case-study/case-study.data";

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

export default function CaseStudiesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
            <SkipLink />
            <Header />

            <main id="main-content" className="pt-24">
                <section className="py-16 md:py-24" aria-labelledby="case-studies-heading">
                    <div className="container mx-auto px-4 md:px-6">
                        {/* Header */}
                        <div className="max-w-3xl mb-16">
                            <Link
                                href="/#work"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                            >
                                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                                Back to homepage
                            </Link>
                            <h1 id="case-studies-heading" className="text-4xl md:text-5xl font-bold mb-6">
                                Case Studies
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Real examples of web development and software projects I&apos;ve delivered for Australian businesses. Each case study shows the problem, approach, and results.
                            </p>
                        </div>

                        {/* Case study grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {caseStudies.map((study) => (
                                <CaseStudyCard study={ study } key={study.slug}/>
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