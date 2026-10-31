/**
 * @fileoverview Maps Prisma CaseStudy records to component prop shapes.
 *
 * Body JSON formats supported:
 *
 * ── V1 (original) ──────────────────────────────────────────────────────────
 * {
 *   "challenge":    "string",
 *   "approach":     ["string"],
 *   "solution":     "string",
 *   "results":      ["string"],
 *   "technologies": ["string"],
 *   "client?":      "string",
 *   "category?":    "string",
 *   "testimonial?": { quote, author, role }
 * }
 *
 * ── V2 (new) ────────────────────────────────────────────────────────────────
 * {
 *   "version": 2,
 *   "problem":  { "headline": "...", "detail": "..." },
 *   "approach": [{ "title": "...", "body": "..." }],
 *   "solution": { "headline?": "...", "body": "..." },
 *   "results":  [
 *     { "type": "metric", "metric": "3×", "label": "faster deploys" },
 *     { "type": "text",   "body": "Platform ownership restored." }
 *   ],
 *   "stack":        ["Next.js", "TypeScript"],
 *   "client?":      "string",
 *   "category?":    "string",
 *   "testimonial?": { quote, author, role, avatar? }
 * }
 */

import type { CaseStudyBase, CaseStudyDetail, StudyData, ApproachStep, ResultItem } from "@/components/sections/Case-study/case-study.types";
import type { Project, ProjectStat } from "@/components/sections/Work/work.types";
import { parseResultMetric } from "@/components/sections/Case-study/case-study.constants";

// ─── Prisma input shapes ──────────────────────────────────────────────────────

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

export interface CaseStudyWithRelations extends PrismaCaseStudy {
  customer:              { id: string; name: string; logo: string | null } | null;
  caseStudyIndustries:   { industry:   { name: string } }[];
  caseStudyTools:        { tool:       { name: string } }[];
  caseStudyTechnologies: { technology: { name: string } }[];
}

// ─── Raw body shapes ──────────────────────────────────────────────────────────

interface BodyV1 {
  challenge:    string;
  approach:     string[];
  solution:     string;
  results:      string[];
  technologies: string[];
  client?:      string;
  category?:    string;
  testimonial?: { quote: string; author: string; role: string; avatar?: string };
}

interface BodyV2 {
  version:  2;
  problem:  { headline: string; detail: string };
  approach: { title: string; body: string }[];
  solution: { headline?: string; body: string };
  results:  Array<
    | { type: "metric"; metric: string; label: string }
    | { type: "text";   body: string }
  >;
  stack:       string[];
  client?:     string;
  category?:   string;
  testimonial?: { quote: string; author: string; role: string; avatar?: string };
}

