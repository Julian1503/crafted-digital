
interface NavGroup {
    title: string;
    items: NavItem[];
}

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}


export type {NavGroup}