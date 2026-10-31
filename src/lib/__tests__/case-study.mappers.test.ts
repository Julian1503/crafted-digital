import { describe, expect, it } from "vitest";
import { parseCaseStudyBody, toCaseStudyCardProps, toStudyData, type PrismaCaseStudy } from "../mappers/case-study.mappers";

const bodyV2 = JSON.stringify({
  version: 2,
  client: "AI4L",
  category: "Education",
  problem: {
    headline: "The team couldn't update their own website.",
    detail: "The marketing team depended on engineers for every change.",
  },
  approach: [
    { title: "Audit", body: "Reviewed the existing platform and publishing flow." },
    { title: "Rebuild", body: "Moved to a scalable content model and cleaner frontend." },
  ],
  solution: {
    headline: "A maintainable publishing platform.",
    body: "The new setup let the team publish confidently without engineering help.",
  },
  results: [
    { type: "metric", metric: "3x", label: "faster updates" },
    { type: "text", body: "The team regained ownership of their website." },
  ],
  stack: ["Next.js", "TypeScript"],
  testimonial: {
    quote: "We can finally move without blockers.",
    author: "Jane Doe",
    role: "Marketing Lead",
  },
});

const baseStudy: PrismaCaseStudy = {
  slug: "ai4l-automation-and-web-platform",
  title: "Transforming AI4L's Digital Presence from Fragile to Scalable",
  summary: "A scalable rebuild for a growing education startup.",
  body: bodyV2,
  coverImage: null,
  metaTitle: null,
  gallery: "",
  challenges: null,
  solutions: null,
  results: null,
  publishedAt: new Date("2026-03-01T00:00:00.000Z"),
  author: null,
};

describe("parseCaseStudyBody", () => {
  it("parses plain JSON bodies", () => {
    const parsed = parseCaseStudyBody(bodyV2);

    expect(parsed).not.toBeNull();
    expect(parsed?.client).toBe("AI4L");
    expect(parsed?.problemHeadline).toBe("The team couldn't update their own website.");
    expect(parsed?.approachSteps).toHaveLength(2);
  });

  it("parses JSON bodies wrapped in backticks", () => {
    const parsed = parseCaseStudyBody(`\`${bodyV2}\``);

    expect(parsed).not.toBeNull();
    expect(parsed?.category).toBe("Education");
    expect(parsed?.resultsRich?.[0]).toEqual({ type: "metric", metric: "3x", label: "faster updates" });
  });

  it("parses fenced JSON bodies", () => {
    const parsed = parseCaseStudyBody("```json\n" + bodyV2 + "\n```");

    expect(parsed).not.toBeNull();
    expect(parsed?.technologies).toEqual(["Next.js", "TypeScript"]);
  });
});

describe("case study public mappers", () => {
  it("keeps client/category available in card props when body is wrapped", () => {
    const wrappedStudy: PrismaCaseStudy = { ...baseStudy, body: `\`${bodyV2}\`` };

    expect(toCaseStudyCardProps(wrappedStudy)).toMatchObject({
      client: "AI4L",
      category: "Education",
    });
  });

  it("maps wrapped V2 bodies into StudyData for the slug page", () => {
    const wrappedStudy: PrismaCaseStudy = { ...baseStudy, body: `\`${bodyV2}\`` };
    const mapped = toStudyData(wrappedStudy);

    expect(mapped).not.toBeNull();
    expect(mapped).toMatchObject({
      slug: baseStudy.slug,
      client: "AI4L",
      category: "Education",
      solutionHeadline: "A maintainable publishing platform.",
    });
    expect(mapped?.resultsRich).toHaveLength(2);
  });
});