function normalizeCaseStudyBody(raw: string): string {
  const trimmed = raw.trim().replace(/^\uFEFF/, "");

  if (trimmed.startsWith("```")) {
    const withoutOpenFence = trimmed.replace(/^```[a-zA-Z]*\s*/, "");
    return withoutOpenFence.replace(/\s*```$/, "").trim();
  }

  if (trimmed.startsWith("`") && trimmed.endsWith("`") && trimmed.length >= 2) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

// ─── Parser ───────────────────────────────────────────────────────────────────

export function parseCaseStudyBody(raw: string): {
  // Normalized fields always available regardless of version
  challenge:       string;
  problemHeadline: string | undefined;
  approach:        string[];
  approachSteps:   ApproachStep[];
  solution:        string;
  solutionHeadline:string | undefined;
  results:         string[];
  resultsRich:     ResultItem[];
  technologies:    string[];
  client:          string | undefined;
  category:        string | undefined;
  testimonial:     BodyV1["testimonial"] | undefined;
} | null {
  try {
    const parsed = JSON.parse(normalizeCaseStudyBody(raw)) as Record<string, unknown>;

    // ── V2 ──────────────────────────────────────────────────────────────────
    if (parsed.version === 2) {
      const b = parsed as unknown as BodyV2;
      const approachSteps: ApproachStep[] = b.approach.map(s => ({ title: s.title, body: s.body }));
      const resultsRich: ResultItem[] = b.results.map(r =>
        r.type === "metric"
          ? { type: "metric" as const, metric: r.metric, label: r.label }
          : { type: "text"   as const, body: (r as { type: "text"; body: string }).body }
      );

      return {
        challenge:        b.problem.detail,
        problemHeadline:  b.problem.headline,
        approach:         approachSteps.map(s => s.body),
        approachSteps,
        solution:         b.solution.body,
        solutionHeadline: b.solution.headline,
        results:          resultsRich.map(r => r.type === "metric" ? `${r.metric} ${r.label}` : r.body),
        resultsRich,
        technologies:     b.stack ?? [],
        client:           b.client,
        category:         b.category,
        testimonial:      b.testimonial,
      };
    }

    // ── V1 (fallback) ────────────────────────────────────────────────────────
    const b = parsed as unknown as BodyV1;

    // Build approachSteps from plain strings (no titles in V1)
    const approachSteps: ApproachStep[] = (b.approach ?? []).map((text, i) => ({
      title: `Step ${String(i + 1).padStart(2, "0")}`,
      body:  text,
    }));

    // Build resultsRich from strings — detect leading metric pattern
    const resultsRich: ResultItem[] = (b.results ?? []).map(text => {
      const m = parseResultMetric(text);
      return m
        ? { type: "metric" as const, metric: m.metric, label: m.rest }
        : { type: "text"   as const, body: text };
    });

    // Extract problem headline: first sentence of challenge
    const challengeMatch = (b.challenge ?? "").match(/^(.+?[.!?])\s+/);
    const problemHeadline = challengeMatch ? challengeMatch[1] : undefined;

    return {
      challenge:        b.challenge   ?? "",
      problemHeadline,
      approach:         b.approach    ?? [],
      approachSteps,
      solution:         b.solution    ?? "",
      solutionHeadline: undefined,
      results:          b.results     ?? [],
      resultsRich,
      technologies:     b.technologies ?? [],
      client:           b.client,
      category:         b.category,
      testimonial:      b.testimonial,
    };
  } catch {
    return null;
  }
}

// ─── Shared extractors ────────────────────────────────────────────────────────

function extractClient(study: PrismaCaseStudy & { customer?: { name: string } | null }): string {
  if (study.customer?.name) return study.customer.name;
  try {
    const p = JSON.parse(normalizeCaseStudyBody(study.body)) as Record<string, unknown>;
    if (typeof p.client === "string") return p.client;
  } catch { /* ignore */ }
  return study.metaTitle ?? study.title;
}

function extractCategory(
  study: PrismaCaseStudy & { caseStudyIndustries?: { industry: { name: string } }[] }
): string {
  const rel = study.caseStudyIndustries?.[0]?.industry?.name;
  if (rel) return rel;
  try {
    const p = JSON.parse(normalizeCaseStudyBody(study.body)) as Record<string, unknown>;
    if (typeof p.category === "string") return p.category;
  } catch { /* ignore */ }
  return "Case Study";
}

function extractGallery(gallery: string | null | undefined): string[] {
  if (!gallery?.trim()) return [];
  return gallery.split(",").map(s => s.trim()).filter(Boolean);
}

// ─── Public mappers ───────────────────────────────────────────────────────────

export function toCaseStudyCardProps(study: PrismaCaseStudy): CaseStudyBase {
  return {
    slug:        study.slug,
    title:       study.title,
    client:      extractClient(study),
    category:    extractCategory(study),
    description: study.summary    ?? "",
    image:       study.coverImage ?? "/placeholder-case-study.webp",
  };
}

export function toCaseStudyDetailProps(study: PrismaCaseStudy): CaseStudyDetail | null {
  const body = parseCaseStudyBody(study.body);
  if (!body) return null;

  return {
    slug:         study.slug,
    title:        study.title,
    client:       extractClient(study),
    category:     extractCategory(study),
    description:  study.summary    ?? "",
    image:        study.coverImage ?? "/placeholder-case-study.webp",
    gallery:      extractGallery(study.gallery),
    challenge:    body.challenge,
    approach:     body.approach,
    solution:     body.solution,
    results:      body.results,
    technologies: body.technologies,
    testimonial:  body.testimonial,
  };
}

/** Full StudyData used by CaseStudyView — includes all V2 rich fields */
export function toStudyData(study: PrismaCaseStudy & { customer?: { name: string } | null; caseStudyIndustries?: { industry: { name: string } }[] }): StudyData | null {
  const body = parseCaseStudyBody(study.body);
  if (!body) return null;

  const year = study.publishedAt ? new Date(study.publishedAt).getFullYear() : undefined;

  return {
    slug:             study.slug,
    title:            study.title,
    client:           body.client     ?? extractClient(study),
    category:         body.category   ?? extractCategory(study),
    description:      study.summary   ?? "",
    image:            study.coverImage ?? "/placeholder-case-study.webp",
    gallery:          extractGallery(study.gallery),
    year,
    challenge:        body.challenge,
    problemHeadline:  body.problemHeadline,
    approach:         body.approach,
    approachSteps:    body.approachSteps,
    solution:         body.solution,
    solutionHeadline: body.solutionHeadline,
    results:          body.results,
    resultsRich:      body.resultsRich,
    technologies:     body.technologies,
    testimonial:      body.testimonial,
  };
}

function parseStats(raw: string | null | undefined): ProjectStat[] | undefined {
  if (!raw) return undefined;
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? (p as ProjectStat[]) : undefined;
  } catch { return undefined; }
}

export function toProjectProps(study: CaseStudyWithRelations): Project {
  const year      = study.publishedAt ? new Date(study.publishedAt).getFullYear() : undefined;
  const company   = study.customer ? { name: study.customer.name, logo: study.customer.logo ?? undefined } : undefined;
  const industry  = extractCategory(study);
  const toolsList = study.caseStudyTools?.map(ct => ct.tool.name).join(", ") || undefined;
  const body      = parseCaseStudyBody(study.body);

  return {
    title:       study.title,
    slug:        study.slug,
    image:       study.coverImage ?? "/placeholder-case-study.webp",
    href:        `/case-studies/${study.slug}`,
    gallery:     extractGallery(study.gallery),
    year,
    company,
    industry,
    tools:       toolsList,
    challenge:   study.challenges ?? body?.challenge,
    solution:    study.solutions  ?? body?.solution,
    category:    industry,
    description: study.summary ?? "",
    stats:       parseStats(study.results),
    testimonial: body?.testimonial,
  };
}
