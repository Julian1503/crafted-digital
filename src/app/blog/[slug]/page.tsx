import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Blog post data structure.
 */
interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    publishedAt: string;
    author: string;
    content: string[];
    relatedServices: string[];
    relatedCaseStudies?: string[];
}

/**
 * Full blog post data with content.
 */
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
        content: [
            "When Australian service businesses consider their online presence, the first question is often: 'Should I use a template or get something custom built?' It's a fair question—templates are quick and cheap. But for businesses serious about growth, custom development almost always delivers better returns.",

            "## The Hidden Costs of Template Websites",

            "Template websites from platforms like Wix, Squarespace, or even WordPress themes might cost a few hundred dollars upfront. But the real costs emerge over time:",

            "**Performance penalties**: Templates are built to work for everyone, which means they include code you don't need. This bloats page load times—critical when 53% of mobile users abandon sites that take longer than 3 seconds to load.",

            "**SEO limitations**: Many templates have poor semantic HTML structure, limited schema markup options, and rigid URL structures. These technical SEO issues compound over time, making it harder to rank in Australian search results.",

            "**Conversion problems**: Generic designs don't account for your specific customer journey. A tradie in Brisbane has different needs than a consultant in Melbourne. Templates can't optimise for these nuances.",

            "## What Custom Development Delivers",

            "A custom website built for your Australian service business addresses these issues directly:",

            "**Tailored user experience**: Every page, every button, every form is designed around how your customers actually behave. This means higher conversion rates and more enquiries.",

            "**Technical excellence**: Clean, performant code that loads fast on Australian networks. Proper semantic HTML that search engines love. Schema markup that helps you appear in rich search results.",

            "**Scalability**: As your business grows, your website can grow with it. Add new services, expand to new locations, integrate with your booking system—without the constraints of a template.",

            "## The Investment Perspective",

            "Yes, custom development costs more upfront—typically starting from $3,000 AUD for a solid business website. But consider the maths:",

            "If your average customer is worth $500 to your business, and a better website converts just 2 more leads per month, that's $12,000 per year in additional revenue. The ROI becomes clear quickly.",

            "## Getting Started",

            "If you're an Australian service business—whether you're a tradie in Queensland, a consultant in Sydney, or a clinic in Perth—a custom website is an investment in sustainable growth.",

            "The key is working with a developer who understands both the technical requirements and the Australian market. Someone who can translate your business goals into a digital experience that actually converts.",
        ],
        relatedServices: ["Custom Websites & Web Apps", "Product Design & UX"],
        relatedCaseStudies: ["tradie-booking-platform"],
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
        content: [
            "If you're building a new website for your Australian business, you've probably heard of both WordPress and Next.js. They represent two fundamentally different approaches to web development, and choosing the right one can significantly impact your online success.",

            "## WordPress: The Familiar Choice",

            "WordPress powers about 40% of all websites globally. It's been around since 2003 and has a massive ecosystem of themes and plugins.",

            "**Pros:**",
            "- Familiar interface for content editing",
            "- Huge library of plugins for added functionality",
            "- Lower upfront development costs for basic sites",
            "- Easy to find WordPress developers",

            "**Cons:**",
            "- Performance issues—WordPress sites are often slow without significant optimisation",
            "- Security vulnerabilities—plugins and themes need constant updates",
            "- Limited flexibility for custom functionality",
            "- Monthly hosting and plugin costs add up",

            "## Next.js: The Modern Alternative",

            "Next.js is a React-based framework that's become the go-to choice for performance-focused web development. It's what I use for most Australian business projects.",

            "**Pros:**",
            "- Exceptional performance out of the box",
            "- Built-in SEO optimisation features",
            "- Highly customisable—no limitations on design or functionality",
            "- Lower ongoing costs once built",
            "- Better security—no database vulnerabilities from plugins",

            "**Cons:**",
            "- Higher upfront development investment",
            "- Requires a developer for content changes (unless you add a headless CMS)",
            "- Smaller pool of specialised developers",

            "## Performance Comparison",

            "In real-world testing, Next.js sites consistently outperform WordPress on Core Web Vitals—Google's key metrics for user experience and SEO:",

            "- **LCP (Largest Contentful Paint)**: Next.js sites typically load 40-60% faster",
            "- **CLS (Cumulative Layout Shift)**: Better layout stability with Next.js",
            "- **INP (Interaction to Next Paint)**: More responsive interactions",

            "For Australian businesses targeting local SEO, these performance advantages translate directly to better search rankings.",

            "## Which Should You Choose?",

            "**Choose WordPress if:**",
            "- You have a very limited budget (under $2,000 AUD)",
            "- You need to update content daily yourself",
            "- You're building a blog-heavy content site",

            "**Choose Next.js if:**",
            "- Performance and SEO are priorities",
            "- You want a custom, professional design",
            "- You're building something more than a basic brochure site",
            "- You value long-term cost efficiency over upfront savings",

            "## My Recommendation for Australian Service Businesses",

            "For most Australian service businesses—tradies, consultants, clinics, agencies—I recommend Next.js. The upfront investment is higher, but you get a faster, more secure, and more effective website that serves your business for years.",

            "The key is finding a developer who can make the technology invisible. You shouldn't need to understand React to have a conversation about your website. That's where working with an experienced developer who specialises in Australian business websites makes the difference.",
        ],
        relatedServices: ["Custom Websites & Web Apps", "MVP Development"],
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
        content: [
            "Website speed isn't just about user experience—it directly impacts your search rankings and conversion rates. For Australian businesses targeting local customers, performance optimisation is essential.",

            "## Why Speed Matters for Australian Websites",

            "Australia's geographic isolation creates unique challenges. When your website is hosted overseas, data has to travel thousands of kilometres, adding latency that users feel as slowness.",

            "Research shows that:",
            "- 53% of mobile users abandon sites taking more than 3 seconds to load",
            "- A 1-second delay in page load can reduce conversions by 7%",
            "- Google uses page speed as a ranking factor, particularly for mobile searches",

            "## Step 1: Choose Australian Hosting",

            "The single biggest improvement you can make is hosting your website in Australia. Options include:",

            "- **Vercel**: Offers edge nodes in Sydney for Next.js sites",
            "- **AWS Sydney Region**: Enterprise-grade hosting locally",
            "- **DigitalOcean Sydney**: Good value VPS hosting",
            "- **Australian web hosts**: VentraIP, Crucial, etc. for WordPress",

            "Moving from US-based hosting to Australian hosting typically reduces latency by 150-200ms—noticeable for every user.",

            "## Step 2: Optimise Images",

            "Images are usually the largest files on any webpage. Proper optimisation can reduce page weight by 50-80%:",

            "- Use modern formats (WebP, AVIF) instead of JPEG/PNG",
            "- Resize images to the actual display size",
            "- Implement lazy loading for below-the-fold images",
            "- Use responsive images with srcset",

            "In Next.js, the built-in Image component handles most of this automatically.",

            "## Step 3: Minimise Third-Party Scripts",

            "Every external script adds load time. Audit your site for:",

            "- Analytics tools (do you need both Google Analytics and Hotjar?)",
            "- Chat widgets (consider loading them after page load)",
            "- Social media embeds (use static images as previews)",
            "- Font files (limit to 2-3 weights maximum)",

            "## Step 4: Implement Caching",

            "Proper caching ensures returning visitors get near-instant loads:",

            "- Set appropriate cache headers for static assets",
            "- Use a CDN with edge caching",
            "- Implement service workers for offline support",

            "## Step 5: Monitor Core Web Vitals",

            "Google's Core Web Vitals are the metrics that matter most:",

            "- **LCP (Largest Contentful Paint)**: Should be under 2.5 seconds",
            "- **INP (Interaction to Next Paint)**: Should be under 200ms",
            "- **CLS (Cumulative Layout Shift)**: Should be under 0.1",

            "Use Google PageSpeed Insights or Web Vitals extension to monitor these regularly.",

            "## The Business Impact",

            "For Australian service businesses, every improvement in speed means more enquiries. A website that loads in 2 seconds instead of 5 seconds will convert significantly more visitors into leads.",

            "If your current website is slow, consider whether optimisation is enough or if a rebuild with performance as a core requirement would serve you better long-term.",
        ],
        relatedServices: ["Custom Websites & Web Apps"],
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
        content: [
            "If you're a tradie, consultant, or service provider in Australia, you don't need complex SEO strategies. You need practical, local-focused tactics that get you found by customers in your area.",

            "## What Is Local SEO?",

            "Local SEO is about appearing in search results when people look for services near them. When someone searches 'plumber Brisbane' or 'accountant Toowoomba', Google shows a mix of map results and website listings. Local SEO gets you into those results.",

            "## Step 1: Claim Your Google Business Profile",

            "This is the most important thing you can do for local SEO. Your Google Business Profile (formerly Google My Business) is what appears in map searches and the local pack.",

            "**Key optimisations:**",
            "- Verify your business (Google will send a postcard or call)",
            "- Add accurate business hours",
            "- Write a keyword-rich description of your services",
            "- Add photos of your work, team, and premises",
            "- Choose the right categories for your business",
            "- Enable messaging and booking if appropriate",

            "## Step 2: Get Your NAP Consistent",

            "NAP stands for Name, Address, Phone number. These details need to be identical everywhere they appear online:",

            "- Your website",
            "- Google Business Profile",
            "- Social media profiles",
            "- Business directories (Yellow Pages, True Local, etc.)",

            "Inconsistent NAP confuses Google and hurts your rankings.",

            "## Step 3: Optimise Your Website for Local Search",

            "Your website should clearly signal where you operate:",

            "- Include your location in title tags (e.g., 'Electrician Toowoomba | Your Business Name')",
            "- Add your service area to your homepage content",
            "- Create location-specific pages if you serve multiple areas",
            "- Embed a Google Map on your contact page",
            "- Include your full address in the footer",

            "## Step 4: Collect and Respond to Reviews",

            "Reviews are crucial for local SEO. Google uses them as a ranking factor, and customers use them to choose between competitors.",

            "**Tips:**",
            "- Ask happy customers for Google reviews (after completing a job)",
            "- Make it easy—send them a direct link",
            "- Respond to all reviews, positive and negative",
            "- Never fake reviews—Google can detect this",

            "## Step 5: Build Local Citations",

            "Citations are mentions of your business on other websites. Key Australian directories include:",

            "- Yellow Pages Australia",
            "- True Local",
            "- Yelp Australia",
            "- HiPages (for trades)",
            "- Industry-specific directories",

            "## Step 6: Create Locally-Focused Content",

            "Blog posts and pages that reference local areas help Google understand your relevance:",

            "- 'Guide to [Your Service] in [City]'",
            "- 'Common [Industry] Problems in [Region]'",
            "- Case studies featuring local clients",

            "## The Long Game",

            "Local SEO isn't instant. It typically takes 3-6 months to see significant improvements. But the leads that come from organic search are high-quality—people actively looking for your services.",

            "For most Australian service businesses, local SEO combined with a well-built website is the most cost-effective marketing strategy available. It's an investment that compounds over time.",
        ],
        relatedServices: ["Custom Websites & Web Apps"],
        relatedCaseStudies: ["tradie-booking-platform"],
    },
];

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-AU", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Generate static params for all blog posts.
 */
