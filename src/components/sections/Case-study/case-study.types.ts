import {MotionValue} from "framer-motion";

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
    /** Images or screenshots of the project */
    gallery: string[];

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

/**
 * Additional types for stats and testimonials used in the case study detail view.
 * These can be extended or modified as needed to fit the design and content requirements.
 * 1. label: string;
 * 2. numericValue: number;
 * 3. prefix?: string;
 * 4. suffix?: string;
 */
export interface Stat        { label: string; numericValue: number; prefix?: string; suffix?: string; }

/**
 * Testimonial block displayed in the featured case study.
 */
export interface Testimonial { quote: string; author: string; role: string; avatar?: string; }

export interface StudyData   {
    slug: string; title: string; description: string; image: string;
    category: string; client: string; challenge: string;
    approach: string[]; solution: string; technologies: string[];
    results: string[]; testimonial?: Testimonial; stats?: Stat[];
    year?: string | number; gallery?: string[];
}

/**
 * Navigation data for case study listings.
 * 1. slug: string;
 * 2. title: string;
 * 3. image?: string;
 * 4. category?: string;
 */
export interface NavStudy {
    slug: string;
    title: string;
    image?: string;
    category?: string;
}

/**
 * Props for the CaseStudyView component.
 */
export interface CaseStudyViewProps {
    /** Data for the current case study being viewed in detail. */
    study: StudyData;
    /** Data for the prev case study being viewed in detail. */
    prevStudy: NavStudy | null;
    /** Data for the previous case study in the listing, used for navigation. Null if there is no previous study. */
    nextStudy: NavStudy | null;
}

/**
 * Props for the ChapterLabel component.
 */
export interface ChapterLabelProps {
    /** Index of the current chapter (1-based) */
    index: string;
    /** Label text for the chapter */
    label: string;
}

/**
 * Props for individual items in the ApproachSection list.
 */
export interface ApproachItemProps {
    /** Text content of the approach step */
    item:           string;
    /** Index of the current item in the list (1-based) */
    index:          number;
    /** Total number of items in the list */
    total:          number;
    /** MotionValue representing the scroll progress for animating the item */
    smoothProgress: MotionValue<number>;
}