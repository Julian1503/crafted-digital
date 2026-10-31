import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { SkipLink } from "@/components/ui/skip-link";
import { PageHero } from "@/components/sections/ServicePage/PageHero";
import { ProcessSummary } from "@/components/sections/ServicePage/ProcessSummary";
import { CtaBand } from "@/components/sections/ServicePage/CtaBand";
import { CONTAINER, EYEBROW, P } from "@/components/sections/ServicePage/page-tokens";
import { ONGOING_TECH_PARTNER, SERVICE_OFFERS, formatAud } from "@/lib/content/offers";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/constants/site";

export const metadata: Metadata = {
    title: "Services: Websites, Custom Software and AI Automation",
    description:
        "Custom websites from AUD 2,450, custom software and AI automation from AUD 8,000, and a monthly tech partner plan. One senior engineer, from discovery to launch, for Australian small businesses.",
    alternates: { canonical: `${SITE_URL}/services` },
    openGraph: {
        images: [DEFAULT_OG_IMAGE],
        title: "Services | Julian Delgado",
        description: "Websites, custom software and AI automation for Australian small businesses, built end to end by one senior engineer.",
        url: `${SITE_URL}/services`,
        type: "website",
    },
};

const TRACKS = SERVICE_OFFERS.filter((o) => o.id !== "retainer");

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <SkipLink />
            <Header />
            <main id="main-content">
                <PageHero
                    crumbs={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }]}
                    eyebrow="Services"
                    title="Websites, custom software and AI automation, built by the person you talk to."
                    lede="Two kinds of work, one process. You deal directly with the engineer who designs and builds it, from discovery to launch, with a demo every week and a fixed price in AUD."
                    secondary={{ href: "/pricing", label: "See pricing" }}
                    location="services_hub"
                />

                <section className="py-16 md:py-24 border-t" style={{ borderColor: P.borderSub }} aria-labelledby="tracks-heading">
                    <div className={CONTAINER}>
                        <h2 id="tracks-heading" className="sr-only">What I build</h2>
                        <ul className="grid gap-6 md:grid-cols-2 list-none p-0 m-0">
                            {TRACKS.map((offer) => {
                                const from = offer.plans[0];
                                return (
                                    <li key={offer.id}>
                                        <Link
                                            href={offer.path}
                                            className="group flex h-full flex-col rounded-2xl border p-8 md:p-10 no-underline transition-[border-color,transform] duration-200 hover:-translate-y-0.5"
                                            style={{ borderColor: P.border, background: "#fff" }}
                                        >
                                            <p className={EYEBROW} style={{ color: P.muted }}>From {formatAud(from).replace(/^From /, "")}</p>
                                            <h3 className="mt-4 font-serif font-normal leading-[1.1] tracking-[-0.02em] text-balance" style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)", color: P.heading }}>
                                                {offer.name}
                                            </h3>
                                            <p className="mt-4 text-[0.98rem] leading-[1.7] text-pretty" style={{ color: P.body }}>{offer.description}</p>
                                            <ul className="mt-6 space-y-1.5 list-none p-0 m-0 text-[0.9rem]" style={{ color: P.body }}>
                                                {offer.plans.map((plan) => (
                                                    <li key={plan.name} className="flex justify-between gap-4 tabular-nums">
                                                        <span>{plan.name}</span>
                                                        <span style={{ color: P.muted }}>{formatAud(plan)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <span className="mt-auto pt-8 inline-flex items-center gap-2 text-[0.8rem] tracking-[0.06em] uppercase" style={{ color: P.accentDark }}>
                                                Read more
                                                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="mt-6 rounded-2xl border p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6" style={{ borderColor: P.border }}>
                            <div>
                                <p className={EYEBROW} style={{ color: P.muted }}>After launch</p>
                                <h3 className="mt-3 font-serif font-normal text-[1.6rem] leading-tight" style={{ color: P.heading }}>{ONGOING_TECH_PARTNER.name}</h3>
                                <p className="mt-2 max-w-[60ch] text-[0.95rem] leading-[1.65] text-pretty" style={{ color: P.body }}>
                                    {formatAud(ONGOING_TECH_PARTNER)} for up to 8 development hours: updates, fixes, landing pages and small automations, with priority support and a monthly review.
                                </p>
                            </div>
                            <Link href="/pricing" className="text-[0.8rem] tracking-[0.06em] uppercase underline underline-offset-4 shrink-0" style={{ color: P.accentDark }}>
                                Plan details
                            </Link>
                        </div>
                    </div>
                </section>

                <ProcessSummary />

                <CtaBand
                    heading="Not sure which one you need?"
                    body="That is the normal starting point. Send a few lines about the problem and we book a 20-minute call to work out the right scope, or whether you need me at all."
                    location="services_hub"
                />
            </main>
            <Footer />
        </div>
    );
}
