import { describe, it, expect } from "vitest";
import { captionFromSrc, pickFigures } from "@/components/sections/Case-study/gallery";

describe("captionFromSrc", () => {
    it("turns a numbered file name into a sentence-case caption", () => {
        expect(captionFromSrc("/img/projects/wrcc/02-post-media-library.png")).toBe("Post media library");
        expect(captionFromSrc("/img/projects/CRM-Ai4L/contacts-dashboard.webp")).toBe("Contacts dashboard");
    });

    it("returns no caption for opaque upload names", () => {
        expect(captionFromSrc("https://res.cloudinary.com/x/image/upload/v1/crafted-digital/file_vqahq7.png")).toBe("");
    });
});

describe("pickFigures", () => {
    const gallery = ["/a/01-one.png", "/a/02-two.png", "/a/03-three.png", "/a/04-four.png"];

    it("uses the first screenshot for the hero and caps the breaks", () => {
        const { hero, breaks } = pickFigures("Studio", gallery, "/covers/photo.webp");
        expect(hero?.src).toBe("/a/01-one.png");
        expect(breaks.map((f) => f.src)).toEqual(["/a/02-two.png", "/a/03-three.png"]);
        expect(breaks[0].alt).toBe("Studio: two");
    });

    it("never repeats the cover or a duplicate screenshot", () => {
        const { hero, breaks } = pickFigures("X", ["/c.webp", "/a/01-one.png", "/a/01-one.png", "/a/02-two.png"], "/c.webp");
        expect(hero?.src).toBe("/a/01-one.png");
        expect(breaks.map((f) => f.src)).toEqual(["/a/02-two.png"]);
    });

    it("returns nothing for an empty gallery", () => {
        expect(pickFigures("X", [], "/c.webp")).toEqual({ hero: undefined, breaks: [] });
    });
});
