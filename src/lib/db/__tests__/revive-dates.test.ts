import { describe, it, expect } from "vitest";
import { reviveDates } from "@/lib/db/revive-dates";

describe("reviveDates", () => {
    it("turns ISO strings in date columns back into Dates", () => {
        const out = reviveDates({ publishedAt: "2026-10-31T00:00:00.000Z", title: "x" });
        expect(out.publishedAt).toBeInstanceOf(Date);
        expect((out.publishedAt as unknown as Date).toISOString()).toBe("2026-10-31T00:00:00.000Z");
        expect(out.title).toBe("x");
    });

    it("leaves real Date instances untouched (fresh reads during next build)", () => {
        const d = new Date("2026-10-31T00:00:00.000Z");
        const out = reviveDates({ publishedAt: d, updatedAt: d, author: { createdAt: d } });
        expect(out.publishedAt).toBe(d);
        expect(out.updatedAt).toBe(d);
        expect(out.author.createdAt).toBe(d);
    });

    it("walks arrays and keeps null and non-date strings", () => {
        const out = reviveDates([{ publishedAt: null, date: "not a date" }]);
        expect(out[0].publishedAt).toBeNull();
        expect(out[0].date).toBe("not a date");
    });
});
