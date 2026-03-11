import * as React from "react";
import Link from "next/link";
import { NavItem } from "@/components/layout/header/header.types";
import { NAV_ITEMS } from "@/components/layout/header/header.data";

interface MobileMenuProps {
    menuRef:       React.RefObject<HTMLDivElement>;
    isHome:        boolean;
    pastHero:      boolean;
    isItemActive:  (item: NavItem) => boolean;
    onSectionClick:(id: string) => void;
    onClose:       () => void;
}

export function MobileMenu({
    menuRef,
    isHome,
    pastHero,
    isItemActive,
    onSectionClick,
    onClose,
}: MobileMenuProps) {
    return (
        <div
            ref={menuRef}
            id="mobile-menu"
            role="menu"
            aria-label="Mobile navigation"
            className="absolute top-full left-0 right-0 border-b flex flex-col gap-1 shadow-2xl animate-in slide-in-from-top-5 pb-4"
            style={{
                background:     "hsl(var(--bg-hero) / 0.95)",
                backdropFilter: "blur(20px)",
                borderColor:    "hsl(var(--primary-foreground) / 0.08)",
            }}
        >
            {NAV_ITEMS.map(item => {
                const active = isItemActive(item);
                const style: React.CSSProperties = {
                    color: active ? "hsl(var(--hero-accent))" : "hsl(var(--primary-foreground) / 0.75)",
                };
                const sharedClassName = "text-left text-base font-medium px-6 py-3 border-b border-white/[0.04] last:border-0 transition-colors";

                if (item.type === "section") {
                    return (
                        <a
                            key={item.id}
                            role="menuitem"
                            href={`/#${item.id}`}
                            onClick={e => { if (isHome) { e.preventDefault(); onSectionClick(item.id); } }}
                            aria-current={active ? "true" : undefined}
                            className={sharedClassName}
                            style={style}
                        >
                            {item.name}
                        </a>
                    );
                }

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        aria-current={active ? "page" : undefined}
                        onClick={onClose}
                        className={sharedClassName}
                        style={style}
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
                        onClick={onClose}
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
    );
}
