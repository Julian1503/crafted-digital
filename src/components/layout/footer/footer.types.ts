type FooterItem =
    | { label: string; type: "section"; id: string }
    | { label: string; type: "route"; href: string };


export type { FooterItem };