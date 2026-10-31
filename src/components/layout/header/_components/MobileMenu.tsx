import * as React from "react";
import Link from "next/link";
import { NavItem } from "@/components/layout/header/header.types";
import { NAV_ITEMS } from "@/components/layout/header/header.data";
import { track } from "@/lib/analytics";
import { FIT_CALL_LABEL } from "@/lib/constants/site";

interface MobileMenuProps {
    menuRef:        React.RefObject<HTMLDivElement>;
    isHome:         boolean;
    pastHero:       boolean;
    isLight:        boolean;
    isItemActive:   (item: NavItem) => boolean;
    onSectionClick: (id: string) => void;
    onClose:        () => void;
}

export function MobileMenu({
                               menuRef,
                               isHome,
                               pastHero,
                               isLight,
                               isItemActive,
                               onSectionClick,
                               onClose,
                           }: MobileMenuProps) {
    // ── Theme tokens ────────────────────────────────────────────────────────
    const bg          = isLight ? "rgba(255,255,255,0.97)"  : "rgba(10,10,10,0.95)";
    const borderColor = isLight ? "rgba(0,0,0,0.08)"        : "rgba(255,255,255,0.08)";
    const divider     = isLight ? "rgba(0,0,0,0.06)"        : "rgba(255,255,255,0.06)";
    const textDefault = isLight ? "rgba(0,0,0,0.72)"        : "rgba(255,255,255,0.78)";
    const textActive  = isLight ? "rgba(0,0,0,0.92)"        : "rgba(255,255,255,0.95)";
    const dotActive   = isLight ? "hsl(var(--hero-accent))" : "hsl(var(--hero-accent))";

    return (
        <nav
            ref={menuRef as React.RefObject<HTMLElement>}
            id="mobile-menu"
            aria-label="Mobile navigation"
            className="absolute top-full left-0 right-0 border-b flex flex-col shadow-2xl animate-in slide-in-from-top-5 max-h-[calc(100svh-64px)] overflow-y-auto overscroll-contain"
            style={{
                background:     bg,
                backdropFilter: "blur(24px)",
                borderColor,
            }}
        >
            {NAV_ITEMS.map(item => {
                const active = isItemActive(item);

                const itemStyle: React.CSSProperties = {
                    color:       active ? textActive : textDefault,
                    borderColor: divider,
                    fontWeight:  active ? 600 : 400,
                };

                const sharedClassName =
                    "relative text-left text-[0.95rem] px-6 py-[0.9rem] border-b last:border-0 transition-colors duration-150 flex items-center gap-3";

                const inner = (
                    <>
                        {/* Active indicator dot */}
                        <span
                            className="inline-block h-[5px] w-[5px] shrink-0 rounded-full transition-opacity duration-200"
                            style={{
                                background: dotActive,
                                opacity:    active ? 1 : 0,
                            }}
                        />
                        {item.name}
                    </>
                );

                if (item.type === "section") {
                    return (
                        <a
                            key={item.id}
                            href={`/#${item.id}`}
                            onClick={e => { if (isHome) { e.preventDefault(); onSectionClick(item.id); } }}
                            aria-current={active ? "true" : undefined}
                            className={sharedClassName}
                            style={itemStyle}
                        >
                            {inner}
                        </a>
                    );
                }

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={onClose}
                        className={sharedClassName}
                        style={itemStyle}
                    >
                        {inner}
                    </Link>
                );
            })}

            {pastHero && (
                <div className="px-6 py-4">
                    <a
                        href="/contact"
                        onClick={() => { track("cta_clicked", { location: "mobile_menu", label: FIT_CALL_LABEL }); onClose(); }}
                        className="flex items-center justify-center gap-2 w-full rounded-full no-underline transition-opacity duration-200 hover:opacity-80"
                        style={{
                            background:    "hsl(var(--hero-accent))",
                            color:         "#ffffff",
                            padding:       "0.75rem 1.5rem",
                            fontSize:      "0.78rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            fontWeight:    500,
                        }}
                    >
                        {FIT_CALL_LABEL} ↗
                    </a>
                </div>
            )}
        </nav>
    );
}