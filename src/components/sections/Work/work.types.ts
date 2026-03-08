/**
 * @fileoverview Type definitions for Project/Work data.
 */

/**
 * Animated stat displayed in the featured case study.
 */
export interface ProjectStat {
    label: string;
    numericValue: number;
    prefix?: string;
    suffix?: string;
}

/**
 * Testimonial block displayed in the featured case study.
 */
export interface ProjectTestimonial {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
}

/**
 * Customer / brand associated with a project.
 */
export interface ProjectCompany {
    name: string;
    /** URL to the logo image — rendered with CSS invert on the dark background */
    logo?: string;
}

/**
 * Represents a portfolio project displayed in the Work section.
 *
 * All fields except `title` and `image` are optional so that both the
 * fallback static data and the Prisma-backed mapper can implement the
 * interface incrementally.
 */
export interface Project {
    /** Display title of the project */
    title: string;

    /** URL slug — used to build the auto href `/case-studies/:slug` */
    slug?: string;

    /** URL to the project's cover image */
    image: string;

    /**
     * Explicit link to the full case study.
     * Falls back to `/case-studies/:slug` when omitted.
     */
    href?: string;

    /** Publication year, e.g. 2024 */
    year?: string | number;

    /** Customer / brand info (name + optional logo) */
    company?: ProjectCompany;

    /** Primary industry label, e.g. "Healthcare" */
    industry?: string;

    /**
     * Comma-separated list of tools used.
     * Rendered in the meta grid of the featured card.
     */
    tools?: string;

    /** One-liner challenge statement */
    challenge?: string;

    /** One-liner solution statement */
    solution?: string;

    /**
     * Category / type of work.
     * Used as a fallback label in the secondary-case list when `industry`
     * is not available, e.g. "AI / Automation".
     */
    category?: string;

    /** Brief description / summary (not rendered in Work.tsx but kept for SEO / other uses) */
    description?: string;

    /** Animated result counters shown below the meta grid */
    stats?: ProjectStat[];

    /** Client testimonial shown at the bottom of the featured card */
    testimonial?: ProjectTestimonial;
}