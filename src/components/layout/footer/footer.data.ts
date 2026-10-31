import {FooterGroup} from "@/components/layout/footer/footer.types";

/** Three columns: what I sell, who I am, how to reach me (contact is rendered separately). */
const FOOTER_GROUPS: FooterGroup[] = [
    {
        title: "Services",
        links: [
            { label: "Websites",                        href: "/services/websites"        },
            { label: "Custom software & AI automation", href: "/services/custom-software" },
            { label: "Pricing",                         href: "/pricing"                  },
            { label: "How it works",                    href: "/services#process-heading" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "Work",         href: "/case-studies" },
            { label: "About",        href: "/about-me"     },
            { label: "Contact",      href: "/contact"      },
        ],
    },
];

export {FOOTER_GROUPS};
