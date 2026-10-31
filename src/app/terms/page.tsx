import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { SkipLink } from "@/components/ui/skip-link";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/constants/site";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "The terms that apply to using juliandelgado.com.au and to engaging Julian Delgado for web and software work.",
    alternates: { canonical: `${SITE_URL}/terms` },
    robots: { index: true, follow: true },
};

const LAST_UPDATED = "31 October 2026";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <SkipLink />
            <Header />
            <main id="main-content" className="pt-28 pb-24">
                <article className="mx-auto max-w-[68ch] px-4 sm:px-6 md:px-8">
                    <p className="text-[0.7rem] tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(10,10,10,0.62)" }}>
                        Legal
                    </p>
                    <h1 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] mb-3 text-balance" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>
                        Terms of Service
                    </h1>
                    <p className="text-[0.85rem] mb-10" style={{ color: "rgba(10,10,10,0.6)" }}>Last updated: {LAST_UPDATED}</p>

                    <section className="space-y-4 text-[0.98rem] leading-[1.75]" style={{ color: "rgba(10,10,10,0.8)" }}>
                        <h2 className="font-serif text-2xl mt-10 mb-2">Using this website</h2>
                        <p>
                            juliandelgado.com.au is run by Julian Delgado, a sole trader in Toowoomba, Queensland. The content is
                            provided for information about my services. You may browse and share it; you may not copy the design,
                            code or case study material for commercial use without written permission. Client names and logos belong
                            to their owners.
                        </p>
                        <p>
                            I try to keep the site accurate and available, but I make no guarantee that it is error-free or always up.
                            Prices shown are starting points in Australian dollars and are confirmed in a written quote.
                        </p>

                        <h2 className="font-serif text-2xl mt-10 mb-2">Working together</h2>
                        <p>
                            Every project runs under a written proposal that sets the scope, price, timeline and payment terms. Where
                            these terms and a signed proposal differ, the proposal wins. Unless the proposal says otherwise:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Payment:</strong> 50% deposit to lock in the start date, 50% on completion and approval. Monthly plans are billed in advance.</li>
                            <li><strong>Ownership:</strong> once the final invoice is paid, you own the code and content built for you, and the accounts (hosting, domain, analytics) are set up in your name.</li>
                            <li><strong>Third-party tools:</strong> licences and subscriptions for services you use (hosting, email, AI providers) are yours and billed to you.</li>
                            <li><strong>Support:</strong> fixed-price projects include 30 days of bug fixes after launch. Ongoing work is covered by a monthly plan.</li>
                            <li><strong>Changes:</strong> work outside the agreed scope is quoted before it starts.</li>
                            <li><strong>Cancellation:</strong> either side can end a project with written notice; completed work is invoiced and the deposit covers work done to date.</li>
                        </ul>

                        <h2 className="font-serif text-2xl mt-10 mb-2">Liability</h2>
                        <p>
                            Nothing in these terms excludes rights you have under the Australian Consumer Law. Beyond those rights, my
                            liability for any claim arising from a project is limited to the fees paid for that project, and I am not
                            liable for indirect loss such as lost profit or data caused by third-party services.
                        </p>

                        <h2 className="font-serif text-2xl mt-10 mb-2">Privacy</h2>
                        <p>
                            How I handle your information is set out in the{" "}
                            <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
                        </p>

                        <h2 className="font-serif text-2xl mt-10 mb-2">Law and contact</h2>
                        <p>
                            These terms are governed by the laws of Queensland, Australia. Questions go to{" "}
                            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">{CONTACT_EMAIL}</a>.
                        </p>
                    </section>
                </article>
            </main>
            <Footer />
        </div>
    );
}
