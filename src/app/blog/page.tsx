import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/ui/skip-link";

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

/**
 * Blog post preview data.
 */
interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    publishedAt: string;
    author: string;
}

const blogPosts: BlogPost[] = [
    {
        slug: "why-australian-businesses-need-custom-websites",
        title: "Why Australian Service Businesses Need Custom Websites in 2025",
        excerpt:
            "Template websites might seem cheaper, but they often cost Australian businesses more in lost leads and poor performance. Here's why custom development pays off.",
        category: "Business Strategy",
        readTime: "5 min read",
        publishedAt: "2024-12-15",
        author: "Julian Delgado",
    },
    {
        slug: "nextjs-vs-wordpress-for-australian-businesses",
        title: "Next.js vs WordPress: Which Is Better for Australian Businesses?",
        excerpt:
            "Comparing the two most popular approaches to web development for Australian service businesses. Performance, SEO, and maintenance considerations.",
        category: "Technology",
        readTime: "7 min read",
        publishedAt: "2024-12-10",
        author: "Julian Delgado",
    },
    {
        slug: "how-to-improve-website-speed-for-australian-hosting",
        title: "How to Improve Website Speed for Australian Visitors",
        excerpt:
            "Practical tips for optimising your website performance for Australian users, including hosting choices, image optimisation, and Core Web Vitals.",
        category: "Performance",
        readTime: "6 min read",
        publishedAt: "2024-12-05",
        author: "Julian Delgado",
    },
    {
        slug: "seo-basics-for-tradies-and-service-businesses",
        title: "SEO Basics for Tradies and Australian Service Businesses",
        excerpt:
            "A practical guide to local SEO for Australian tradies, consultants, and service providers. Get found by customers in your area.",
        category: "SEO",
        readTime: "8 min read",
        publishedAt: "2024-11-28",
        author: "Julian Delgado",
    },
];

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-AU", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

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
                                Practical insights, guides, and tips for Australian service businesses looking to improve their online presence. Written by Julian Delgado, based in Toowoomba, QLD.
                            </p>
                        </div>

                        {/* Blog posts grid */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {blogPosts.map((post) => (
                                <article
                                    key={post.slug}
                                    className="group rounded-3xl border border-border bg-card overflow-hidden transition-all hover:shadow-xl hover:border-secondary/50"
                                >
                                    <Link href={`/blog/${post.slug}`} className="block p-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                                                {post.category}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {post.readTime}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-semibold mb-3 group-hover:text-secondary transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {post.author}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(post.publishedAt)}
                                            </span>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-16 text-center">
                            <p className="text-muted-foreground mb-4">
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
