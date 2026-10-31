/**
 * @fileoverview Real client quotes, verbatim from the published case studies.
 * Used wherever social proof sits next to a call to action.
 */
export interface Testimonial {
    quote: string;
    author: string;
    role: string;
    /** Slug of the case study the quote comes from. */
    caseStudy?: string;
}

export const TESTIMONIALS: Testimonial[] = [
    {
        quote: "Having someone who understood both the technical side and our audience made a huge difference. We went from being stuck to having a platform we actually own and a system that runs itself in the background.",
        author: "Mohammed",
        role: "Founder, AI4L",
        caseStudy: "ai4l-automation-and-web-platform",
    },
    {
        quote: "The new platform feels much more like us. It communicates our services clearly, looks professional, and gives people a much better first impression of who we are and how we support them.",
        author: "Zoe Thomas",
        role: "Provider Manager, The Better Day",
        caseStudy: "the-better-day-support-platform",
    },
    {
        quote: "The website feels like a true extension of my work. It presents the projects with clarity and elegance, and gives my portfolio a much stronger professional presence.",
        author: "Lourdes Ynigo",
        role: "Architecture graduate",
        caseStudy: "architect-portfolio-website",
    },
];
