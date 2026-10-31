import Link from "next/link";
import type { ServicePageContent } from "@/lib/content/service-pages";
import { PageHero } from "@/components/sections/ServicePage/PageHero";
import { PlanCards } from "@/components/sections/ServicePage/PlanCards";
import { ProcessSummary } from "@/components/sections/ServicePage/ProcessSummary";
import { ProofBlock } from "@/components/sections/ServicePage/ProofBlock";
import { FaqList } from "@/components/sections/ServicePage/FaqList";
import { CtaBand } from "@/components/sections/ServicePage/CtaBand";
import { CONTAINER, EYEBROW, P } from "@/components/sections/ServicePage/page-tokens";

interface ServiceLandingProps {
    content: ServicePageContent;
}

/** One service, end to end: who it is for, what you get, packages, process, proof, FAQs, CTA. */
export function ServiceLanding({ content }: ServiceLandingProps) {
    const location = `service_${content.path.split("/").pop()}`;
    return (
        <>
            <PageHero
                crumbs={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: content.eyebrow, href: content.path }]}
                eyebrow={content.eyebrow}
                title={content.title}
                lede={content.lede}
                secondary={{ href: "/pricing", label: "See pricing" }}
                location={location}
            />

            <section className="py-16 md:py-24 border-t" style={{ borderColor: P.borderSub }} aria-labelledby="fit-heading">
                <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[1fr_1.4fr]`}>
                    <div>
                        <p className={`${EYEBROW} mb-3`} style={{ color: P.muted }}>Is this for you</p>
                        <h2 id="fit-heading" className="font-serif font-normal leading-[1.1] tracking-[-0.02em] text-balance" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)", color: P.heading }}>
                            A good fit when you are
                        </h2>
                    </div>
                    <ul className="list-none p-0 m-0 divide-y" style={{ borderColor: P.border }}>
                        {content.forWhom.map((line) => (
                            <li key={line} className="flex gap-4 py-4 text-[1rem] leading-[1.65] text-pretty" style={{ color: P.body }}>
                                <span aria-hidden="true" className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: P.accent }} />
                                <span>{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="py-16 md:py-24 border-t" style={{ borderColor: P.borderSub }} aria-labelledby="deliverables-heading">
                <div className={CONTAINER}>
                    <p className={`${EYEBROW} mb-3`} style={{ color: P.muted }}>What you get</p>
                    <h2 id="deliverables-heading" className="font-serif font-normal leading-[1.1] tracking-[-0.02em] text-balance mb-10" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)", color: P.heading }}>
                        Included in every project
                    </h2>
                    <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
                        {content.deliverables.map((d) => (
                            <li key={d.title} className="border-t pt-5" style={{ borderColor: P.border }}>
                                <h3 className="font-serif font-normal text-[1.3rem] leading-tight" style={{ color: P.heading }}>{d.title}</h3>
                                <p className="mt-2 text-[0.95rem] leading-[1.65] text-pretty" style={{ color: P.body }}>{d.body}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <PlanCards heading="Fixed prices, written down before we start." plans={content.plans} location={location} />
            <ProcessSummary />
            <ProofBlock testimonials={content.testimonials} caseStudies={content.caseStudies} />
            <FaqList ids={content.faqs} />

            <section className="py-10 border-t" style={{ borderColor: P.borderSub }} aria-label="Related pages">
                <div className={`${CONTAINER} flex flex-wrap gap-x-8 gap-y-3 text-[0.85rem]`}>
                    {content.related.map((r) => (
                        <Link key={r.href} href={r.href} className="underline underline-offset-4" style={{ color: P.muted }}>
                            {r.label}
                        </Link>
                    ))}
                </div>
            </section>

            <CtaBand
                heading="Tell me what you are building."
                body="Send a few lines about the problem and I will reply within 24 hours with the best next step. If that step is not me, I will say so."
                location={location}
            />
        </>
    );
}
