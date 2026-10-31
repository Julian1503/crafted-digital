import type { Metadata } from "next";
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { SkipLink } from "@/components/ui/skip-link";
import { ContactSection } from "@/components/sections/Contact/ContactSection";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/constants/site";

export const metadata: Metadata = {
    title: "Contact | Book a 20-minute call",
    description:
        "Tell Julian Delgado what you're building. Custom software, AI automation and websites for Australian small businesses, from Toowoomba, QLD. Reply within 24 hours.",
    alternates: { canonical: `${SITE_URL}/contact` },
    openGraph: {
        images: [DEFAULT_OG_IMAGE],
        title: "Contact Julian Delgado",
        description: "Custom software, AI automation and websites for Australian small businesses. Reply within 24 hours.",
        url: `${SITE_URL}/contact`,
        type: "website",
    },
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <SkipLink />
            <Header />
            <main id="main-content" className="pt-16">
                <ContactSection asPageHeading />
            </main>
            <Footer />
        </div>
    );
}
