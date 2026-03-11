/**
 * @fileoverview Maps Prisma CaseStudy records to the various component prop
 * shapes used across the app:
 *
 *  • toCaseStudyCardProps   → CaseStudyBase   (card / list views)
 *  • toCaseStudyDetailProps → CaseStudyDetail (full case-study page)
 *  • toProjectProps         → Project         (Work section carousel)
 *
 * The base `PrismaCaseStudy` interface is kept for backward compatibility with
 * callers that only include scalar fields. `CaseStudyWithRelations` extends it
 * with the Prisma relations required by the Work component.
 */

import type { CaseStudyBase, CaseStudyDetail } from "@/components/sections/Case-study/case-study.types";
import type { Project, ProjectStat } from "@/components/sections/Work/work.types";

// ─── Prisma input shapes ──────────────────────────────────────────────────────

/**
 * Minimal scalar shape — used by toCaseStudyCardProps / toCaseStudyDetailProps.
 * Keeps backward compatibility with any existing callers.
 */
export interface PrismaCaseStudy {
    slug:        string;
    title:       string;
    summary:     string | null;
    body:        string;
    coverImage:  string | null;
    metaTitle:   string | null;
    gallery:     string | null;
    challenges:  string | null;
    solutions:   string | null;
    results:     string | null;
    publishedAt: Date   | null;
    author:      { id: string; name: string | null; email: string } | null;
}

/**
 * Extended shape returned by getPublishedCaseStudies — includes all relations
 * needed to fully populate the Work section card.
 */
export interface CaseStudyWithRelations extends PrismaCaseStudy {
    customer:              { id: string; name: string; logo: string | null } | null;
    caseStudyIndustries:   { industry:   { name: string } }[];
    caseStudyTools:        { tool:       { name: string } }[];
    caseStudyTechnologies: { technology: { name: string } }[];
}

// ─── Body JSON shape ──────────────────────────────────────────────────────────

export interface CaseStudyBody {
    challenge:    string;
    approach:     string[];
    solution:     string;
    results:      string[];
    technologies: string[];
    /** Optional client/category overrides embedded in the body JSON */
    client?:      string;
    category?:    string;
    testimonial?: {
        quote:  string;
        author: string;
        role:   string;
    };
}

// ─── Parsers ──────────────────────────────────────────────────────────────────

export function parseCaseStudyBody(body: string): CaseStudyBody | null {
    try {
        const parsed = JSON.parse(body) as CaseStudyBody;
        return {
            challenge:    parsed.challenge   ?? "",
            approach:     Array.isArray(parsed.approach)     ? parsed.approach     : [],
            solution:     parsed.solution    ?? "",
            results:      Array.isArray(parsed.results)      ? parsed.results      : [],
            technologies: Array.isArray(parsed.technologies) ? parsed.technologies : [],
            client:       parsed.client      ?? undefined,
            category:     parsed.category    ?? undefined,
            testimonial:  parsed.testimonial ?? undefined,
        };
    } catch {
        return null;
    }
}

/**
 * Parses `results` stored as a JSON string into ProjectStat[].
 *
 * Expected shape: [{ "label": "Uptime", "numericValue": 99, "suffix": "%" }, ...]
 */
function parseStats(results: string | null | undefined): ProjectStat[] | undefined {
    if (!results) return undefined;
    try {
        const parsed = JSON.parse(results);
        if (!Array.isArray(parsed)) return undefined;
        return parsed as ProjectStat[];
    } catch {
        return undefined;
    }
}

// ─── Shared extractors ────────────────────────────────────────────────────────

/**
 * Resolves the client/brand name.
 * Priority: customer relation → body JSON `client` field → metaTitle → title.
 */
function extractClient(study: PrismaCaseStudy & { customer?: { name: string } | null }): string {
    if (study.customer?.name) return study.customer.name;
    try {
        const parsed = JSON.parse(study.body) as Record<string, unknown>;
        if (typeof parsed.client === "string") return parsed.client;
    } catch { /* ignore */ }
    return study.metaTitle ?? study.title;
}

