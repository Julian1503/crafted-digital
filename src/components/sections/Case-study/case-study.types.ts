// ─── Primitives ───────────────────────────────────────────────────────────────

export interface Stat {
  label: string;
  numericValue: number;
  prefix?: string;
  suffix?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
}

/** A titled step in the approach section (V2 format) */
export interface ApproachStep {
  title: string;
  body: string;
}

/** A result item — either a metric (big number) or plain text */
export type ResultItem =
  | { type: "metric"; metric: string; label: string; /** True when the figure is an estimate, not a measurement. */ estimate?: boolean }
  | { type: "text"; body: string };

// ─── Main view-model passed to every section component ───────────────────────

export interface StudyData {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  client: string;
  year?: string | number;
  /** ISO dates from the CMS, when published. */
  publishedAt?: string;
  updatedAt?: string;
  gallery?: string[];
  stats?: Stat[];

  /** Full challenge text (backward compat) */
  challenge: string;
  /** Short punchy headline for the problem section (V2) */
  problemHeadline?: string;

  /** Plain approach paragraphs (backward compat) */
  approach: string[];
  /** Titled steps (V2) — used when present, falls back to `approach` */
  approachSteps?: ApproachStep[];

  /** Full solution text */
  solution: string;
  /** Short bold headline for solution section (V2) */
  solutionHeadline?: string;

  /** Plain text results (backward compat) */
  results: string[];
  /** Rich result items with optional metric (V2) */
  resultsRich?: ResultItem[];

  /** Tech / tool names */
  technologies: string[];

  testimonial?: Testimonial;
}

// ─── Listing / nav shapes ─────────────────────────────────────────────────────

export interface CaseStudyBase {
  slug: string;
  title: string;
  client: string;
  category: string;
  description: string;
  image: string;
}

export interface NavStudy {
  slug: string;
  title: string;
  image?: string;
  category?: string;
  description?: string;
}

// ─── Component props ──────────────────────────────────────────────────────────

export interface CaseStudyViewProps {
  study: StudyData;
  prevStudy: NavStudy | null;
  nextStudy: NavStudy | null;
}

export interface ChapterLabelProps {
  index: string;
  label: string;
  /** Controls text colour — default "dark" (light text on dark bg) */
  theme?: "dark" | "light";
}
