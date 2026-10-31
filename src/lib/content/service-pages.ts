/**
 * @fileoverview Copy for the service landing pages.
 */
import {
    CUSTOM_SOFTWARE,
    GROWTH_WEBSITE,
    ONGOING_TECH_PARTNER,
    STARTER_WEBSITE,
    type OfferPlan,
} from "@/lib/content/offers";

export interface Deliverable {
    title: string;
    body: string;
}

export interface ServicePageContent {
    path: string;
    eyebrow: string;
    title: string;
    lede: string;
    metaTitle: string;
    metaDescription: string;
    forWhom: string[];
    deliverables: Deliverable[];
    plans: OfferPlan[];
    /** Indexes into TESTIMONIALS. */
    testimonials: number[];
    caseStudies: { slug: string; label: string }[];
    /** FAQ ids from faq-data. */
    faqs: string[];
    related: { href: string; label: string }[];
}

export const WEBSITES_PAGE: ServicePageContent = {
    path: "/services/websites",
    eyebrow: "Websites",
    title: "A website that looks like the business behind it.",
    lede:
        "Custom-built with Next.js, live in two to six weeks at a fixed price in AUD. For Australian service businesses, tradies, clinics and professionals who need a site that loads fast, ranks and brings in enquiries.",
    metaTitle: "Custom Websites for Australian Service Businesses",
    metaDescription:
        "Custom websites built with Next.js from AUD 2,450, live in 2 to 6 weeks. Fast, accessible, built to bring enquiries. Toowoomba, QLD, clients Australia-wide.",
    forWhom: [
        "A tradie, clinic or consultant whose current site is a template, slow, or built by someone who disappeared.",
        "A business that wants a CMS it can edit without paying for every change.",
        "A creative professional whose portfolio needs to feel like their own work.",
        "Anyone who wants to own the code, hosting and domain from day one.",
    ],
    deliverables: [
        { title: "Design that fits your business", body: "No theme. Layout, type and colour chosen for your trade and your customers, approved as a design before the build starts." },
        { title: "Fast and accessible by default", body: "Core Web Vitals in the green, keyboard and screen-reader friendly, tested on phones first." },
        { title: "Built to bring enquiries", body: "Clear calls to action, forms wired to your inbox, and analytics events so you can see what works." },
        { title: "SEO foundations", body: "Titles, descriptions, structured data, sitemap and Google Business Profile links set up properly on day one." },
        { title: "You own everything", body: "Hosting, domain and analytics accounts in your name, plus handover notes any developer can follow." },
        { title: "30 days of fixes after launch", body: "Bugs and small adjustments covered. After that, the Ongoing Tech Partner plan if you want a developer on call." },
    ],
    plans: [STARTER_WEBSITE, GROWTH_WEBSITE],
    testimonials: [1, 2],
    caseStudies: [
        { slug: "the-better-day-support-platform", label: "The Better Day: a clearer platform for an NDIS provider" },
        { slug: "architect-portfolio-website", label: "An architecture portfolio with an editorial feel" },
    ],
    faqs: ["timeline", "australia-wide", "if-you-disappear", "post-launch-support", "payments"],
    related: [
        { href: "/pricing", label: "See all prices" },
        { href: "/services/custom-software", label: "Custom software & AI automation" },
    ],
};

export const CUSTOM_SOFTWARE_PAGE: ServicePageContent = {
    path: "/services/custom-software",
    eyebrow: "Custom software & AI automation",
    title: "Internal tools that take the repetitive work off your plate.",
    lede:
        "CRMs, client portals, approval workflows and AI assistants built around how your business already runs. Scoped in a short discovery workshop, quoted as a fixed price from AUD 8,000, delivered in six to twelve weeks.",
    metaTitle: "Custom Software & AI Automation for Small Businesses",
    metaDescription:
        "Custom CRMs, client portals, workflow automation and AI assistants with a human approval step. Fixed quote from AUD 8,000, delivered in 6 to 12 weeks. Queensland, clients Australia-wide.",
    forWhom: [
        "A small team replacing spreadsheets, copy-paste and chasing emails with one tool.",
        "NDIS and allied-health providers, accounting and professional-services firms, real estate and trades businesses with manual workflows.",
        "A founder who needs a first version in front of real users without a throwaway build.",
        "Any organisation where the regulator will ask: audit trails, consent and retention built in.",
    ],
    deliverables: [
        { title: "Discovery workshop and a fixed scope", body: "We map the workflow, the people in it and the rules it has to follow. You get a written scope, price and delivery date before anything is built." },
        { title: "Tools built around your workflow", body: "CRMs with consent-safe campaigns, client portals, dashboards, online checkout with Stripe, document extraction, content studios." },
        { title: "AI with a person in control", body: "Every AI feature ships with an approval step, an audit trail, tests and a kill switch. Nothing reaches a customer without someone saying yes." },
        { title: "Integrations", body: "Stripe, email, calendars, Make and n8n, and the systems you already use. Data stays in accounts you own." },
        { title: "Tests and handover", body: "Unit, integration and end-to-end tests, documentation, and accounts in your name so any developer can pick it up." },
        { title: "Weekly demos", body: "A working version every week from the second week, so you see progress and can change course early." },
    ],
    plans: [CUSTOM_SOFTWARE, ONGOING_TECH_PARTNER],
    testimonials: [0],
    caseStudies: [
        { slug: "ai4l-crm-consent-safe-campaigns", label: "A private CRM with consent-safe campaigns, with Rapid Ai4 Learning" },
        { slug: "social-media-scout-ai-agent-human-review", label: "An AI agent that drafts replies for a person to approve" },
        { slug: "ai4l-automation-and-web-platform", label: "Automation and a web platform the team now runs itself" },
    ],
    faqs: ["software-cost", "ai-use", "not-sure-what-i-need", "if-you-disappear", "technologies"],
    related: [
        { href: "/pricing", label: "See all prices" },
        { href: "/services/websites", label: "Websites" },
    ],
};
