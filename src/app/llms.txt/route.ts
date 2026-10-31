import { SITE_URL, CONTACT_EMAIL } from "@/lib/constants/site";
import { SERVICE_OFFERS, absoluteUrl, formatAud } from "@/lib/content/offers";
import { getPublishedCaseStudies } from "@/lib/services/case-studies";
import { HERO_HEADLINE } from "@/components/sections/Hero/hero.constants";

export const revalidate = 3600;

/** Plain-text site summary for AI assistants, following the llms.txt convention. */
export async function GET() {
    const studies = await getPublishedCaseStudies();

    const services = SERVICE_OFFERS.map((offer) => {
        const plans = offer.plans.map((p) => `${p.name}: ${formatAud(p)}, ${p.timeline.toLowerCase()}`).join("; ");
        return `- [${offer.name}](${absoluteUrl(offer.path)}): ${offer.description} Plans: ${plans}.`;
    });

    const caseStudies = studies.map(
        (s) => `- [${s.title}](${SITE_URL}/case-studies/${s.slug})${s.summary ? `: ${s.summary}` : ""}`
    );

    const body = [
        "# Julian Delgado",
        "",
        `> ${HERO_HEADLINE} Built end to end by one senior engineer based in Toowoomba, Queensland, for clients Australia-wide.`,
        "",
        "Julian Delgado is a software engineer and product designer. Clients work directly with him from discovery to launch, with weekly demos, fixed prices in AUD, 30 days of post-launch support and an optional monthly retainer. Every AI feature shipped keeps a person in control, with an approval step, an audit trail and tests.",
        "",
        "## Services",
        "",
        ...services,
        "",
        "## Pricing",
        "",
        `- [Pricing page](${SITE_URL}/pricing): all packages with inclusions. Machine-readable version: ${SITE_URL}/pricing.md`,
        "- Payment: 50% deposit to lock in the start date, 50% on completion and approval. All prices in Australian dollars.",
        "",
        "## Case studies",
        "",
        ...(caseStudies.length ? caseStudies : [`- [Case studies](${SITE_URL}/case-studies)`]),
        "",
        "## Contact",
        "",
        `- [Book a 20-minute call](${SITE_URL}/contact): reply within 24 hours.`,
        `- Email: ${CONTACT_EMAIL}`,
        `- Based in Toowoomba, QLD, Australia. Remote work with clients across Australia.`,
        "",
        "## About",
        "",
        `- [About Julian](${SITE_URL}/about-me): 5+ years of professional experience, Software Engineer III at a tax-compliance software company, background in compliance-heavy domains.`,
        "",
    ].join("\n");

    return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
    });
}