export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

/**
 * Generate metadata for individual blog post pages.
 */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: "Blog Post Not Found",
        };
    }

    return {
        title: post.title,
        description: post.excerpt,
        authors: [{ name: post.author }],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            url: `https://juliandelgado.com.au/blog/${post.slug}`,
            publishedTime: post.publishedAt,
            authors: [post.author],
        },
        alternates: {
            canonical: `https://juliandelgado.com.au/blog/${post.slug}`,
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    // Find next and previous posts
    const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
    const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

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
                                <ArrowLeft className="h-4 w-4" />
                                All articles
                            </Link>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                                    {post.category}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    {post.readTime}
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
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-5 w-5" />
                                    <time dateTime={post.publishedAt}>
                                        {formatDate(post.publishedAt)}
                                    </time>
                                </div>
                            </div>

                            {/* Article content */}
                            <div className="prose prose-lg max-w-none">
                                {post.content.map((paragraph, index) => {
                                    if (paragraph.startsWith("## ")) {
                                        return (
                                            <h2 key={index} className="text-2xl font-bold mt-10 mb-4 text-foreground">
                                                {paragraph.replace("## ", "")}
                                            </h2>
                                        );
                                    }
                                    if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                                        return (
                                            <p key={index} className="font-semibold text-foreground mb-2">
                                                {paragraph.replace(/\*\*/g, "")}
                                            </p>
                                        );
                                    }
                                    if (paragraph.startsWith("- ")) {
                                        return (
                                            <div key={index} className="flex items-start gap-2 text-muted-foreground mb-2 pl-4">
                                                <span className="text-secondary mt-1.5">•</span>
                                                <span>{paragraph.replace("- ", "")}</span>
                                            </div>
                                        );
                                    }
                                    return (
                                        <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                                            {paragraph}
                                        </p>
                                    );
                                })}
                            </div>

                            {/* Related content */}
                            <div className="mt-12 pt-8 border-t border-border">
                                <h3 className="text-lg font-semibold mb-4">Related Services</h3>
                                <div className="flex flex-wrap gap-3 mb-8">
                                    {post.relatedServices.map((service) => (
                                        <Link
                                            key={service}
                                            href="/#services"
                                            className="px-4 py-2 rounded-full border border-border hover:border-secondary/50 text-sm font-medium transition-colors"
                                        >
                                            {service}
                                        </Link>
                                    ))}
                                </div>

                                {post.relatedCaseStudies && post.relatedCaseStudies.length > 0 && (
                                    <>
                                        <h3 className="text-lg font-semibold mb-4">Related Case Studies</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {post.relatedCaseStudies.map((slug) => (
                                                <Link
                                                    key={slug}
                                                    href={`/case-studies/${slug}`}
                                                    className="px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium hover:bg-secondary/20 transition-colors"
                                                >
                                                    View case study →
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
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
