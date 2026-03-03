import type { CaseStudyBase, CaseStudyDetail } from "@/components/sections/Case-study/case-study.types";
import type { Project } from "@/components/sections/Work/work.types";

interface PrismaCaseStudy {
    slug: string;
    title: string;
    summary: string | null;
    body: string;
    coverImage: string | null;
    metaTitle: string | null;
    author: { id: string; name: string | null; email: string } | null;
}

export interface CaseStudyBody {
    challenge: string;
    approach: string[];
    solution: string;
    results: string[];
    technologies: string[];
    testimonial?: {
        quote: string;
        author: string;
        role: string;
    };
}

export function parseCaseStudyBody(body: string): CaseStudyBody | null {
    try {
        const parsed = JSON.parse(body) as CaseStudyBody;
        return {
            challenge: parsed.challenge ?? "",
            approach: Array.isArray(parsed.approach) ? parsed.approach : [],
            solution: parsed.solution ?? "",
            results: Array.isArray(parsed.results) ? parsed.results : [],
            technologies: Array.isArray(parsed.technologies) ? parsed.technologies : [],
            testimonial: parsed.testimonial ?? undefined,
        };
    } catch {
        return null;
    }
}

export function toCaseStudyCardProps(study: PrismaCaseStudy): CaseStudyBase {
    return {
        slug: study.slug,
        title: study.title,
        client: extractClient(study),
        category: extractCategory(study),
        description: study.summary ?? "",
        image: study.coverImage ?? "/placeholder-case-study.jpg",
    };
}

export function toCaseStudyDetailProps(study: PrismaCaseStudy): CaseStudyDetail | null {
    const body = parseCaseStudyBody(study.body);
    if (!body) return null;

    return {
        slug: study.slug,
        title: study.title,
        client: extractClient(study),
        category: extractCategory(study),
        description: study.summary ?? "",
        image: study.coverImage ?? "/placeholder-case-study.jpg",
        challenge: body.challenge,
        approach: body.approach,
        solution: body.solution,
        results: body.results,
        technologies: body.technologies,
        testimonial: body.testimonial
            ? {
                  quote: body.testimonial.quote,
                  author: body.testimonial.author,
                  role: body.testimonial.role,
              }
            : undefined,
    };
}

export function toProjectProps(study: PrismaCaseStudy): Project {
    return {
        title: study.title,
        brand: extractClient(study).toUpperCase(),
        category: extractCategory(study),
        readTime: "2 MIN READ",
        description: study.summary ?? "",
        image: study.coverImage ?? "/placeholder-case-study.jpg",
        href: `/case-studies/${study.slug}`,
    };
}

function extractClient(study: PrismaCaseStudy): string {
    const body = parseCaseStudyBody(study.body);
    if (body && "client" in (JSON.parse(study.body) as Record<string, unknown>)) {
        return (JSON.parse(study.body) as Record<string, string>).client;
    }
    return study.metaTitle ?? study.title;
}

function extractCategory(study: PrismaCaseStudy): string {
    const body = parseCaseStudyBody(study.body);
    if (body && "category" in (JSON.parse(study.body) as Record<string, unknown>)) {
        return (JSON.parse(study.body) as Record<string, string>).category;
    }
    return "Case Study";
}
