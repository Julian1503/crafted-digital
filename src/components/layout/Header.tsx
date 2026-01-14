/**
 * @fileoverview Header/Navigation component.
 * Provides main navigation with scroll-to-section and route navigation support.
 * Implements WCAG 2.x AAA accessible navigation patterns.
 */
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { TypewriterTitle } from "@/components/ui/typewriter-title";
import { scrollToId } from "@/lib/utils";

/**
 * Navigation item type - either a section anchor or a route link.
 */
type NavItem =
    | { name: string; type: "section"; id: string }
    | { name: string; type: "route"; href: string };

/**
 * Main navigation items for the header.
 * Includes both section anchors (scroll on homepage) and route links.
 */
const NAV_ITEMS: NavItem[] = [
    { name: "Work", type: "section", id: "work" },
    { name: "Services", type: "section", id: "services" },
    { name: "Case Studies", type: "route", href: "/case-studies" },
    { name: "Blog", type: "route", href: "/blog" },
    { name: "Process", type: "section", id: "process" },
    { name: "Pricing", type: "section", id: "pricing" },
    { name: "Contact", type: "section", id: "contact" },
    { name: "About", type: "route", href: "/about-me" },
];

/**
 * Cleans the URL by removing query parameters and hash fragments.
 * Used after smooth scrolling to keep URLs clean.
 */
function setUrlClean() {
    try {
        window.history.replaceState({}, "", window.location.pathname);
    } catch {
        // Silently fail if history API is not available
    }
}

/**
 * Header component with responsive navigation.
 * Features scroll-aware styling, section navigation, mobile menu, and route navigation.
 * Automatically detects which section is in view and highlights the corresponding nav item.
 *
 * @returns The rendered header with navigation
 */
export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === "/";

    const [isScrolled, setIsScrolled] = React.useState(false);
    const [activeSection, setActiveSection] = React.useState<string>("");
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const mobileMenuRef = React.useRef<HTMLDivElement>(null);
    const mobileMenuButtonRef = React.useRef<HTMLButtonElement>(null);

    // Close mobile menu on Escape key and implement focus trap
    React.useEffect(() => {
        if (!mobileMenuOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setMobileMenuOpen(false);
                mobileMenuButtonRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [mobileMenuOpen]);

    // Focus first menu item when menu opens
    React.useEffect(() => {
        if (mobileMenuOpen && mobileMenuRef.current) {
            const firstButton = mobileMenuRef.current.querySelector("button");
            firstButton?.focus();
        }
    }, [mobileMenuOpen]);


    React.useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    React.useEffect(() => {
        if (!isHome) return;

        const sectionIds = NAV_ITEMS.filter((x) => x.type === "section").map(
            (x) => x.id
        );

        const elements = sectionIds
            .map((id) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const hit = entries.find((e) => e.isIntersecting);
                if (hit?.target?.id) setActiveSection(hit.target.id);
            },
            {
                root: null,
                threshold: 0,
                rootMargin: "-50% 0px -50% 0px",
            }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [isHome]);

    const navigateToSection = (id: string) => {
        setMobileMenuOpen(false);
        setActiveSection(id);

        if (isHome) {
            const ok = scrollToId(id);
            if (ok) setUrlClean();
            return;
        }

        router.push(`/?section=${encodeURIComponent(id)}`);
    };

    const navigateToRoute = (href: string) => {
        setMobileMenuOpen(false);
        router.push(href);
    };

        React.useEffect(() => {
        if (!isHome) return;

        const url = new URL(window.location.href);
        const target = url.searchParams.get("section");
        if (!target) return;

        requestAnimationFrame(() => {
            const ok = scrollToId(target);
            router.replace("/", { scroll: false });
            if (ok) setUrlClean();
        });
    }, [isHome, router]);

    const isItemActive = (item: NavItem) => {
        if (item.type === "route") return pathname === item.href;
        if (!isHome) return false;
        return activeSection === item.id;
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-background/80 backdrop-blur-md border-b border-border/60 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Brand */}
                <Link
                    href="/"
                    onClick={(e) => {
                        if (isHome) {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            setUrlClean();
                            setMobileMenuOpen(false);
                        }
                    }}
                    className="text-2xl font-semibold tracking-tight"
                >
                    <TypewriterTitle
                        text="Julian Delgado"
                        className="text-foreground"
                        cursorClassName="text-secondary"
                        aria-label="Julian Delgado - Home"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
                    {NAV_ITEMS.map((item) => {
                        const active = isItemActive(item);

                        // Section items: we avoid hash usage
                        if (item.type === "section") {
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigateToSection(item.id)}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-secondary relative",
                                        active ? "text-secondary" : "text-muted-foreground"
                                    )}
                                    aria-current={active ? "true" : undefined}
                                >
                                    {item.name}
                                    {active && (
                                        <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-secondary rounded-full" aria-hidden="true" />
                                    )}
                                </button>
                            );
                        }

                        // Route items: normal navigation
                        return (
                            <button
                                key={item.href}
                                onClick={() => navigateToRoute(item.href)}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-secondary relative",
                                    active ? "text-secondary" : "text-muted-foreground"
                                )}
                                aria-current={active ? "page" : undefined}
                            >
                                {item.name}
                            </button>
                        );
                    })}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex">
                    <Button
                        onClick={() => navigateToSection("contact")}
                        className="rounded-full px-6 font-medium shadow-lg shadow-secondary/20 hover:shadow-secondary/30 transition-all"
                    >
                        Book a free call
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    ref={mobileMenuButtonRef}
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setMobileMenuOpen((v) => !v)}
                    aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-menu"
                    aria-haspopup="true"
                >
                    {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    id="mobile-menu"
                    role="menu"
                    aria-label="Mobile navigation"
                    className="absolute top-full left-0 right-0 bg-background border-b border-border p-4 md:hidden flex flex-col gap-3 shadow-xl animate-in slide-in-from-top-5"
                >                    {NAV_ITEMS.map((item) => {
                        const active = isItemActive(item);

                        return (
                            <button
                                key={item.type === "section" ? item.id : item.href}
                                role="menuitem"
                                onClick={() =>
                                    item.type === "section"
                                        ? navigateToSection(item.id)
                                        : navigateToRoute(item.href)
                                }
                                className={cn(
                                    "text-left text-lg font-medium py-2 border-b border-border/50 last:border-0",
                                    active ? "text-secondary" : "text-foreground"
                                )}
                                aria-current={active ? (item.type === "route" ? "page" : "true") : undefined}
                            >
                                {item.name}
                            </button>
                        );
                    })}

                    <Button
                        role="menuitem"
                        onClick={() => navigateToSection("contact")}
                        className="w-full mt-2 rounded-full"
                    >
                        Book a free call
                    </Button>
                </div>
            )}
        </header>
    );
}
