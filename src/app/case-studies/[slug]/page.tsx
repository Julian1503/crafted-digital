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
        title: `${study.title} | Case Study`,
        description: study.description,
        openGraph: {
            title: `${study.title} | Julian Delgado`, description: study.description,
            type: "article", url: `https://juliandelgado.com.au/case-studies/${study.slug}`,
            images: study.image ? [study.image] : [],
        },
        alternates: { canonical: `https://juliandelgado.com.au/case-studies/${study.slug}` },
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
                <CaseStudyView study={study} prevStudy={prevStudy ?? null} nextStudy={nextStudy ?? null} />
            </main>
            <Footer />
        </div>
    );
}