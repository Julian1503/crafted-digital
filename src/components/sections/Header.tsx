"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import {TypewriterTitle} from "@/components/ui/typewriter-title";

const navLinks = [
    { name: "Services", href: "/#services" },
    { name: "Work", href: "/#work" },
    { name: "Process", href: "/#process" },
    { name: "Pricing", href: "/#pricing" },
    { name: "About", href: "/about-me" },
    { name: "FAQ", href: "/#faq" },
    { name: "Contact", href: "/#contact" },
];

export function Header() {
    const router = useRouter();
    const pathname = usePathname();

    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isHome = pathname === "/";

    const homeSections = useMemo(
        () =>
            navLinks
                .filter((l) => l.href.startsWith("/#"))
                .map((l) => l.href.substring(2)), // "services", "work", ...
        []
    );

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            if (!isHome) return;

            let current = "";
            for (const id of homeSections) {
                const el = document.getElementById(id);
                if (el && window.scrollY >= el.offsetTop - 120) {
                    current = id;
                }
            }
            setActiveSection(current);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHome, homeSections]);

    const navigate = (href: string) => {
        setMobileMenuOpen(false);

        // Same-page anchors on home -> smooth scroll
        if (href.startsWith("/#")) {
            const id = href.substring(2);

            if (isHome) {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                else router.push(href); // fallback
                return;
            }

            // From other routes -> go home with hash (Next.js will navigate)
            router.push(href);
            return;
        }

        // Normal route navigation
        router.push(href);
    };

    const isActive = (href: string) => {
        if (href === "/about-me") return pathname === "/about-me";
        if (isHome && href.startsWith("/#")) return activeSection === href.substring(2);
        return false;
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                isScrolled
                    ? "bg-background/80 backdrop-blur-md border-border py-4"
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link
                    href="/"
                    onClick={(e) => {
                        if (isHome) {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                    }}
                    className="text-2xl font-serif font-bold tracking-tight"
                >
                    <TypewriterTitle
                        text="Julian Delgado"
                        className="text-foreground"
                        cursorClassName="text-secondary"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={(e) => {
                                    // Intercept only same-page anchors on home to smooth scroll
                                    if (isHome && link.href.startsWith("/#")) {
                                        e.preventDefault();
                                        navigate(link.href);
                                    }
                                    // Otherwise let Next handle normal navigation
                                }}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-secondary relative",
                                    active ? "text-secondary" : "text-muted-foreground"
                                )}
                            >
                                {link.name}
                                {active && (
                                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-secondary rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden md:flex">
                    <Button
                        onClick={() => navigate("/#contact")}
                        className="rounded-full px-6 font-medium shadow-lg shadow-secondary/20 hover:shadow-secondary/30 transition-all"
                    >
                        Book a free call
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setMobileMenuOpen((v) => !v)}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-background border-b border-border p-4 md:hidden flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);

                        return (
                            <button
                                key={link.name}
                                onClick={() => navigate(link.href)}
                                className={cn(
                                    "text-left text-lg font-medium py-2 border-b border-border/50 last:border-0",
                                    active ? "text-secondary" : "text-foreground"
                                )}
                            >
                                {link.name}
                            </button>
                        );
                    })}

                    <Button onClick={() => navigate("/#contact")} className="w-full mt-2 rounded-full">
                        Book a free call
                    </Button>
                </div>
            )}
        </header>
    );
}
