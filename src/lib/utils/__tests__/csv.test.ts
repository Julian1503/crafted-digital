import { describe, it, expect } from "vitest";
import { csvCell, csvRow } from "@/lib/utils/csv";

describe("csvCell", () => {
    it("returns an empty string for null and undefined", () => {
        expect(csvCell(null)).toBe("");
        expect(csvCell(undefined)).toBe("");
    });

    it("leaves plain text untouched", () => {
        expect(csvCell("Jane Citizen")).toBe("Jane Citizen");
    });

    it("quotes values that contain commas, quotes or newlines", () => {
        expect(csvCell("a,b")).toBe('"a,b"');
        expect(csvCell('say "hi"')).toBe('"say ""hi"""');
        expect(csvCell("line1\nline2")).toBe('"line1\nline2"');
    });

    it("neutralises formula-leading cells", () => {
        expect(csvCell('=HYPERLINK("http://evil")')).toBe('"\'=HYPERLINK(""http://evil"")"');
        expect(csvCell("+61 400 000 000")).toBe('"\'+61 400 000 000"');
        expect(csvCell("-5")).toBe('"\'-5"');
        expect(csvCell("@user")).toBe('"\'@user"');
    });

    it("serialises dates as ISO strings", () => {
        expect(csvCell(new Date("2026-10-31T00:00:00Z"))).toBe("2026-10-31T00:00:00.000Z");
    });
});

describe("csvRow", () => {
    it("joins escaped cells with commas", () => {
        expect(csvRow(["id", "a,b", null, "=x"])).toBe('id,"a,b",,"\'=x"');
    });
});
