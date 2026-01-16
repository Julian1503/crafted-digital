import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/ui/skip-link";
import {blogPosts} from "@/components/sections/Blog/blog-data";
import BlogCard from "@/components/sections/Blog/BlogCard";

export const metadata: Metadata = {
    title: "Blog | Web Development Tips for Australian Businesses",
    description:
        "Practical web development insights, guides, and tips for Australian service businesses. Learn how to build better websites, improve SEO, and grow your online presence.",
    openGraph: {
        title: "Blog | Web Development Tips for Australian Businesses",
        description:
            "Practical web development insights and guides for Australian service businesses.",
        type: "website",
        url: "https://juliandelgado.com.au/blog",
    },
    alternates: {
        canonical: "https://juliandelgado.com.au/blog",
    },
};

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
            <SkipLink />
            <Header />

            <main id="main-content" className="pt-24">
                <section className="py-16 md:py-24" aria-labelledby="blog-heading">
                    <div className="container mx-auto px-4 md:px-6">
                        {/* Header */}
                        <div className="max-w-3xl mb-16">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                            >
                                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                                Back to homepage
                            </Link>

                            <h1 id="blog-heading" className="text-4xl md:text-5xl font-bold mb-6">
                                Web Development Blog
                            </h1>

                            <p className="text-xl text-muted-foreground">
                                Practical insights, guides, and tips for Australian service businesses looking to
                                improve their online presence. Written by Julian Delgado, based in Toowoomba, QLD.
                            </p>
                        </div>

                        {/* Blog posts grid */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {blogPosts.length === 0 ? (
                                <div
                                    className="grid col-span-2 m-auto w-full border border-border bg-card px-4 py-3 rounded-lg"
                                    role="alert"
                                >
                                    <p className="text-xl text-muted-foreground" aria-live="polite" aria-atomic="true">
                                        No blog posts found.
                                    </p>
                                </div>
                            ) : (
                                blogPosts.map((post) => (
                                    <BlogCard key={post.title} post={ post } />
                                ))
                            )}
                        </div>

                        {/* CTA */}
                        <div className="mt-16 text-center">
                            <p
                                className="text-muted-foreground mb-4"
                                aria-live="polite"
                                aria-atomic="true"
                                aria-relevant="additions"
                            >
                                Need help with your website project?
                            </p>

                            <Link
                                href="/#contact"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/90 transition-colors"
                            >
                                Get in touch
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
