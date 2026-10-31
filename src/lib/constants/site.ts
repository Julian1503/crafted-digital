/**
 * @fileoverview Site-wide constants shared by server and client components.
 */
export const SITE_URL = "https://juliandelgado.com.au";
export const SITE_NAME = "Julian Delgado";
export const CONTACT_EMAIL = "julianedelgado@hotmail.com";
export const CURRENT_YEAR = new Date().getFullYear();
export const RESPONSE_TIME = "within 24 hours";
export const FIT_CALL_LABEL = "Book a 20-minute call";

/**
 * The root `opengraph-image.tsx` is not inherited by a page that sets its own
 * `openGraph`, so those pages list it explicitly (resolved against metadataBase).
 */
export const DEFAULT_OG_IMAGE = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: "Julian Delgado: custom software, AI automation and websites for Australian small businesses",
};
