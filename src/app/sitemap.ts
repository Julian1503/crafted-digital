import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://juliandelgado.com.au';

    // Case study slugs for dynamic sitemap entries
    const caseStudySlugs = [
        'ai-contract-automation',
        'tradie-booking-platform',
        'clinic-management-system',
    ];

    // Blog post slugs for dynamic sitemap entries
    const blogSlugs = [
        'why-australian-businesses-need-custom-websites',
        'nextjs-vs-wordpress-for-australian-businesses',
        'how-to-improve-website-speed-for-australian-hosting',
        'seo-basics-for-tradies-and-service-businesses',
    ];

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/about-me`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/case-studies`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ];

    const caseStudyPages: MetadataRoute.Sitemap = caseStudySlugs.map((slug) => ({
        url: `${baseUrl}/case-studies/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...caseStudyPages, ...blogPages];
}
