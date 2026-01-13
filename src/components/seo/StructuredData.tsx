/**
 * @fileoverview JSON-LD structured data component for SEO.
 * Provides LocalBusiness and Service schema markup.
 */

/**
 * LocalBusiness schema for Julian Delgado's web development services.
 */
export function LocalBusinessSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": "https://juliandelgado.com.au/#business",
        name: "Julian Delgado",
        description:
            "Web development and software solutions for Australian service businesses. Custom websites, web apps, and MVPs built to convert and scale.",
        url: "https://juliandelgado.com.au",
        email: "julianedelgado@hotmail.com",
        address: {
            "@type": "PostalAddress",
            addressLocality: "Toowoomba",
            addressRegion: "QLD",
            addressCountry: "AU",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: -27.5598,
            longitude: 151.9507,
        },
        areaServed: [
            {
                "@type": "Country",
                name: "Australia",
            },
            {
                "@type": "State",
                name: "Queensland",
            },
        ],
        serviceType: [
            "Web Development",
            "Software Development",
            "MVP Development",
            "Web Application Development",
            "UX Design",
        ],
        priceRange: "$$",
        founder: {
            "@type": "Person",
            name: "Julian Delgado",
            jobTitle: "Web Developer & Software Engineer",
            url: "https://juliandelgado.com.au/about-me",
        },
        sameAs: [
            "https://www.linkedin.com/in/julianedelgado/",
            "https://www.instagram.com/crafteddigital_/",
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * Service schema for web development services.
 */
export function WebDevelopmentServiceSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": "https://juliandelgado.com.au/#web-development",
        name: "Web Development & Custom Websites",
        description:
            "High-performance websites and web applications built with Next.js, React, and TypeScript. Perfect for Australian service businesses, tradies, and professionals.",
        provider: {
            "@type": "ProfessionalService",
            "@id": "https://juliandelgado.com.au/#business",
        },
        areaServed: {
            "@type": "Country",
            name: "Australia",
        },
        serviceType: "Web Development",
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * MVP Development service schema.
 */
export function MVPDevelopmentServiceSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": "https://juliandelgado.com.au/#mvp-development",
        name: "MVP Development & Software Prototyping",
        description:
            "Production-ready MVPs with clean architecture, strong UX, and room to scale. Ideal for startups and businesses across Australia looking to validate their ideas quickly.",
        provider: {
            "@type": "ProfessionalService",
            "@id": "https://juliandelgado.com.au/#business",
        },
        areaServed: {
            "@type": "Country",
            name: "Australia",
        },
        serviceType: "Software Development",
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * WebSite schema for search engine features.
 */
export function WebSiteSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://juliandelgado.com.au/#website",
        url: "https://juliandelgado.com.au",
        name: "Julian Delgado",
        description:
            "Web development and software solutions for Australian businesses",
        publisher: {
            "@type": "ProfessionalService",
            "@id": "https://juliandelgado.com.au/#business",
        },
        inLanguage: "en-AU",
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * Combined schema components for the main layout.
 */
export function StructuredData() {
    return (
        <>
            <LocalBusinessSchema />
            <WebSiteSchema />
            <WebDevelopmentServiceSchema />
            <MVPDevelopmentServiceSchema />
        </>
    );
}
