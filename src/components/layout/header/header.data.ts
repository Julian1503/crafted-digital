import {NavItem} from "@/components/layout/header/header.types";

const NAV_ITEMS: NavItem[] = [
    { name: "Work",         type: "section", id: "work"     },
    { name: "Services",     type: "section", id: "services" },
    { name: "Process",      type: "section", id: "process"  },
    { name: "Pricing",      type: "section", id: "pricing"  },
    { name: "Contact",      type: "section", id: "contact"  },
    { name: "About",        type: "route",   href: "/about-me"     },
    { name: "Case Studies", type: "route",   href: "/case-studies" },
    // { name: "Blog",         type: "route",   href: "/blog"         },
];
const HERO_THRESHOLD = 0.58; // fraction of vh at which anim completes
const LOGO_FADE_START = 0.96; // progress at which logo begins to fade in (must be >= FloatingTitle fade-out start of 0.92)

export {NAV_ITEMS, HERO_THRESHOLD, LOGO_FADE_START};