import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { ReactNode } from "react";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/services/blog";
import { toBlogCardProps } from "@/lib/mappers/blog.mapper";
import { formatDate } from "@/lib/utils/date";

export const revalidate = 60;

export async function generateStaticParams() {
    const posts = await getPublishedBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    try {
        const post = await getBlogPostBySlug(slug);
        const mapped = toBlogCardProps(post);

        return {
            title: post.title,
            description: post.excerpt ?? mapped.excerpt,
            authors: [{ name: mapped.author }],
            openGraph: {
                title: post.title,
                description: post.excerpt ?? mapped.excerpt,
                type: "article",
                url: `https://juliandelgado.com.au/blog/${post.slug}`,
                publishedTime: mapped.publishedAt,
                authors: [mapped.author],
                ...(post.coverImage ? { images: [post.coverImage] } : {}),
            },
            alternates: {
                canonical: `https://juliandelgado.com.au/blog/${post.slug}`,
            },
        };
    } catch {
        return {
            title: "Blog Post Not Found",
        };
    }
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    let post;
    try {
        post = await getBlogPostBySlug(slug);
    } catch {
        notFound();
    }

    const mapped = toBlogCardProps(post);

    // Get all published posts for prev/next navigation
    const allPosts = await getPublishedBlogPosts();
    const currentIndex = allPosts.findIndex((p) => p.slug === slug);
    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    const canonicalUrl = `https://juliandelgado.com.au/blog/${post.slug}`;
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: mapped.publishedAt,
        author: {
            "@type": "Person",
            name: mapped.author,
        },
        publisher: {
            "@type": "Person",
            name: "Julian Delgado",
            url: "https://juliandelgado.com.au",
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonicalUrl,
        },
    };

    const renderContent = () => {
        const elements: ReactNode[] = [];
        let listItems: string[] = [];
        let listStartIndex = 0;
        const paragraphs = post.content.split("\n").filter((line: string) => line.trim() !== "");

        const flushList = (keyIndex: number) => {
            if (!listItems.length) return;
            elements.push(
                <ul
                    key={`list-${keyIndex}`}
                    className="list-disc pl-6 mb-4 text-muted-foreground"
                >
                    {listItems.map((item, itemIndex) => (
                        <li key={`list-${keyIndex}-item-${itemIndex}`}>{item}</li>
                    ))}
                </ul>
            );
            listItems = [];
        };

        paragraphs.forEach((paragraph: string, index: number) => {
            if (paragraph.startsWith("- ")) {
                if (!listItems.length) {
                    listStartIndex = index;
                }
                listItems.push(paragraph.replace("- ", ""));
                return;
            }

            flushList(listStartIndex);

            if (paragraph.startsWith("## ")) {
                elements.push(
                    <h2 key={index} className="text-2xl font-bold mt-10 mb-4 text-foreground">
                        {paragraph.replace("## ", "")}
                    </h2>
                );
                return;
            }

            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                elements.push(
                    <h3 key={index} className="text-xl font-semibold mt-6 mb-2 text-foreground">
                        {paragraph.replace(/\*\*/g, "")}
                    </h3>
                );
                return;
            }

            elements.push(
                <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                </p>
            );
        });

        flushList(listStartIndex);
        return elements;
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
            <Header />

            <main className="pt-24">
                {/* Article Header */}
                <article className="py-12 md:py-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-3xl mx-auto">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
                            >
                                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                                All articles
                            </Link>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                                    {mapped.category}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" aria-hidden="true" />
                                    {mapped.readTime}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                {post.title}
                            </h1>

                            <p className="text-xl text-muted-foreground mb-8">
                                {post.excerpt}
                            </p>

                            {/* Author and date */}
                            <div className="flex items-center gap-6 pb-8 border-b border-border mb-8">
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                    <span className="font-medium">{mapped.author}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-5 w-5" aria-hidden="true"/>
                                    <time dateTime={mapped.publishedAt}>
                                        {formatDate(mapped.publishedAt)}
                                    </time>
                                </div>
                            </div>

                            {/* Article content */}
                            <div className="prose prose-lg max-w-none">
                                {renderContent()}
                            </div>

                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
                            />
                        </div>
                    </div>
                </article>

                {/* Navigation */}
                <section className="py-12 border-t border-border">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between gap-6">
                            {prevPost ? (
                                <Link
                                    href={`/blog/${prevPost.slug}`}
                                    className="group flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-secondary/50 transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-secondary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Previous</p>
                                        <p className="font-medium group-hover:text-secondary line-clamp-1">
                                            {prevPost.title}
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <div />
                            )}

                            {nextPost ? (
                                <Link
                                    href={`/blog/${nextPost.slug}`}
                                    className="group flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-secondary/50 transition-colors text-right"
                                >
                                    <div>
                                        <p className="text-xs text-muted-foreground">Next</p>
                                        <p className="font-medium group-hover:text-secondary line-clamp-1">
                                            {nextPost.title}
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
                            Need help with your website?
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            I help Australian service businesses build websites that convert. Let&apos;s chat about your project.
                        </p>
                        <Link
                            href="/#contact"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/90 transition-colors"
                        >
                            Get in touch
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
