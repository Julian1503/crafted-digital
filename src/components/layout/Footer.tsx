"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import { scrollToId } from "@/lib/utils";

type FooterItem =
    | { label: string; type: "section"; id: string }
    | { label: string; type: "route"; href: string };

const FOOTER_LINKS: FooterItem[] = [
    { label: "Services", type: "section", id: "services" },
    { label: "Work", type: "section", id: "work" },
    { label: "Process", type: "section", id: "process" },
    { label: "Pricing", type: "section", id: "pricing" },
    { label: "FAQ", type: "section", id: "faq" },
    { label: "Contact", type: "section", id: "contact" },
    { label: "About", type: "route", href: "/about-me" },
];

function setUrlClean() {
    try {
        window.history.replaceState({}, "", window.location.pathname);
    } catch {
        // ignore
    }
}

export function Footer() {
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === "/";

    const navigateToSection = (id: string) => {
        if (isHome) {
            const ok = scrollToId(id);
            if (ok) setUrlClean();
            return;
        }
        // From other routes -> go home with query, then Header/Home effect will scroll & clean
        router.push(`/?section=${encodeURIComponent(id)}`);
    };

    const navigateToRoute = (href: string) => {
        router.push(href);
    };

    return (
        <footer className="bg-background py-12 border-t border-border">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link
                            href="/"
                            onClick={(e) => {
                                if (isHome) {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                    setUrlClean();
                                }
                            }}
                            className="text-2xl font-semibold tracking-tight"
                        >
              <span className="font-serif font-bold">
                Julian Delgado<span className="text-secondary">_</span>
              </span>
                        </Link>

                        <p className="text-muted-foreground text-sm">
                            Premium software services for ambitious brands.
                        </p>
                    </div>

                    {/* Links (same logic as header: no hashes) */}
                    <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground">
                        {FOOTER_LINKS.map((item) =>
                            item.type === "section" ? (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => navigateToSection(item.id)}
                                    className="hover:text-foreground transition-colors"
                                >
                                    {item.label}
                                </button>
                            ) : (
                                <button
                                    key={item.href}
                                    type="button"
                                    onClick={() => navigateToRoute(item.href)}
                                    className="hover:text-foreground transition-colors"
                                >
                                    {item.label}
                                </button>
                            )
                        )}
                    </nav>

                    {/* Socials (use real URLs, open in new tab) */}
                    <div className="flex gap-4">

                        <a
                            href="https://www.linkedin.com/in/julianedelgado/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-secondary transition-colors"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedin size={20} />
                        </a>
                        <a
                            href="https://www.instagram.com/crafteddigital_/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-secondary transition-colors"
                            aria-label="Instagram"
                        >
                            <FaInstagram size={20} />
                        </a>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Julian Delgado. All rights reserved.</p>

                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-foreground">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-foreground">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
