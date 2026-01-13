/**
 * @fileoverview Type definitions for Project/Work data.
 */

/**
 * Represents a portfolio project displayed in the Work section carousel.
 */
export interface Project {
    /** Display title of the project */
    title: string;
    /** Brand or company name associated with the project */
    brand: string;
    /** Category/type of work (e.g., "AI / Automation", "Healthcare") */
    category: string;
    /** Estimated read time for the case study */
    readTime: string;
    /** Brief description of the project and its impact */
    description: string;
    /** URL to the project's cover image */
    image: string;
    /** Link to the full case study or project page */
    href: string;
}