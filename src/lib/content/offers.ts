/**
 * @fileoverview The public offer, as a static catalogue.
 *
 * Mirrors the seeded plans (`src/lib/db/seed.ts`) so structured data, the
 * service pages and `/llms.txt` can describe the offer without a database
 * round trip on every request. Keep the numbers in sync when a plan changes.
 */
import { SITE_URL } from "@/lib/constants/site";

export type OfferInterval = "one-time" | "monthly";

export interface OfferPlan {
    name: string;
    /** Whole AUD amount. */
    price: number;
    interval: OfferInterval;
    /** True when the price is a starting point quoted after discovery. */
    from?: boolean;
    timeline: string;
    includes: string[];
}

export interface ServiceOffer {
    id: "websites" | "custom-software" | "retainer";
    name: string;
    /** Site path of the page that describes the service. */
    path: string;
    /** schema.org `serviceType` */
    serviceType: string;
    description: string;
    plans: OfferPlan[];
}

export const STARTER_WEBSITE: OfferPlan = {
    name: "Starter Website",
    price: 2450,
    interval: "one-time",
    timeline: "About 2 weeks",
    includes: [
        "Up to 5 pages, designed for your business",
        "Responsive on phone, tablet and desktop",
        "Contact form wired to your inbox",
        "Basic SEO: titles, descriptions, sitemap",
        "Google Maps and social links",
        "1 revision round and 30 days of fixes after launch",
    ],
};

export const GROWTH_WEBSITE: OfferPlan = {
    name: "Growth Website",
    price: 4990,
    interval: "one-time",
    timeline: "4 to 6 weeks",
    includes: [
        "Up to 10 pages with a custom design system",
        "CMS so you can edit pages and posts yourself",
        "Advanced enquiry forms and lead capture",
        "On-page SEO and performance optimisation",
        "Basic analytics and conversion events",
        "2 revision rounds and 30 days of fixes after launch",
    ],
};

export const CUSTOM_SOFTWARE: OfferPlan = {
    name: "Custom Software & AI Automation",
    price: 8000,
    interval: "one-time",
    from: true,
    timeline: "6 to 12 weeks",
    includes: [
        "Discovery workshop and a fixed-price scope",
        "CRMs, client portals, dashboards, approval workflows",
        "AI assistants with a human approval step and audit trail",
        "Integrations: Stripe, email, calendars, Make/n8n, your existing tools",
        "Unit, integration and end-to-end tests",
        "Weekly demos, documentation and handover in your name",
    ],
};

export const ONGOING_TECH_PARTNER: OfferPlan = {
    name: "Ongoing Tech Partner",
    price: 990,
    interval: "monthly",
    timeline: "Monthly, cancel any time",
    includes: [
        "Up to 8 development hours a month",
        "Updates, bug fixes and small features",
        "Landing pages and basic automation",
        "Priority email support",
        "Monthly review call",
        "Hours do not roll over",
    ],
};

export const SERVICE_OFFERS: ServiceOffer[] = [
    {
        id: "websites",
        name: "Websites",
        path: "/services/websites",
        serviceType: "Web Development",
        description:
            "Custom websites built with Next.js for Australian service businesses: fast, accessible, built to bring enquiries, live in 2 to 6 weeks at a fixed price.",
        plans: [STARTER_WEBSITE, GROWTH_WEBSITE],
    },
    {
        id: "custom-software",
        name: "Custom Software & AI Automation",
        path: "/services/custom-software",
        serviceType: "Software Development",
        description:
            "Internal tools, client portals, CRMs, workflow automation and AI assistants with a human approval step, scoped in a discovery workshop and quoted as a fixed price.",
        plans: [CUSTOM_SOFTWARE],
    },
    {
        id: "retainer",
        name: "Ongoing Tech Partner",
        path: "/pricing",
        serviceType: "Website Maintenance",
        description:
            "A developer on call each month for updates, fixes, landing pages and automations, with priority support and a monthly review.",
        plans: [ONGOING_TECH_PARTNER],
    },
];

export function absoluteUrl(path: string): string {
    return `${SITE_URL}${path}`;
}

export function formatAud(plan: OfferPlan): string {
    const amount = plan.price.toLocaleString("en-AU");
    if (plan.interval === "monthly") return `AUD ${amount} a month`;
    return plan.from ? `From AUD ${amount}` : `AUD ${amount}`;
}
