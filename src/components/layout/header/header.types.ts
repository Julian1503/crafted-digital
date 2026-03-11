type NavItem =
    | { name: string; type: "section"; id: string }
    | { name: string; type: "route";   href: string };

export type { NavItem };