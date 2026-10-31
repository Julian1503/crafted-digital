/**
 * @fileoverview footer — dark editorial, matches site aesthetic.
 */
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useInView } from "framer-motion";
import { scrollToId, setUrlClean } from "@/lib/utils";
import { FOOTER_LINKS } from "@/components/layout/footer/footer.data";
import { track } from "@/lib/analytics";
import { CURRENT_YEAR } from "@/lib/constants/site";

const linkStyle: React.CSSProperties = { color: "rgba(255,255,255,0.74)", transition: "color 0.2s", display: "inline-block", padding: "0.45rem 0" };
const linkHover = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.color = "#fff"; };
const linkLeave = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.74)"; };

function LinkedInIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
        </svg>
    );
}

/** Splits a word into individual letter spans, each sliding up with a stagger. */
function AnimatedWord({ word, delay = 0 }: { word: string; delay?: number }) {
    return (
        <>
            {word.split("").map((char, i) => (
                <span
                    key={i}
                    className="inline-block"
                    style={{
                        animationDelay: `${delay + i * 0.045}s`,
                    }}
                >
                    {char}
                </span>
            ))}
        </>
    );
}

export function Footer() {
    const router   = useRouter();
    const pathname = usePathname();
    const isHome   = pathname === "/";

    const nameRef = React.useRef<HTMLAnchorElement>(null);
    const inView  = useInView(nameRef, { once: true, margin: "-60px" });

    const navigateToSection = (id: string) => {
        if (isHome) { const ok = scrollToId(id); if (ok) setUrlClean(); return; }
        router.push(`/?section=${encodeURIComponent(id)}`);
    };

    return (
        <footer
            role="contentinfo"
            data-hide-logo
            className="overflow-hidden pb-30"
            style={{ background: "#0c0c0c" }}
        >
            {/* Keyframe styles injected once */}
            <style>{`
                @keyframes letterUp {
                    from { opacity: 0; transform: translateY(60%) skewY(4deg); }
                    to   { opacity: 1; transform: translateY(0)    skewY(0deg); }
                }
                .footer-name-animate span {
                    opacity: 0;
                }
                .footer-name-animate.in-view span {
                    animation: letterUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
                }
            `}</style>

            {/* ── Main body ─────────────────────────────────────────────── */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pt-16 md:pt-20 pb-10">

                {/* Top row: brand + nav + socials */}
                <div
                    className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-10 md:gap-16 pb-12 border-b"
                    style={{ borderColor: "rgba(255,255,255,0.07)" }}
                >
                    {/* Brand */}
                    <div className="flex flex-col gap-3">
                        <Link
                            ref={nameRef}
                            href="/"
                            onClick={e => {
                                if (isHome) {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                    setUrlClean();
                                }
                            }}
                            aria-label="Julian Delgado — Back to top"
                            className={`self-start overflow-hidden footer-name-animate${inView ? " in-view" : ""}`}
                        >
                            <span
                                className="block font-serif font-normal leading-[0.95] tracking-[-0.025em]"
                                style={{
                                    fontSize: "clamp(1.6rem,3.5vw,2.4rem)",
                                    color: "rgba(255,255,255,0.88)",
                                }}
                            >
                                {/* "Julian" — letters 0–5 */}
                                <span className="block overflow-hidden">
                                    <AnimatedWord word="Julian" delay={0} />
                                </span>
                                {/* "Delgado" — letters start after Julian finishes */}
                                <span className="block pb-3 md:pb-5">
                                    <AnimatedWord word="Delgado" delay={0.32} />
                                </span>
                            </span>
                        </Link>

                        <p
                            className="text-[0.85rem] leading-relaxed mt-1"
                            style={{ color: "rgba(255,255,255,0.7)", maxWidth: "30ch" }}
                        >
                            Custom software, AI automation and websites for Australian small businesses.
                        </p>

                        {/* Socials */}
                        <ul className="flex gap-4 mt-2 list-none p-0 m-0" aria-label="Social media links">
                          <li>
                            <Link
                                href="https://www.linkedin.com/in/julianedelgado/"
                                onClick={() => track("outbound_clicked", { network: "linkedin", location: "footer" })}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn (opens in new tab)"
                                className="inline-flex items-center justify-center h-11 w-11 rounded-full border transition-[border-color,color] duration-200"
                                style={{ borderColor: "rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.78)" }}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.5)"; el.style.color = "#fff"; }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.22)"; el.style.color = "rgba(255,255,255,0.78)"; }}
                            >
                                <LinkedInIcon />
                            </Link>
                          </li>
                          <li>
                            <Link
                                href="https://www.instagram.com/crafteddigital_/"
                                onClick={() => track("outbound_clicked", { network: "instagram", location: "footer" })}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram (opens in new tab)"
                                className="inline-flex items-center justify-center h-11 w-11 rounded-full border transition-[border-color,color] duration-200"
                                style={{ borderColor: "rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.78)" }}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.5)"; el.style.color = "#fff"; }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.22)"; el.style.color = "rgba(255,255,255,0.78)"; }}
                            >
                                <InstagramIcon />
                            </Link>
                          </li>
                        </ul>
                    </div>

                    {/* Nav */}
                    <nav aria-label="Footer navigation" className="flex flex-col gap-2.5">
                        <span className="font-mono text-[0.7rem] tracking-[0.22em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
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
                                <Link key={item.href} href={item.href} className="text-[0.85rem]" style={linkStyle} onMouseEnter={linkHover} onMouseLeave={linkLeave}>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Contact strip */}
                    <div className="flex flex-col gap-2.5">
                        <span className="font-mono text-[0.7rem] tracking-[0.22em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                            Contact
                        </span>
                        <a href="mailto:julianedelgado@hotmail.com" className="text-[0.85rem]" style={linkStyle} onMouseEnter={linkHover} onMouseLeave={linkLeave} onClick={() => track("email_clicked", { location: "footer" })}>
                            julianedelgado@hotmail.com
                        </a>
                        <span className="text-[0.82rem]" style={{ color: "rgba(255,255,255,0.62)" }}>Toowoomba, QLD</span>
                        <span className="text-[0.82rem]" style={{ color: "rgba(255,255,255,0.62)" }}>Australia-wide</span>
                    </div>
                </div>

                {/* ── Bottom bar ────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-7">
                    <p className="text-[0.75rem]" style={{ color: "rgba(255,255,255,0.62)" }}>
                        © {CURRENT_YEAR} Julian Delgado. All rights reserved.
                    </p>
                    <nav className="flex gap-5" aria-label="Legal links">
                        {[
                            { href: "/privacy", label: "Privacy Policy" },
                            { href: "/terms",   label: "Terms of Service" },
                        ].map(({ href, label }) => (
                            <Link key={href} href={href} className="text-[0.78rem]" style={linkStyle} onMouseEnter={linkHover} onMouseLeave={linkLeave}>
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
}