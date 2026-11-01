import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/constants/site";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { SkipLink } from "@/components/ui/skip-link";
import { getPublishedCaseStudies } from "@/lib/services/case-studies";
import { toCaseStudyCardProps } from "@/lib/mappers/case-study.mappers";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Case Studies: Custom Software, AI Automation and Websites",
    description:
        "Internal tools, CRMs, AI agents and websites built by Julian Delgado for Australian small businesses: the problem, the approach and what changed.",
    openGraph: {
        images: [DEFAULT_OG_IMAGE],
        title: "Case Studies | Julian Delgado",
        description:
            "Internal tools, CRMs, AI agents and websites built for Australian small businesses.",
        type: "website",
        url: "https://juliandelgado.com.au/case-studies",
    },
    alternates: {
        canonical: "https://juliandelgado.com.au/case-studies",
    },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface CaseStudyCardProps {
    slug: string;
    title: string;
    industry?: string;
    category?: string;
    year?: string | number;
    image?: string;
    description?: string;
    tags?: string[];
    stats?: { label: string; value: string }[];
}

// ─── Project row ──────────────────────────────────────────────────────────────
// Server component: text beside a related photo. Product screenshots are kept
// for the case study itself; here the photo sets the scene and the copy sells.

function ProjectRow({ study, index }: { study: CaseStudyCardProps; index: number }) {
    const href = `/case-studies/${study.slug}`;
    const flip = index % 2 === 1;

    return (
        <article className="group border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <Link
                href={href}
                className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-12 md:py-16 grid gap-8 lg:gap-16 lg:grid-cols-2 items-center rounded-sm"
            >
                {/* Photo */}
                <div className={`relative w-full overflow-hidden rounded-lg aspect-[4/3] ${flip ? "lg:order-2" : ""}`} style={{ background: "#141414" }}>
                    {study.image && (
                        <Image
                            src={study.image}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 600px, 100vw"
                            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                            priority={index < 2}
                        />
                    )}
                </div>

                {/* Copy */}
                <div className={flip ? "lg:order-1" : ""}>
                    <div className="flex items-center gap-3 mb-5">
                        <span className="font-mono text-[0.7rem] tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.6)" }}>
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="h-px w-5 shrink-0" style={{ background: "rgba(255,255,255,0.16)" }} aria-hidden="true" />
                        <span className="text-[0.7rem] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.72)" }}>
                            {study.category ?? "Project"}
                        </span>
                    </div>

                    <h2
                        className="font-serif font-normal leading-[1.02] tracking-[-0.03em] text-balance transition-colors duration-300"
                        style={{ fontSize: "clamp(1.9rem, 3.6vw, 3.2rem)", color: "rgba(255,255,255,0.92)", maxWidth: "18ch" }}
                    >
                        {study.title}
                    </h2>

                    {study.description && (
                        <p className="mt-5 text-[0.95rem] leading-[1.75] text-pretty max-w-[52ch]" style={{ color: "rgba(255,255,255,0.72)" }}>
                            {study.description}
                        </p>
                    )}

                    <span
                        className="mt-7 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.12em] uppercase transition-colors duration-300 group-hover:text-white"
                        style={{ color: "hsl(var(--hero-accent-light))" }}
                    >
                        Read the case study
                        <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                </div>
            </Link>
        </article>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CaseStudiesPage() {
    const studies  = await getPublishedCaseStudies();
    const caseStudies = studies.map(toCaseStudyCardProps) as CaseStudyCardProps[];

    return (
        <div className="min-h-screen bg-[#0c0c0c] text-white font-sans selection:bg-white/10">
            <SkipLink />
            <Header />

            <main id="main-content">

                {/* ── Page header ─────────────────────────────────────────── */}
                <div className="pt-32 pb-16 md:pt-40 md:pb-20 px-4 sm:px-6 md:px-8 mx-auto max-w-7xl">

                    {/* Back link */}
                    <Link
                        href="/#work"
                        className="inline-flex items-center gap-2 mb-10 transition-colors duration-200"
                        style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.72rem", letterSpacing: "0.08em" }}
                    >
                        <span aria-hidden="true" style={{ fontSize: "0.8rem" }}>←</span>
                        <span className="uppercase tracking-[0.15em] text-[0.7rem]">Back</span>
                    </Link>

                    {/* Section label */}
                    <div className="flex items-center gap-3 mb-8">
                        <span
                            className="font-mono text-[0.7rem] tracking-[0.25em] uppercase select-none"
                            style={{ color: "rgba(255,255,255,0.6)" }}
                        >
                            Work
                        </span>
                        <span className="h-px w-7 shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} aria-hidden="true" />
                        <span
                            className="font-mono text-[0.7rem] tracking-[0.2em] uppercase"
                            style={{ color: "rgba(255,255,255,0.6)" }}
                        >
                            {caseStudies.length} projects
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <h1
                            className="font-serif font-normal leading-[1.02] tracking-[-0.03em]"
                            style={{
                                fontSize: "clamp(2.8rem, 7vw, 6rem)",
                                color:    "rgba(255,255,255,0.9)",
                            }}
                            id="case-studies-heading"
                        >
                            Case studies
                        </h1>
                        <p
                            className="max-w-[38ch] text-[0.85rem] leading-relaxed md:text-right pb-2"
                            style={{ color: "rgba(255,255,255,0.62)" }}
                        >
                            Custom software, AI automation and websites I have built. Each one covers the problem, the approach and what changed.
                        </p>
                    </div>
                </div>

                {/* ── Filmstrip ────────────────────────────────────────────── */}
                <section
                    aria-labelledby="case-studies-heading"
                    className="border-t"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                    {caseStudies.map((study, i) => (
                        <ProjectRow key={study.slug} study={study} index={i} />
                    ))}
                </section>

                {/* ── CTA strip ────────────────────────────────────────────── */}
                <div
                    className="border-t px-4 sm:px-6 md:px-8 mx-auto max-w-7xl py-20 md:py-28 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
                    style={{ borderColor: "rgba(255,255,255,0.07)" }}
                >
                    <div>
                        <p
                            className="font-serif font-normal leading-[1.05] tracking-[-0.025em] mb-3"
                            style={{
                                fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
                                color:    "rgba(255,255,255,0.88)",
                            }}
                        >
                            Ready to be next?
                        </p>
                        <p
                            className="text-[0.82rem] leading-relaxed"
                            style={{ color: "rgba(255,255,255,0.66)", maxWidth: "40ch" }}
                        >
                            Let’s talk about your project — no commitment, just a 30 min call.
                        </p>
                    </div>

                    <Link
                        href="/contact"
                        className="group flex items-center gap-2.5 rounded-full font-medium shrink-0"
                        style={{
                            background:    "hsl(var(--hero-accent))",
                            color:         "#fff",
                            padding:       "0.85rem 1.8rem",
                            fontSize:      "0.74rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            transition:    "transform 0.2s, background 0.25s",
                        }}
                    >
                        Start your project
                        <span
                            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[0.7rem] group-hover:rotate-45 transition-transform duration-300"
                            style={{ border: "1.5px solid rgba(255,255,255,0.4)" }}
                            aria-hidden="true"
                        >
                            ↗
                        </span>
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}