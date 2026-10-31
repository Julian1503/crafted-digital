import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { SkipLink } from "@/components/ui/skip-link";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/constants/site";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "How Julian Delgado collects, uses and protects the personal information you share through juliandelgado.com.au.",
    alternates: { canonical: `${SITE_URL}/privacy` },
    robots: { index: true, follow: true },
};

const LAST_UPDATED = "31 October 2026";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <SkipLink />
            <Header />
            <main id="main-content" className="pt-28 pb-24">
                <article className="mx-auto max-w-[68ch] px-4 sm:px-6 md:px-8 prose-legal">
                    <p className="text-[0.7rem] tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(10,10,10,0.62)" }}>
                        Legal
                    </p>
                    <h1 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] mb-3 text-balance" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>
                        Privacy Policy
                    </h1>
                    <p className="text-[0.85rem] mb-10" style={{ color: "rgba(10,10,10,0.6)" }}>Last updated: {LAST_UPDATED}</p>

                    <section className="space-y-4 text-[0.98rem] leading-[1.75]" style={{ color: "rgba(10,10,10,0.8)" }}>
                        <h2 className="font-serif text-2xl mt-10 mb-2">Who I am</h2>
                        <p>
                            This website is operated by Julian Delgado, a sole trader based in Toowoomba, Queensland, Australia
                            (&ldquo;I&rdquo;, &ldquo;me&rdquo;). I handle personal information in line with the Australian Privacy
                            Principles in the <em>Privacy Act 1988</em> (Cth). You can reach me at{" "}
                            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">{CONTACT_EMAIL}</a>.
                        </p>

                        <h2 className="font-serif text-2xl mt-10 mb-2">What I collect</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Contact form:</strong> your name, email address and anything you choose to tell me about your project, plus optional company, website, budget, timeline and preferred contact method.</li>
                            <li><strong>Email:</strong> if you email me, I keep the correspondence.</li>
                            <li><strong>Analytics:</strong> Google Analytics 4 (through Google Tag Manager) records pages visited, approximate location, device and browser type, and interactions such as clicking a call-to-action or submitting the contact form. IP addresses are not stored by GA4.</li>
                            <li><strong>Server logs:</strong> standard request logs (IP address, user agent, time) kept for security and rate limiting.</li>
                        </ul>

                        <h2 className="font-serif text-2xl mt-10 mb-2">Why I collect it</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To reply to your enquiry and scope a project with you.</li>
                            <li>To send you a confirmation that your message arrived.</li>
                            <li>To understand which pages and messages work, so I can improve the site.</li>
                            <li>To protect the site from abuse.</li>
                        </ul>
                        <p>I do not sell personal information and I do not send marketing email unless you have asked for it.</p>

                        <h2 className="font-serif text-2xl mt-10 mb-2">Who I share it with</h2>
                        <p>Only the services needed to run this site, each under its own privacy policy:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Resend</strong> delivers the contact form emails.</li>
                            <li><strong>Google</strong> (Tag Manager and Analytics) processes analytics data, some of it outside Australia.</li>
                            <li><strong>Cloudinary</strong> and <strong>ImageKit</strong> serve images and video; they see your IP address when files load.</li>
                            <li>The hosting provider that runs the site and its database.</li>
                        </ul>

                        <h2 className="font-serif text-2xl mt-10 mb-2">Cookies</h2>
                        <p>
                            Analytics cookies set by Google are used to tell visits apart. You can block them in your browser or with
                            Google&rsquo;s opt-out tools; the site keeps working without them. No advertising cookies are set at this time.
                            If that changes, this page will be updated first.
                        </p>

                        <h2 className="font-serif text-2xl mt-10 mb-2">How long I keep it</h2>
                        <p>
                            Enquiries are kept while we are talking and for up to two years afterwards, in case the project comes back.
                            Analytics data follows Google&rsquo;s retention setting (14 months). You can ask me to delete your
                            information at any time.
                        </p>

                        <h2 className="font-serif text-2xl mt-10 mb-2">Your rights</h2>
                        <p>
                            You can ask what information I hold about you, ask me to correct it, or ask me to delete it. Email{" "}
                            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">{CONTACT_EMAIL}</a> and I will
                            respond within 30 days. If you are not satisfied with my response you can contact the Office of the
                            Australian Information Commissioner at oaic.gov.au.
                        </p>

                        <h2 className="font-serif text-2xl mt-10 mb-2">Changes</h2>
                        <p>
                            When this policy changes, the date at the top changes with it. Material changes will be noted here for
                            at least 30 days.
                        </p>

                        <p className="pt-6">
                            See also the <Link href="/terms" className="underline underline-offset-2">Terms of Service</Link>.
                        </p>
                    </section>
                </article>
            </main>
            <Footer />
        </div>
    );
}
