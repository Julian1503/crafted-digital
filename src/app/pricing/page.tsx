import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { SkipLink } from "@/components/ui/skip-link";
import { PricingSection } from "@/components/sections/Pricing/PricingSection";
import { PageHero } from "@/components/sections/ServicePage/PageHero";
import { FaqList } from "@/components/sections/ServicePage/FaqList";
import { CtaBand } from "@/components/sections/ServicePage/CtaBand";
import { CONTAINER, EYEBROW, P } from "@/components/sections/ServicePage/page-tokens";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/constants/site";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Pricing: Fixed Prices in AUD",
    description:
        "Starter Website AUD 2,450, Growth Website AUD 4,990, custom software and AI automation from AUD 8,000, Ongoing Tech Partner AUD 990 a month. Every package lists what is included.",
    alternates: { canonical: `${SITE_URL}/pricing` },
    openGraph: {
        images: [DEFAULT_OG_IMAGE],
        title: "Pricing | Julian Delgado",
        description: "Fixed prices in AUD for websites, custom software and AI automation, with inclusions and timelines listed.",
        url: `${SITE_URL}/pricing`,
        type: "website",
    },
};

const HOW_QUOTES_WORK = [
    {
        title: "Websites are fixed price",
        body: "Starter and Growth list exactly what is included. If you need more pages or features, you get a written quote before anything changes.",
    },
    {
        title: "Software is quoted after discovery",
        body: "A short discovery workshop produces a written scope, a fixed price and a delivery date. From AUD 8,000, with what is included and what is not listed before you commit.",
    },
    {
        title: "Payment in two halves",
        body: "50% deposit to lock in the start date, 50% on completion and approval. The retainer is billed monthly and hours do not roll over.",
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <SkipLink />
            <Header />
            <main id="main-content">
                <PageHero
                    crumbs={[{ name: "Home", href: "/" }, { name: "Pricing", href: "/pricing" }]}
                    eyebrow="Pricing"
                    title="Fixed prices, written down before we start."
                    lede="Every package lists what is included, what is not, and the delivery timeline. All prices in Australian dollars, with a 50% deposit to lock in the start date and the rest on completion."
                    secondary={{ href: "/services", label: "See services" }}
                    location="pricing_page"
                />

                <PricingSection />

                <section className="py-16 md:py-24 border-t" style={{ borderColor: P.borderSub }} aria-labelledby="quotes-heading">
                    <div className={CONTAINER}>
                        <p className={`${EYEBROW} mb-3`} style={{ color: P.muted }}>How quotes work</p>
                        <h2 id="quotes-heading" className="font-serif font-normal leading-[1.1] tracking-[-0.02em] text-balance mb-10" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)", color: P.heading }}>
                            No surprises mid-build
                        </h2>
                        <ul className="grid gap-8 md:grid-cols-3 list-none p-0 m-0">
                            {HOW_QUOTES_WORK.map((item) => (
                                <li key={item.title} className="border-t pt-5" style={{ borderColor: P.border }}>
                                    <h3 className="font-serif font-normal text-[1.3rem] leading-tight" style={{ color: P.heading }}>{item.title}</h3>
                                    <p className="mt-2 text-[0.95rem] leading-[1.65] text-pretty" style={{ color: P.body }}>{item.body}</p>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-10 text-[0.9rem]" style={{ color: P.muted }}>
                            Plain-text version for sharing: <Link href="/pricing.md" className="underline underline-offset-4">pricing.md</Link>
                        </p>
                    </div>
                </section>

                <FaqList ids={["payments", "software-cost", "timeline", "post-launch-support", "if-you-disappear"]} />

                <CtaBand
                    heading="Want a number for your project?"
                    body="Tell me what you are building and I will come back within 24 hours with a fixed quote or the questions I need answered first."
                    location="pricing_page"
                />
            </main>
            <Footer />
        </div>
    );
}
