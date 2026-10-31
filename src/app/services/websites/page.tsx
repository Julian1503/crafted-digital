import type { Metadata } from "next";
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { SkipLink } from "@/components/ui/skip-link";
import { ServiceLanding } from "@/components/sections/ServicePage/ServiceLanding";
import { WEBSITES_PAGE } from "@/lib/content/service-pages";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/constants/site";

export const metadata: Metadata = {
    title: WEBSITES_PAGE.metaTitle,
    description: WEBSITES_PAGE.metaDescription,
    alternates: { canonical: `${SITE_URL}${WEBSITES_PAGE.path}` },
    openGraph: {
        images: [DEFAULT_OG_IMAGE],
        title: `${WEBSITES_PAGE.metaTitle} | Julian Delgado`,
        description: WEBSITES_PAGE.metaDescription,
        url: `${SITE_URL}${WEBSITES_PAGE.path}`,
        type: "website",
    },
};

export default function WebsitesServicePage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <SkipLink />
            <Header />
            <main id="main-content">
                <ServiceLanding content={WEBSITES_PAGE} />
            </main>
            <Footer />
        </div>
    );
}
