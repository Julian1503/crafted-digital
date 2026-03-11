export interface Slide { img: string; tag: string; year: string; }

export const slides: Slide[] = [
    { img: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772696966/hero-1", tag: "Creative Direction", year: "2026" },
    { img: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772696966/hero-2", tag: "Web Development",    year: "2026" },
    { img: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772696966/hero-3", tag: "Brand Identity",     year: "2026" },
    { img: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1772696966/hero-4", tag: "Digital Design",     year: "2026" },
];

export const INTERVAL  = 5000;
export const THRESHOLD = 0.58;
export const HEADER_H  = 64;
export const HEADER_PX = 40;

export const pad = (n: number): string => String(n + 1).padStart(2, "0");

export const cloudinaryUrl = (base: string, width: number, quality = 80): string =>
    base.replace("/upload/", `/upload/w_${width},q_${quality},f_auto/`);

export const buildSrcSet = (base: string): string => [
    `${cloudinaryUrl(base, 480,  75)} 480w`,
    `${cloudinaryUrl(base, 768,  80)} 768w`,
    `${cloudinaryUrl(base, 1280, 85)} 1280w`,
    `${cloudinaryUrl(base, 1920, 90)} 1920w`,
].join(", ");

export function easeInOutQuart(t: number): number {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}
