import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { toStudyData, type PrismaCaseStudy } from "../mappers/case-study.mappers";
import { SUPPORTLEGEND_CASE_STUDY } from "../db/content/supportlegend-case-study";
import { pickFigures } from "@/components/sections/Case-study/gallery";

const row = { ...SUPPORTLEGEND_CASE_STUDY, challenges: null, solutions: null, results: null, customerId: null } as unknown as PrismaCaseStudy;

describe("SupportLegend case study", () => {
    it("parses as a v2 study with problem, approach, solution and results", () => {
        const study = toStudyData(row);

        expect(study).not.toBeNull();
        expect(study?.client).toBe("Own product");
        expect(study?.problemHeadline).toMatch(/support workers/i);
        expect(study?.approachSteps).toHaveLength(4);
        expect(study?.resultsRich?.length).toBeGreaterThan(0);
        expect(study?.technologies).toContain("Spring Boot");
    });

    it("makes no usage claims: no testimonial and no estimated figures", () => {
        const study = toStudyData(row);

        expect(study?.testimonial).toBeUndefined();
        const estimates = (study?.resultsRich ?? []).filter((r) => r.type === "metric" && r.estimate);
        expect(estimates).toHaveLength(0);
    });

    it("references images that exist and keeps the cover out of the screenshots", () => {
        const study = toStudyData(row);
        const files = [study?.image, ...(study?.gallery ?? [])];

        for (const src of files) {
            expect(existsSync(join(process.cwd(), "public", src ?? ""))).toBe(true);
        }
        const { hero, breaks } = pickFigures(study?.title ?? "", study?.gallery ?? [], study?.image);
        expect(hero?.src).not.toBe(study?.image);
        expect(breaks).toHaveLength(2);
    });
});
