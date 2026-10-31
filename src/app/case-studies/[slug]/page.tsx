/**
 * app/case-studies/[slug]/page.tsx
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { cache } from "react";
import { getPublishedCaseStudyBySlug, getPublishedCaseStudies } from "@/lib/services/case-studies";
import { SkipLink } from "@/components/ui/skip-link";
import { toStudyData } from "@/lib/mappers/case-study.mappers";
import { CaseStudyView } from "@/components/sections/Case-study/CaseStudyView";
import { safeJsonLd } from "@/lib/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/ui/breadcrumbs";
import { BUSINESS_ID, PERSON_ID } from "@/components/seo/StructuredData";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/constants/site";
import type { StudyData } from "@/components/sections/Case-study/case-study.types";

export const revalidate = 60;

// Deduplicate the two reads (metadata + page) within one request.
const loadStudy = cache(async (slug: string) => {
    const raw = await getPublishedCaseStudyBySlug(slug);
    return raw ? toStudyData(raw) : null;
});
const loadPublished = cache(() => getPublishedCaseStudies());

export async function generateStaticParams() {
    try {
        const studies = await getPublishedCaseStudies();
        return studies.map((s) => ({ slug: s.slug }));
    } catch (error: unknown) {
        // No DB at build time: render on demand instead of failing the build.
        console.error("[case-studies] generateStaticParams skipped", error instanceof Error ? error.message : error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const study = await loadStudy(slug);
    if (!study) return { title: "Case study not found", robots: { index: false } };
    return {
        title: `${study.title}: case study`,
        description: study.description,
        openGraph: {
            title: `${study.title} | Julian Delgado`, description: study.description,
            type: "article", url: `${SITE_URL}/case-studies/${study.slug}`,
            images: study.image ? [study.image] : [DEFAULT_OG_IMAGE],
            publishedTime: study.publishedAt,
            modifiedTime: study.updatedAt,
            authors: [`${SITE_URL}/about-me`],
        },
        alternates: { canonical: `${SITE_URL}/case-studies/${study.slug}` },
    };
}

function articleJsonLd(study: StudyData) {
    const url = `${SITE_URL}/case-studies/${study.slug}`;
    const image = study.image ? (study.image.startsWith("/") ? `${SITE_URL}${study.image}` : study.image) : undefined;
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${url}#article`,
        headline: study.title,
        description: study.description,
        image: image ? [image] : undefined,
        url,
        mainEntityOfPage: url,
        inLanguage: "en-AU",
        author: { "@id": PERSON_ID },
        publisher: { "@id": BUSINESS_ID },
        datePublished: study.publishedAt,
        dateModified: study.updatedAt ?? study.publishedAt,
        about: study.client ? { "@type": "Organization", name: study.client } : undefined,
        keywords: [study.category, ...study.technologies].filter(Boolean).join(", "),
    };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [study, all] = await Promise.all([loadStudy(slug), loadPublished()]);
    if (!study) notFound();

    const idx          = all.findIndex((s) => s.slug === slug);
    const prevStudy    = idx > 0 ? all[idx - 1] : null;
    const nextStudy    = idx < all.length - 1 ? all[idx + 1] : null;

    return (
        <div className="min-h-screen bg-[#0c0c0c] font-sans selection:bg-white/10">
            <SkipLink />
            <Header />
            <main id="main-content">
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd(study)) }} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: safeJsonLd(breadcrumbJsonLd([
                            { name: "Home", href: "/" },
                            { name: "Case studies", href: "/case-studies" },
                            { name: study.title, href: `/case-studies/${study.slug}` },
                        ])),
                    }}
                />
                <CaseStudyView study={study} prevStudy={prevStudy ?? null} nextStudy={nextStudy ?? null} />
            </main>
            <Footer />
        </div>
    );
}