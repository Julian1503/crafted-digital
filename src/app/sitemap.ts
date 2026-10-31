import type { MetadataRoute } from "next";
import { getPublishedCaseStudies } from "@/lib/services/case-studies";
import { getPublishedBlogPosts } from "@/lib/services/blog";
import { SITE_URL } from "@/lib/constants/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        { url: SITE_URL,                  lastModified: now, changeFrequency: "weekly",  priority: 1 },
        { url: `${SITE_URL}/services`,    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        { url: `${SITE_URL}/services/websites`,        lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        { url: `${SITE_URL}/services/custom-software`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        { url: `${SITE_URL}/pricing`,     lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        { url: `${SITE_URL}/about-me`,    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
        { url: `${SITE_URL}/case-studies`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${SITE_URL}/contact`,     lastModified: now, changeFrequency: "yearly",  priority: 0.8 },
        { url: `${SITE_URL}/privacy`,     lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
        { url: `${SITE_URL}/terms`,       lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    ];

    // No try/catch: if the database is down the error propagates and ISR keeps
    // serving the last good sitemap instead of publishing a truncated one.
    const [studies, posts] = await Promise.all([getPublishedCaseStudies(), getPublishedBlogPosts()]);

    const caseStudyPages: MetadataRoute.Sitemap = studies.map((s) => ({
        url: `${SITE_URL}/case-studies/${s.slug}`,
        lastModified: s.updatedAt ?? s.publishedAt ?? now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    const blogPages: MetadataRoute.Sitemap = posts.length > 0
        ? [
            { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
            ...posts.map((p) => ({
                url: `${SITE_URL}/blog/${p.slug}`,
                lastModified: p.updatedAt ?? p.publishedAt ?? now,
                changeFrequency: "monthly" as const,
                priority: 0.6,
            })),
        ]
        : [];

    return [...staticPages, ...caseStudyPages, ...blogPages];
}
