import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { SkipLink } from "@/components/ui/skip-link";
import { getPublishedCaseStudies } from "@/lib/services/case-studies";
import { toCaseStudyCardProps } from "@/lib/mappers/case-study.mapper";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Case Studies | Web Development Projects for Australian Businesses",
    description:
        "Explore real examples of web development and software projects delivered for Australian businesses. See how Julian Delgado helps service businesses build digital products that convert.",
    openGraph: {
        title: "Case Studies | Web Development Projects for Australian Businesses",
        description:
            "Real examples of web development projects delivered for Australian service businesses.",
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

// ─── Project slice ────────────────────────────────────────────────────────────
// Server component — all interactivity via CSS :hover

function ProjectSlice({
                          study,
                          index,
                          featured,
                      }: {
    study: CaseStudyCardProps;
    index: number;
    featured: boolean;
}) {
    const href = `/case-studies/${study.slug}`;

    return (
        <article
            className="project-slice relative w-full group overflow-hidden border-b"
            style={{
                borderColor: "rgba(255,255,255,0.06)",
                minHeight:   featured ? "72vh" : "44vh",
            }}
        >
            {/* Background image — always present, darkened + desaturated */}
            {study.image && (
                <div className="absolute inset-0 z-0 will-change-transform transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
                    <Image
                        src={study.image}
                        alt={study.title}
                        fill
                        sizes="100vw"
                        className="object-cover transition-[filter,opacity] duration-700 ease-out"
                        style={{
                            filter:  "saturate(0.2) brightness(0.35)",
                        }}
                        priority={index < 2}
                    />
                    {/* Overlay lifts on hover via CSS */}
                    <div
                        className="image-overlay absolute inset-0 transition-opacity duration-700"
                        style={{
                            background: "linear-gradient(to right, rgba(12,12,12,0.85) 0%, rgba(12,12,12,0.45) 50%, rgba(12,12,12,0.2) 100%)",
                        }}
                    />
                </div>
            )}

            {/* No image — textured dark fill */}
            {!study.image && (
                <div
                    className="absolute inset-0 z-0"
                    style={{ background: "linear-gradient(135deg, #111 0%, #0a0a0a 100%)" }}
                />
            )}

            {/* Content */}
            <Link href={href} className="relative z-10 flex flex-col justify-between h-full p-8 md:p-12 lg:p-16" style={{ minHeight: "inherit" }}>

                {/* Top row — index + meta */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span
                            className="font-mono text-[0.55rem] tracking-[0.28em] uppercase"
                            style={{ color: "rgba(255,255,255,0.22)" }}
                        >
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                            className="h-px w-5 shrink-0"
                            style={{ background: "rgba(255,255,255,0.12)" }}
                        />
                        <span
                            className="text-[0.55rem] tracking-[0.22em] uppercase"
                            style={{ color: "rgba(255,255,255,0.22)" }}
                        >
                            {study.industry ?? study.category ?? "Project"}
                        </span>
                    </div>

                    {/* Arrow — slides in from left on hover */}
                    <span
                        className="arrow-icon inline-flex items-center justify-center w-9 h-9 rounded-full text-[0.7rem] shrink-0 transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        style={{
                            border: "1px solid rgba(255,255,255,0.2)",
                            color:  "rgba(255,255,255,0.7)",
                        }}
                        aria-hidden="true"
                    >
                        ↗
                    </span>
                </div>

                {/* Bottom — title + stats */}
                <div className="mt-auto">

                    {/* Year */}
                    {study.year && (
                        <time
                            dateTime={String(study.year)}
                            className="block font-mono text-[0.55rem] tracking-[0.22em] mb-4 transition-colors duration-300"
                            style={{ color: "rgba(255,255,255,0.18)" }}
                        >
                            {study.year}
                        </time>
                    )}

                    {/* Title — the hero element */}
                    <h2
                        className="font-serif font-normal leading-[0.96] tracking-[-0.035em] transition-[color,transform] duration-500 group-hover:translate-x-1"
                        style={{
                            fontSize: featured
                                ? "clamp(2.8rem, 7vw, 6.5rem)"
                                : "clamp(2rem, 4.5vw, 4rem)",
                            color:    "rgba(255,255,255,0.88)",
                            maxWidth: "18ch",
                        }}
                    >
                        {study.title}
                    </h2>

                    {/* Description — only visible on hover */}
                    {study.description && (
                        <p
                            className="mt-4 text-[0.82rem] leading-[1.7] max-w-[52ch] transition-[opacity,transform] duration-500 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                            style={{ color: "rgba(255,255,255,0.45)" }}
                        >
                            {study.description}
                        </p>
                    )}

                    {/* Stats + tags row */}
                    {(study.stats?.length || study.tags?.length) && (
                        <div
                            className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 transition-[opacity,transform] duration-500 delay-75 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                        >
                            {study.stats?.map((stat) => (
                                <div key={stat.label} className="flex items-baseline gap-2">
                                    <span
                                        className="font-serif font-normal leading-none"
                                        style={{
                                            fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                                            color:    "hsl(var(--hero-accent))",
                                        }}
                                    >
                                        {stat.value}
                                    </span>
                                    <span
                                        className="text-[0.6rem] tracking-[0.12em] uppercase"
                                        style={{ color: "rgba(255,255,255,0.3)" }}
                                    >
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                            {study.tags?.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[0.58rem] tracking-[0.15em] uppercase border rounded-full px-2.5 py-1"
                                    style={{
                                        color:       "rgba(255,255,255,0.35)",
                                        borderColor: "rgba(255,255,255,0.1)",
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Link>

            {/* Accent line — slides in from left on hover */}
            <div
                className="absolute left-0 top-0 bottom-0 w-[3px] transition-transform duration-500 origin-top scale-y-0 group-hover:scale-y-100"
                style={{ background: "hsl(var(--hero-accent))" }}
                aria-hidden="true"
            />
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
                        style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.72rem", letterSpacing: "0.08em" }}
                    >
                        <span aria-hidden="true" style={{ fontSize: "0.8rem" }}>←</span>
                        <span className="uppercase tracking-[0.15em] text-[0.58rem]">Back</span>
                    </Link>

                    {/* Section label */}
                    <div className="flex items-center gap-3 mb-8">
                        <span
                            className="font-mono text-[0.62rem] tracking-[0.25em] uppercase select-none"
                            style={{ color: "rgba(255,255,255,0.22)" }}
                        >
                            Work
                        </span>
                        <span className="h-px w-7 shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} aria-hidden="true" />
                        <span
                            className="font-mono text-[0.62rem] tracking-[0.2em] uppercase"
                            style={{ color: "rgba(255,255,255,0.22)" }}
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
                            style={{ color: "rgba(255,255,255,0.28)" }}
                        >
                            Real projects, real results. Each one shows the problem, approach, and outcomes delivered for Australian businesses.
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
                        <ProjectSlice
                            key={study.slug}
                            study={study}
                            index={i}
                            featured={i === 0}
                        />
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
                            style={{ color: "rgba(255,255,255,0.32)", maxWidth: "40ch" }}
                        >
                            Let's talk about your project — no commitment, just a 20 min call.
                        </p>
                    </div>

                    <Link
                        href="/#contact"
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
                            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[0.65rem] group-hover:rotate-45 transition-transform duration-300"
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