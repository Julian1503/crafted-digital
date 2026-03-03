import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCaseStudyBySlug, getPublishedCaseStudies } from "@/lib/services/case-studies";
import { toCaseStudyDetailProps } from "@/lib/mappers/case-study.mapper";

export const revalidate = 60;

export async function generateStaticParams() {
    const studies = await getPublishedCaseStudies();
    return studies.map((study) => ({
        slug: study.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    try {
        const raw = await getCaseStudyBySlug(slug);
        const study = toCaseStudyDetailProps(raw);

        if (!study) {
            return { title: "Case Study Not Found" };
        }

        return {
            title: `${study.title} | Case Study`,
            description: study.description,
            openGraph: {
                title: `${study.title} | Julian Delgado Case Study`,
                description: study.description,
                type: "article",
                url: `https://juliandelgado.com.au/case-studies/${study.slug}`,
                images: study.image ? [study.image] : [],
            },
            alternates: {
                canonical: `https://juliandelgado.com.au/case-studies/${study.slug}`,
            },
        };
    } catch {
        return { title: "Case Study Not Found" };
    }
}

export default async function CaseStudyPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    let raw;
    try {
        raw = await getCaseStudyBySlug(slug);
    } catch {
        notFound();
    }

    const study = toCaseStudyDetailProps(raw);
    if (!study) {
        notFound();
    }

    // Get all published studies for prev/next navigation
    const allStudies = await getPublishedCaseStudies();
    const currentIndex = allStudies.findIndex((s) => s.slug === slug);
    const prevStudy = currentIndex > 0 ? allStudies[currentIndex - 1] : null;
    const nextStudy = currentIndex < allStudies.length - 1 ? allStudies[currentIndex + 1] : null;

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
                                    <p className="text-background/70">{study.testimonial.role}</p>
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