/**
 * Resolves the primary category/industry label.
 * Priority: first industry relation → body JSON `category` field → "Case Study".
 */
function extractCategory(
    study: PrismaCaseStudy & { caseStudyIndustries?: { industry: { name: string } }[] }
): string {
    const relIndustry = study.caseStudyIndustries?.[0]?.industry?.name;
    if (relIndustry) return relIndustry;
    try {
        const parsed = JSON.parse(study.body) as Record<string, unknown>;
        if (typeof parsed.category === "string") return parsed.category;
    } catch { /* ignore */ }
    return "Case Study";
}

/**
 * Resolves the gallery images.
 * Priority: transforms a simple string in a string array → body JSON `gallery` field → empty array.
 */
function extractGallery(gallery: string | null | undefined) : string[] {
    if (!gallery || gallery.trim().length === 0) return [];
    return gallery.split(",").map(img => img.trim());
}

// ─── Public mappers ───────────────────────────────────────────────────────────

/** Maps to the card/list shape used by CaseStudy listing pages. */
export function toCaseStudyCardProps(study: PrismaCaseStudy): CaseStudyBase {
    return {
        slug:        study.slug,
        title:       study.title,
        client:      extractClient(study),
        category:    extractCategory(study),
        description: study.summary    ?? "",
        image:       study.coverImage ?? "/placeholder-case-study.jpg",
    };
}

/** Maps to the full detail shape used by the individual case-study page. */
export function toCaseStudyDetailProps(study: PrismaCaseStudy): CaseStudyDetail | null {
    const body = parseCaseStudyBody(study.body);
    if (!body) return null;

    return {
        slug:         study.slug,
        title:        study.title,
        client:       extractClient(study),
        category:     extractCategory(study),
        description:  study.summary    ?? "",
        image:        study.coverImage ?? "/placeholder-case-study.jpg",
        gallery:      extractGallery(study.gallery),
        challenge:    body.challenge,
        approach:     body.approach,
        solution:     body.solution,
        results:      body.results,
        technologies: body.technologies,
        testimonial:  body.testimonial
            ? {
                quote:  body.testimonial.quote,
                author: body.testimonial.author,
                role:   body.testimonial.role,
            }
            : undefined,
    };
}

/**
 * Maps to the Project shape consumed by the Work section carousel.
 * Requires the full `CaseStudyWithRelations` type (customer + industry + tools).
 */
export function toProjectProps(study: CaseStudyWithRelations): Project {
    const year = study.publishedAt
        ? new Date(study.publishedAt).getFullYear()
        : undefined;

    const company = study.customer
        ? { name: study.customer.name, logo: study.customer.logo ?? undefined }
        : undefined;

    const industry  = extractCategory(study);
    const toolsList = study.caseStudyTools
        ?.map((ct) => ct.tool.name)
        .join(", ") || undefined;

    // Body is the authoritative source for testimonial (not a separate DB field)
    const bodyParsed  = parseCaseStudyBody(study.body);
    const testimonial = bodyParsed?.testimonial
        ? {
            quote:  bodyParsed.testimonial.quote,
            author: bodyParsed.testimonial.author,
            role:   bodyParsed.testimonial.role,
        }
        : undefined;

    return {
        title:       study.title,
        slug:        study.slug,
        image:       study.coverImage ?? "/placeholder-case-study.jpg",
        href:        `/case-studies/${study.slug}`,
        gallery:    extractGallery(study.gallery),
        year,
        company,
        industry,
        tools:       toolsList,
        // Prefer dedicated DB columns; fall back to body JSON fields
        challenge:   study.challenges ?? bodyParsed?.challenge ?? undefined,
        solution:    study.solutions  ?? bodyParsed?.solution  ?? undefined,
        category:    industry,
        description: study.summary   ?? "",
        stats:       parseStats(study.results),
        testimonial,
    };
}