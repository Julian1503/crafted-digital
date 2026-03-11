/**
 * @fileoverview footer — dark editorial, matches site aesthetic.
 */
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import {scrollToId, setUrlClean} from "@/lib/utils";
import {FOOTER_LINKS} from "@/components/layout/footer/footer.data";

// Reusable link style
const linkStyle: React.CSSProperties = { color: "rgba(255,255,255,0.32)", transition: "color 0.2s" };
const linkHover = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)"; };
const linkLeave = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.32)"; };

export function Footer() {
    const router   = useRouter();
    const pathname = usePathname();
    const isHome   = pathname === "/";

    const navigateToSection = (id: string) => {
        if (isHome) { const ok = scrollToId(id); if (ok) setUrlClean(); return; }
        router.push(`/?section=${encodeURIComponent(id)}`);
    };

    return (
        <footer
            role="contentinfo"
            className="overflow-hidden"
            style={{ background: "#0c0c0c" }}
        >
            {/* ── Main body ─────────────────────────────────────────────── */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pt-16 md:pt-20 pb-10">

                {/* Top row: brand + nav + socials */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-10 md:gap-16 pb-12 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>

                    {/* Brand */}
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/public"
                            onClick={e => {
                                if (isHome) {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                    setUrlClean();
                                }
                            }}
                            aria-label="Julian Delgado — Back to top"
                            className="self-start"
                        >
                            <span
                                className="font-serif font-normal leading-[0.95] tracking-[-0.025em]"
                                style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "rgba(255,255,255,0.88)" }}
                            >
                                Julian<br />Delgado
                            </span>
                        </Link>

                        <p className="text-[0.78rem] leading-relaxed mt-1" style={{ color: "rgba(255,255,255,0.28)", maxWidth: "28ch" }}>
                            Web development for Australian service businesses.
                        </p>

                        {/* Socials */}
                        <div className="flex gap-4 mt-2" role="list" aria-label="Social media links">
                            <Link
                                href="https://www.linkedin.com/in/julianedelgado/"
                                role="listitem"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn (opens in new tab)"
                                className="inline-flex items-center justify-center h-8 w-8 rounded-full border transition-all duration-200"
                                style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)" }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.borderColor = "rgba(255,255,255,0.3)";
                                    el.style.color = "#fff";
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.borderColor = "rgba(255,255,255,0.12)";
                                    el.style.color = "rgba(255,255,255,0.4)";
                                }}
                            >
                                <FaLinkedin size={14} aria-hidden="true" />
                            </Link>
                            <Link
                                href="https://www.instagram.com/crafteddigital_/"
                                role="listitem"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram (opens in new tab)"
                                className="inline-flex items-center justify-center h-8 w-8 rounded-full border transition-all duration-200"
                                style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)" }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.borderColor = "rgba(255,255,255,0.3)";
                                    el.style.color = "#fff";
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.borderColor = "rgba(255,255,255,0.12)";
                                    el.style.color = "rgba(255,255,255,0.4)";
                                }}
                            >
                                <FaInstagram size={14} aria-hidden="true" />
                            </Link>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav aria-label="Footer navigation" className="flex flex-col gap-2.5">
                        <span
                            className="font-mono text-[0.58rem] tracking-[0.22em] uppercase mb-1"
                            style={{ color: "rgba(255,255,255,0.18)" }}
                        >
                            Navigation
                        </span>
                        {FOOTER_LINKS.map(item => {
                            if (item.type === "section") {
                                return (
                                    <a
                                        key={item.id}
                                        href={`/#${item.id}`}
                                        onClick={e => { if (isHome) { e.preventDefault(); navigateToSection(item.id); } }}
                                        className="text-[0.8rem]"
                                        style={linkStyle}
                                        onMouseEnter={linkHover}
                                        onMouseLeave={linkLeave}
                                    >
                                        {item.label}
                                    </a>
                                );
                            }
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-[0.8rem]"
                                    style={linkStyle}
                                    onMouseEnter={linkHover}
                                    onMouseLeave={linkLeave}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* ContactSection strip */}
                    <div className="flex flex-col gap-2.5">
                        <span
                            className="font-mono text-[0.58rem] tracking-[0.22em] uppercase mb-1"
                            style={{ color: "rgba(255,255,255,0.18)" }}
                        >
                            Contact
                        </span>
                        <a
                            href="mailto:julianedelgado@hotmail.com"
                            className="text-[0.8rem]"
                            style={linkStyle}
                            onMouseEnter={linkHover}
                            onMouseLeave={linkLeave}
                        >
                            julianedelgado@hotmail.com
                        </a>
                        <span className="text-[0.78rem]" style={{ color: "rgba(255,255,255,0.22)" }}>
                            Toowoomba, QLD
                        </span>
                        <span className="text-[0.78rem]" style={{ color: "rgba(255,255,255,0.22)" }}>
                            Australia-wide
                        </span>
                    </div>
                </div>

                {/* ── Bottom bar ────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-7">
                    <p className="text-[0.68rem]" style={{ color: "rgba(255,255,255,0.2)" }}>
                        © {new Date().getFullYear()} Julian Delgado. All rights reserved.
                    </p>

                    <nav className="flex gap-5" aria-label="Legal links">
                        {[
                            { href: "/privacy", label: "Privacy Policy" },
                            { href: "/terms",   label: "Terms of Service" },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="text-[0.68rem]"
                                style={linkStyle}
                                onMouseEnter={linkHover}
                                onMouseLeave={linkLeave}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
}