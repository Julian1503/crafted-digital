import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/header/Header";
import { SkipLink } from "@/components/ui/skip-link";
import { HeroLab } from "@/components/lab/HeroLab";

// Hidden prototype page: not linked, not indexed, not in the sitemap.
export const metadata: Metadata = {
    title: "Hero prototypes",
    robots: { index: false, follow: false },
};

export default function HeroLabPage() {
    return (
        <div className="min-h-screen font-sans">
            <SkipLink />
            <Header />
            <main id="main-content">
                <Suspense>
                    <HeroLab />
                </Suspense>
            </main>
        </div>
    );
}
