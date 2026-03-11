import {
    BookOpen,
    Briefcase,
    Calendar,
    CreditCard,
    FileText,
    LayoutDashboard, Plug, ScrollText, Settings,
    Shield, Tag,
    UserPlus,
    Users
} from "lucide-react";
import Image from "next/image";
import {NavGroup} from "@/components/admin/admin.types";

const NAV_GROUPS: NavGroup[] = [
    {
        title: "General",
        items: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }],
    },
    {
        title: "Access",
        items: [
            { label: "Users", href: "/admin/users", icon: Users },
            { label: "Roles", href: "/admin/roles", icon: Shield },
        ],
    },
    {
        title: "Content",
        items: [
            { label: "Content", href: "/admin/content", icon: FileText },
            { label: "Blog", href: "/admin/blog", icon: BookOpen },
            { label: "Case Studies", href: "/admin/case-studies", icon: Briefcase },
            { label: "Media", href: "/admin/media", icon: Image },
        ],
    },
    {
        title: "CRM",
        items: [
            { label: "Leads", href: "/admin/leads", icon: UserPlus },
            { label: "Bookings", href: "/admin/bookings", icon: Calendar },
        ],
    },
    {
        title: "Billing",
        items: [
            { label: "Plans", href: "/admin/plans", icon: CreditCard },
            { label: "Coupons", href: "/admin/coupons", icon: Tag },
        ],
    },
    {
        title: "System",
        items: [
            { label: "Integrations", href: "/admin/integrations", icon: Plug },
            { label: "Settings", href: "/admin/settings", icon: Settings },
            { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
        ],
    },
];

export { NAV_GROUPS };