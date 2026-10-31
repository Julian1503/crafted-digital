import {NavItem} from "@/components/layout/header/header.types";

/**
 * Four destinations plus the call CTA. Section links on the home page were
 * replaced by real pages so every service has a URL to rank and share.
 */
const NAV_ITEMS: NavItem[] = [
    { name: "Work",     type: "route", href: "/case-studies" },
    { name: "Services", type: "route", href: "/services"     },
    { name: "Pricing",  type: "route", href: "/pricing"      },
    { name: "About",    type: "route", href: "/about-me"     },
];
const HERO_THRESHOLD = 0.58; // fraction of vh at which anim completes
const LOGO_FADE_START = 0.96; // progress at which logo begins to fade in (must be >= FloatingTitle fade-out start of 0.92)

export {NAV_ITEMS, HERO_THRESHOLD, LOGO_FADE_START};
