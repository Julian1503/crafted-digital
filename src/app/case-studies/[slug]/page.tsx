/**
 * app/case-studies/[slug]/page.tsx
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { getCaseStudyBySlug, getPublishedCaseStudies } from "@/lib/services/case-studies";
import { toCaseStudyDetailProps } from "@/lib/mappers/case-study.mapper";
import { CaseStudyView } from "@/components/sections/Case-study/CaseStudyView";

export const revalidate = 60;

export async function generateStaticParams() {
    const studies = await getPublishedCaseStudies();
    return studies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const study = toCaseStudyDetailProps(await getCaseStudyBySlug(slug));
        if (!study) return { title: "Case Study Not Found" };
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
    } catch { return { title: "Case Study Not Found" }; }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let raw;
    try { raw = await getCaseStudyBySlug(slug); } catch { notFound(); }
    const study = toCaseStudyDetailProps(raw);
    if (!study) notFound();

    const all          = await getPublishedCaseStudies();
    const idx          = all.findIndex((s) => s.slug === slug);
    const prevStudy    = idx > 0 ? all[idx - 1] : null;
    const nextStudy    = idx < all.length - 1 ? all[idx + 1] : null;

    return (
        <div className="min-h-screen bg-[#0c0c0c] font-sans selection:bg-white/10">
            <Header />
            <main id="main-content">
                <CaseStudyView study={study} prevStudy={prevStudy ?? null} nextStudy={nextStudy ?? null} />
            </main>
            <Footer />
        </div>
    );
}