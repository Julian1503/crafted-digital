"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  BookOpen,
  Briefcase,
  Image,
  UserPlus,
  Calendar,
  CreditCard,
  Tag,
  Plug,
  Settings,
  ScrollText,
  ChevronDown,
  ChevronLeft,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface AdminShellProps {
  user: { name: string; email: string; image: string | null };
  children: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Navigation config                                                 */
/* ------------------------------------------------------------------ */

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

const SIDEBAR_KEY = "admin-sidebar-collapsed";
const GROUPS_KEY = "admin-sidebar-groups";

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();

  // Sidebar collapsed state
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Expanded groups (open by default)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(NAV_GROUPS.map((g) => [g.title, true]))
  );

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_KEY);
      if (stored !== null) setCollapsed(stored === "true");
      const groups = localStorage.getItem(GROUPS_KEY);
      if (groups) setExpandedGroups(JSON.parse(groups));
    } catch {
      // ignore
    }
  }, []);

  // Persist sidebar state
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, String(collapsed));
    } catch {
      // ignore
    }
  }, [collapsed]);

  useEffect(() => {
    try {
      localStorage.setItem(GROUPS_KEY, JSON.stringify(expandedGroups));
    } catch {
      // ignore
    }
  }, [expandedGroups]);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleGroup = useCallback((title: string) => {
    setExpandedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  }, []);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* ---- Sidebar content (shared between desktop & mobile) ---- */

  function SidebarContent({ isMobile = false }: { isMobile?: boolean }) {
    return (
      <nav
        className="flex h-full flex-col"
        aria-label="Admin navigation"
      >
        {/* Logo / brand */}
        <div className="flex h-14 items-center gap-2 border-b border-white/10 px-4">
          {(!collapsed || isMobile) && (
            <span className="text-lg font-bold text-white">Admin</span>
          )}
          {!isMobile && (
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="ml-auto rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors duration-150"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={cn(
                  "size-4 transition-transform duration-200",
                  collapsed && "rotate-180"
                )}
              />
            </button>
          )}
        </div>

        {/* Nav groups */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          {NAV_GROUPS.map((group) => {
            const open = expandedGroups[group.title] ?? true;
            return (
              <div key={group.title} className="mb-1">
                {/* Group header */}
                {(!collapsed || isMobile) && (
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors duration-150"
                  >
                    <span className="flex-1 text-left">{group.title}</span>
                    <ChevronDown
                      className={cn(
                        "size-3 transition-transform duration-200",
                        !open && "-rotate-90"
                      )}
                    />
                  </button>
                )}

                {/* Group items with CSS grid height animation */}
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200 ease-out",
                    collapsed && !isMobile
                      ? "grid-rows-[1fr]"
                      : open
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                            active
                              ? "border-l-2 border-secondary bg-white/10 text-white"
                              : "border-l-2 border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                          )}
                          title={collapsed && !isMobile ? item.label : undefined}
                        >
                          <Icon className="size-4 shrink-0" />
                          {(!collapsed || isMobile) && (
                            <span>{item.label}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ---- Desktop sidebar ---- */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-[hsl(222,47%,11%)] transition-all duration-200 ease-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* ---- Mobile overlay ---- */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ---- Mobile drawer ---- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[hsl(222,47%,11%)] transition-transform duration-200 ease-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="absolute right-2 top-3">
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>
        <SidebarContent isMobile />
      </aside>

      {/* ---- Main area ---- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-3 border-b bg-white px-4">
          {/* Mobile hamburger */}
          <button
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </button>

          <div className="flex-1" />

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-sm sm:block">
              <p className="font-medium leading-none text-foreground">
                {user.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>

            {/* Avatar */}
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="size-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {initials}
              </div>
            )}

            {/* Sign out */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
