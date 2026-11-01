/**
 * @fileoverview Turns a case study's screenshots into captioned figures.
 */

/** `02-post-media-library.png` becomes "Post media library". */
export function captionFromSrc(src: string): string {
    const file = decodeURIComponent(src.split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "");
    // Cloudinary uploads have opaque names such as file_vqahq7: no caption.
    if (/^file_[a-z0-9]+$/i.test(file)) return "";
    const words = file.replace(/^\d+[-_]/, "").replace(/[-_]+/g, " ").trim();
    return words ? words.charAt(0).toUpperCase() + words.slice(1) : "";
}

export interface Figure {
    src: string;
    alt: string;
    caption: string;
}

/**
 * The first screenshot leads the hero; up to `maxBreaks` others are shown as
 * framed figures further down. The cover photo (used outside the case study)
 * never appears here, and no image is shown twice.
 */
export function pickFigures(title: string, gallery: string[], cover: string | undefined, maxBreaks = 2): { hero?: Figure; breaks: Figure[] } {
    const unique = Array.from(new Set(gallery.filter((src) => src && src !== cover)));
    const toFigure = (src: string): Figure => {
        const caption = captionFromSrc(src);
        return { src, caption, alt: caption ? `${title}: ${caption.toLowerCase()}` : `${title}: screenshot` };
    };
    const [first, ...rest] = unique.map(toFigure);
    return { hero: first, breaks: rest.slice(0, maxBreaks) };
}
