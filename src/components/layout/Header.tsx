/**
 * @fileoverview Header/Navigation component — redesigned to pair with the
 * scroll-driven hero title animation in hero.tsx.
 *
 * Visual structure (desktop):
 *   [ Julian Delgado ]  ·  [ nav items ]  ·  [ Start a project → ]
 *
 * The "Julian Delgado" logo on the left is invisible on the homepage at
 * scroll=0 (the floating title from hero.tsx sits in its place).  It fades
 * in as the floating title completes its journey (~92 % scroll threshold).
 * On all other routes the logo is always visible.
 */
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { scrollToId } from "@/lib/utils";

// ─── constants (keep in sync with hero.tsx) ─────────────────────────────────
const HERO_THRESHOLD = 0.58; // fraction of vh at which anim completes
const LOGO_FADE_START = 0.96; // progress at which logo begins to fade in (must be >= FloatingTitle fade-out start of 0.92)

// ─── types ───────────────────────────────────────────────────────────────────
type NavItem =
    | { name: string; type: "section"; id: string }
    | { name: string; type: "route";   href: string };

const NAV_ITEMS: NavItem[] = [
    { name: "Work",         type: "section", id: "work"     },
    { name: "Services",     type: "section", id: "services" },
    { name: "Process",      type: "section", id: "process"  },
    { name: "Pricing",      type: "section", id: "pricing"  },
    { name: "Contact",      type: "section", id: "contact"  },
    { name: "About",        type: "route",   href: "/about-me"     },
    { name: "Case Studies", type: "route",   href: "/case-studies" },
    { name: "Blog",         type: "route",   href: "/blog"         },
];

function setUrlClean() {
    try { window.history.replaceState({}, "", window.location.pathname); } catch { /* noop */ }
}

