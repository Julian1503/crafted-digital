/**
 * Base shape for a case study.
 * Used in listing and shared contexts where only high-level information is required.
 */
export interface CaseStudyBase {
    /** URL-friendly unique identifier */
    slug: string;

    /** Public title of the case study */
    title: string;

    /** Client or brand name */
    client: string;

    /** Business category or service type */
    category: string;

    /** Short summary used in previews and SEO */
    description: string;

    /** Cover image or thumbnail URL */
    image: string;
}

/**
 * Full case study model used on the detail page.
 * Extends the base model with in-depth project information.
 */
export interface CaseStudyDetail extends CaseStudyBase {
    /** Main problem or constraint the project aimed to solve */
    challenge: string;

    /** Step-by-step approach or methodology applied */
    approach: string[];

    /** Final solution delivered to the client */
    solution: string;

    /** Measurable or qualitative outcomes of the project */
    results: string[];

    /** Technologies, tools, or platforms used */
    technologies: string[];

    /** Optional client testimonial */
    testimonial?: CaseStudyTestimonial;
}

/**
 * Client testimonial associated with a case study.
 */
export interface CaseStudyTestimonial {
    /** Testimonial content */
    quote: string;

    /** Name of the person providing the testimonial */
    author: string;

    /** Role or position of the author */
    role: string;
}
