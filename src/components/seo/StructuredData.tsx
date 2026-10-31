/**
 * @fileoverview Site-wide JSON-LD as a single `@graph`.
 *
 * Person (Julian), ProfessionalService (the business), WebSite, and one
 * Service per offer with its Offers. Rendered once in the root layout.
 */
import { safeJsonLd } from "@/lib/seo/json-ld";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { SERVICE_OFFERS, absoluteUrl, type OfferPlan, type ServiceOffer } from "@/lib/content/offers";
import { HERO_HEADLINE } from "@/components/sections/Hero/hero.constants";

export const PERSON_ID = `${SITE_URL}/#person`;
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const SOCIAL_PROFILES = [
    "https://www.linkedin.com/in/julianedelgado/",
    "https://www.instagram.com/crafteddigital_/",
];

function offerFor(plan: OfferPlan, url: string) {
    const base = {
        "@type": "Offer",
        name: plan.name,
        url,
        priceCurrency: "AUD",
        availability: "https://schema.org/InStock",
        areaServed: { "@type": "Country", name: "Australia" },
    };
    if (plan.interval === "monthly") {
        return {
            ...base,
            priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: plan.price,
                priceCurrency: "AUD",
                unitCode: "MON",
                billingDuration: 1,
            },
        };
    }
    if (plan.from) {
        return {
            ...base,
            priceSpecification: { "@type": "PriceSpecification", minPrice: plan.price, priceCurrency: "AUD" },
        };
    }
    return { ...base, price: plan.price };
}

function serviceFor(offer: ServiceOffer) {
    const url = absoluteUrl(offer.path);
    return {
        "@type": "Service",
        "@id": `${SITE_URL}/#service-${offer.id}`,
        name: offer.name,
        serviceType: offer.serviceType,
        description: offer.description,
        url,
        provider: { "@id": BUSINESS_ID },
        areaServed: { "@type": "Country", name: "Australia" },
        offers: offer.plans.map((plan) => offerFor(plan, url)),
    };
}

export function buildSiteGraph() {
    const services = SERVICE_OFFERS.map(serviceFor);
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": PERSON_ID,
                name: "Julian Delgado",
                jobTitle: "Software engineer and product designer",
                url: `${SITE_URL}/about-me`,
                email: CONTACT_EMAIL,
                worksFor: { "@id": BUSINESS_ID },
                address: { "@type": "PostalAddress", addressLocality: "Toowoomba", addressRegion: "QLD", addressCountry: "AU" },
                sameAs: SOCIAL_PROFILES,
                knowsAbout: ["Next.js", "React", "TypeScript", "Custom software", "AI automation", "Web accessibility"],
            },
            {
                "@type": "ProfessionalService",
                "@id": BUSINESS_ID,
                name: SITE_NAME,
                description: HERO_HEADLINE,
                url: SITE_URL,
                email: CONTACT_EMAIL,
                founder: { "@id": PERSON_ID },
                address: { "@type": "PostalAddress", addressLocality: "Toowoomba", addressRegion: "QLD", addressCountry: "AU" },
                geo: { "@type": "GeoCoordinates", latitude: -27.5598, longitude: 151.9507 },
                areaServed: [
                    { "@type": "Country", name: "Australia" },
                    { "@type": "State", name: "Queensland" },
                ],
                priceRange: "AUD 2,450 to 8,000+",
                currenciesAccepted: "AUD",
                sameAs: SOCIAL_PROFILES,
                makesOffer: services.flatMap((s) => s.offers),
                hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Services",
                    itemListElement: services.map((s) => ({ "@id": s["@id"] })),
                },
            },
            {
                "@type": "WebSite",
                "@id": WEBSITE_ID,
                url: SITE_URL,
                name: SITE_NAME,
                description: HERO_HEADLINE,
                publisher: { "@id": BUSINESS_ID },
                inLanguage: "en-AU",
            },
            ...services,
        ],
    };
}

/** Site-wide structured data for the root layout. */
export function StructuredData() {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(buildSiteGraph()) }}
        />
    );
}