// ─── component ───────────────────────────────────────────────────────────────
export function Header() {
    const router   = useRouter();
    const pathname = usePathname();
    const isHome   = pathname === "/";

    const [isScrolled, setIsScrolled]     = React.useState(false);
    const [activeSection, setActiveSection]  = React.useState<string>("");
    const [logoOpacity, setLogoOpacity]    = React.useState(isHome ? 0 : 1);
    const [isLight, setIsLight]        = React.useState(false);
    // CTA is hidden while the user is still inside the hero
    const [pastHero, setPastHero]       = React.useState(!isHome);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const mobileMenuRef       = React.useRef<HTMLDivElement>(null);
    const mobileMenuButtonRef = React.useRef<HTMLButtonElement>(null);

    // ── scroll: background + logo opacity ───────────────────────────────────
    React.useEffect(() => {
        const onScroll = () => {
            const s         = window.scrollY;
            const threshold = window.innerHeight * HERO_THRESHOLD;
            const raw       = Math.min(s / threshold, 1);

            setIsScrolled(s > 12);

            if (isHome) {
                // Logo fades in during the last part of the floating-title journey
                const logoP = raw < LOGO_FADE_START
                    ? 0
                    : (raw - LOGO_FADE_START) / (1 - LOGO_FADE_START);
                setLogoOpacity(logoP);

                // CTA appears once scroll exceeds 100vh (fully past the hero)
                setPastHero(s >= window.innerHeight * 0.9);
            }
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [isHome]);

    // ── section highlight ────────────────────────────────────────────────────
    React.useEffect(() => {
        if (!isHome) return;
        const sectionIds = NAV_ITEMS.filter(x => x.type === "section").map(x => x.id);
        const elements   = sectionIds.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
        if (!elements.length) return;

        const observer = new IntersectionObserver(
            entries => {
                const hit = entries.find(e => e.isIntersecting);
                if (hit?.target?.id) setActiveSection(hit.target.id);
            },
            { root: null, threshold: 0, rootMargin: "-50% 0px -50% 0px" },
        );
        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [isHome]);

    React.useEffect(() => {
        // Query all sections/divs marked as light
        const targets = Array.from(
            document.querySelectorAll<HTMLElement>("[data-header-theme='light']")
        );
        if (!targets.length) return;

        // rootMargin: only the header band (top 64px) triggers the observer
        const observer = new IntersectionObserver(
            (entries) => {
                const anyLight = entries.some(e => e.isIntersecting);
                // Only update if something changed to avoid unnecessary renders
                setIsLight(prev => (anyLight !== prev ? anyLight : prev));
            },
            {
                root:       null,
                // Collapse the observation zone to just the header height:
                // top edge = 0, bottom edge = -(100vh - 64px)
                rootMargin: `0px 0px -${window.innerHeight - 64}px 0px`,
                threshold:  0,
            }
        );

        targets.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [pathname]);

    // ── mobile menu keyboard / focus ─────────────────────────────────────────
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

    React.useEffect(() => {
        if (mobileMenuOpen && mobileMenuRef.current) {
            const firstItem = mobileMenuRef.current.querySelector<HTMLElement>("a, button");
            firstItem?.focus();
        }
    }, [mobileMenuOpen]);

    // ── section link from query param (cross-page) ───────────────────────────
    React.useEffect(() => {
        if (!isHome) return;
        const url    = new URL(window.location.href);
        const target = url.searchParams.get("section");
        if (!target) return;
        requestAnimationFrame(() => {
            const ok = scrollToId(target);
            router.replace("/", { scroll: false });
            if (ok) setUrlClean();
        });
    }, [isHome, router]);

    // ── helpers ──────────────────────────────────────────────────────────────
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

    const isItemActive = (item: NavItem) => {
        if (item.type === "route")   return pathname === item.href;
        if (!isHome)                 return false;
        return activeSection === item.id;
    };

    // ── render ───────────────────────────────────────────────────────────────
    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
            )}
            style={{ height: 64 }}
        >
            <div className="h-full mx-auto px-10 max-md:px-6 flex items-center justify-between gap-8">

                {/* ── Logo ─────────────────────────────────────────────────── */}
                <Link
                    href="/"
                    aria-label="Julian Delgado — Home"
                    className="shrink-0 leading-none"
                    style={{
                        opacity:    logoOpacity,
                        transition: "opacity 0.3s ease",
                        /* Reserve the space so layout doesn't shift */
                        visibility: logoOpacity === 0 ? "hidden" : "visible",
                    }}
                >
                    <span
                        className="font-bold tracking-[-0.02em] whitespace-nowrap font-cormorant"
                        style={{
                            fontSize: "1.1rem",
                            color:    isLight ? "#0a0a0a" : "hsl(var(--primary-foreground))",
                        }}
                    >
                        Julian <br/> Delgado
                    </span>
                </Link>

                {/* ── Desktop nav ──────────────────────────────────────────── */}
                <nav
                    className="hidden md:flex items-center gap-6 flex-1 justify-center"
                    aria-label="Main navigation"
                >
                    {NAV_ITEMS.map(item => {
                        const active = isItemActive(item);
                        const navColor        = isLight ? "rgba(10,10,10,0.6)"  : "hsl(var(--primary-foreground) / 0.5)";
                        const navColorHover   = isLight ? "rgba(10,10,10,1)"    : "hsl(var(--primary-foreground) / 0.85)";
                        const navColorActive  = "hsl(var(--hero-accent))";
                        if (item.type === "section") {
                            return (
                                <a
                                    key={item.id}
                                    href={`/#${item.id}`}
                                    onClick={e => {
                                        if (isHome) { e.preventDefault(); navigateToSection(item.id); }
                                    }}
                                    aria-current={active ? "true" : undefined}
                                    className="relative text-sm font-medium whitespace-nowrap"
                                    style={{
                                        color:      active ? navColorActive : navColor,
                                        transition: "color 0.25s ease",
                                    }}
                                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = navColorHover; }}
                                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = navColor; }}
                                >
                                    {item.name}
                                    {active && (
                                        <span
                                            className="absolute -bottom-[18px] left-0 right-0 h-px rounded-full"
                                            style={{ background: navColorActive }}
                                            aria-hidden="true"
                                        />
                                    )}
                                </a>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={active ? "page" : undefined}
                                onClick={() => setMobileMenuOpen(false)}
                                className="relative text-sm font-medium whitespace-nowrap"
                                style={{
                                    color:      active ? navColorActive : navColor,
                                    transition: "color 0.25s ease",
                                }}
                                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = navColorHover; }}
                                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = navColor; }}
                            >
                                {item.name}
                                {active && (
                                    <span
                                        className="absolute -bottom-[18px] left-0 right-0 h-px rounded-full"
                                        style={{ background: navColorActive }}
                                        aria-hidden="true"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Desktop CTA — only visible after scrolling past the hero ── */}
                <div
                    className="hidden md:flex shrink-0"
                    style={{
                        opacity:        pastHero ? 1 : 0,
                        transform:      pastHero ? "translateY(0)" : "translateY(-6px)",
                        transition:     "opacity 0.35s ease, transform 0.35s ease",
                        pointerEvents:  pastHero ? "auto" : "none",
                    }}
                >
                    <a
                        href="/contact"
                        className="group flex items-center gap-2 rounded-full no-underline whitespace-nowrap"
                        style={{
                            border:        isLight? "1px solid hsl(var(--hero-accent)/0.15)" : "1px solid hsl(var(--primary-foreground) / 0.15)",
                            background:    isLight? "hsl(var(--hero-accent)/0.04)" :"hsl(var(--primary-foreground) / 0.04)",
                            color:         isLight? "hsl(var(--hero-accent)/0.8)" : "hsl(var(--primary-foreground) / 0.8)",
                            padding:       "0.5rem 1.2rem",
                            fontSize:      "0.78rem",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            fontWeight:    500,
                            transition:    "background 0.25s, border-color 0.25s, color 0.25s, transform 0.25s",
                        }}
                        onMouseEnter={e => {
                            const el = e.currentTarget as HTMLAnchorElement;
                            el.style.background   = "hsl(var(--hero-accent))";
                            el.style.borderColor  = "hsl(var(--hero-accent))";
                            el.style.color        = "hsl(var(--primary-foreground))";
                            el.style.transform    = "translateY(-1px)";
                        }}
                        onMouseLeave={e => {
                            const el = e.currentTarget as HTMLAnchorElement;
                            el.style.background  = isLight? "1px solid hsl(var(--hero-accent)/0.15)" : "1px solid hsl(var(--primary-foreground) / 0.15)";
                            el.style.borderColor = isLight? "hsl(var(--hero-accent)/0.04)" :"hsl(var(--primary-foreground) / 0.04)";
                            el.style.color       = isLight? "hsl(var(--hero-accent)/0.8)" : "hsl(var(--primary-foreground) / 0.8)";
                            el.style.transform   = "";
                        }}
                    >
                        Start a project
                        <span
                            className="group-hover:rotate-45 inline-block text-[0.8rem]"
                            style={{ transition: "transform 0.25s" }}
                        >
                            ↗
                        </span>
                    </a>
                </div>

                {/* ── Mobile toggle ────────────────────────────────────────── */}
                <button
                    ref={mobileMenuButtonRef}
                    className="md:hidden p-2 ml-auto"
                    style={{ color: "hsl(var(--primary-foreground) / 0.8)" }}
                    onClick={() => setMobileMenuOpen(v => !v)}
                    aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-menu"
                    aria-haspopup="true"
                >
                    {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
                </button>
            </div>

            {/* ── Thin accent line at bottom of scrolled header ────────────── */}
            <div
                className="absolute bottom-0 left-0 right-0 h-px pointer-events-none transition-opacity duration-500"
                style={{
                    opacity:    isScrolled ? 1 : 0,
                }}
            />

            {/* ── Mobile menu ──────────────────────────────────────────────── */}
            {mobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    id="mobile-menu"
                    role="menu"
                    aria-label="Mobile navigation"
                    className="absolute top-full left-0 right-0 border-b flex flex-col gap-1 shadow-2xl animate-in slide-in-from-top-5 pb-4"
                    style={{
                        background:   "hsl(var(--bg-hero) / 0.95)",
                        backdropFilter: "blur(20px)",
                        borderColor:  "hsl(var(--primary-foreground) / 0.08)",
                    }}
                >
                    {NAV_ITEMS.map(item => {
                        const active = isItemActive(item);
                        const baseStyle: React.CSSProperties = {
                            color: active ? "hsl(var(--hero-accent))" : "hsl(var(--primary-foreground) / 0.75)",
                        };

                        if (item.type === "section") {
                            return (
                                <a
                                    key={item.id}
                                    role="menuitem"
                                    href={`/#${item.id}`}
                                    onClick={e => { if (isHome) { e.preventDefault(); navigateToSection(item.id); } }}
                                    aria-current={active ? "true" : undefined}
                                    className="text-left text-base font-medium px-6 py-3 border-b border-white/[0.04] last:border-0 transition-colors"
                                    style={baseStyle}
                                >
                                    {item.name}
                                </a>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                role="menuitem"
                                aria-current={active ? "page" : undefined}
                                className="text-left text-base font-medium px-6 py-3 border-b border-white/[0.04] last:border-0 transition-colors"
                                style={baseStyle}
                            >
                                {item.name}
                            </Link>
                        );
                    })}

                    {pastHero && (
                        <div className="px-6 pt-3">
                            <a
                                href="/contact"
                                role="menuitem"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full rounded-full no-underline"
                                style={{
                                    background:    "hsl(var(--hero-accent))",
                                    color:         "hsl(var(--primary-foreground))",
                                    padding:       "0.75rem 1.5rem",
                                    fontSize:      "0.8rem",
                                    letterSpacing: "0.07em",
                                    textTransform: "uppercase",
                                    fontWeight:    500,
                                }}
                            >
                                Start a project ↗
                            </a>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}