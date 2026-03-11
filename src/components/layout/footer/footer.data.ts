import {FooterItem} from "@/components/layout/footer/footer.types";

const FOOTER_LINKS: FooterItem[] = [
    { label: "Work",         type: "section", id: "work"          },
    { label: "Services",     type: "section", id: "services"      },
    { label: "Process",      type: "section", id: "process"       },
    { label: "Pricing",      type: "section", id: "pricing"       },
    { label: "ContactSection",      type: "section", id: "contact"       },
    { label: "Case Studies", type: "route",   href: "/case-studies" },
    { label: "Blog",         type: "route",   href: "/blog"         },
    { label: "About",        type: "route",   href: "/about-me"     },
];

export {FOOTER_LINKS};