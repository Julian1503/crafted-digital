"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronLeft,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {NAV_GROUPS} from "@/components/admin/admin.data";
import SidebarContent from "@/components/admin/SidebarContent";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */


interface AdminShellProps {
  user: { name: string; email: string; image: string | null };
  children: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Navigation config                                                 */
/* ------------------------------------------------------------------ */

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


  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ---- Desktop sidebar ---- */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-[hsl(222,47%,11%)] transition-all duration-200 ease-out",
          collapsed ? "w-16" : "w-64"
        )}
      >

        <SidebarContent
            collapsed={collapsed}
            expandedGroups={expandedGroups}
            toggleGroup={toggleGroup}
            isActive={isActive}
            onToggleCollapsed={() => setCollapsed((c) => !c)} />
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
        <SidebarContent
            isMobile
            collapsed={collapsed}
            expandedGroups={expandedGroups}
            toggleGroup={toggleGroup}
            isActive={isActive}
            onToggleCollapsed={() => setCollapsed((c) => !c)}
        />
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
              <Image
                src={user.image}
                alt={user.name}
                width={32}
                height={32}
                className="rounded-full object-cover"
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
