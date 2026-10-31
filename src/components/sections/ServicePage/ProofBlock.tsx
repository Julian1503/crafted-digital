import Link from "next/link";
import { TESTIMONIALS } from "@/lib/content/testimonials";
import { getPublishedCaseStudies } from "@/lib/services/case-studies";
import { CONTAINER, EYEBROW, P } from "@/components/sections/ServicePage/page-tokens";

interface ProofBlockProps {
    testimonials: number[];
    caseStudies: { slug: string; label: string }[];
}

/**
 * Real quotes beside links to the matching case studies. Only studies that
 * are published right now are linked, so a page never points at a 404 while
 * the catalogue is still being filled in.
 */
export async function ProofBlock({ testimonials, caseStudies }: ProofBlockProps) {
    const quotes = testimonials.map((i) => TESTIMONIALS[i]).filter(Boolean);
    const published = new Set((await getPublishedCaseStudies()).map((s) => s.slug));
    const links = caseStudies.filter((cs) => published.has(cs.slug));

    return (
        <section className="py-16 md:py-24 border-t" style={{ borderColor: P.borderSub }} aria-labelledby="proof-heading">
            <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[1.1fr_1fr]`}>
                <div>
                    <p className={`${EYEBROW} mb-3`} style={{ color: P.muted }}>From clients</p>
                    <h2 id="proof-heading" className="font-serif font-normal leading-[1.1] tracking-[-0.02em] mb-8" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)", color: P.heading }}>
                        What it was like to work together
                    </h2>
                    <div className="space-y-8">
                        {quotes.map((t) => (
                            <blockquote key={t.author} className="pl-5 border-l" style={{ borderColor: P.accent }}>
                                <p className="font-serif italic text-[1.05rem] leading-[1.7]" style={{ color: P.heading }}>&ldquo;{t.quote}&rdquo;</p>
                                <footer className="mt-3 text-[0.8rem] tracking-[0.04em]" style={{ color: P.muted }}>{t.author}, {t.role}</footer>
                            </blockquote>
                        ))}
                    </div>
                </div>
                <div>
                    <p className={`${EYEBROW} mb-3`} style={{ color: P.muted }}>Case studies</p>
                    <ul className="list-none p-0 m-0 divide-y" style={{ borderColor: P.border }}>
                        {links.map((cs) => (
                            <li key={cs.slug}>
                                <Link
                                    href={`/case-studies/${cs.slug}`}
                                    className="group flex items-center justify-between gap-4 py-4 text-[1rem] leading-snug no-underline transition-colors duration-200"
                                    style={{ color: P.heading }}
                                >
                                    <span className="group-hover:underline group-focus-visible:underline underline-offset-4">{cs.label}</span>
                                    <span aria-hidden="true" className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" style={{ color: P.accent }}>→</span>
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link href="/case-studies" className="inline-block py-4 text-[0.85rem] tracking-[0.04em] underline underline-offset-4" style={{ color: P.muted }}>
                                All case studies
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
