import * as React from "react";
import Link from "next/link";
import { NavItem } from "@/components/layout/header/header.types";
import { NAV_ITEMS } from "@/components/layout/header/header.data";

interface DesktopNavProps {
    isHome:        boolean;
    isLight:       boolean;
    isItemActive:  (item: NavItem) => boolean;
    onSectionClick:(id: string) => void;
}

export function DesktopNav({ isHome, isLight, isItemActive, onSectionClick }: DesktopNavProps) {
    const navColor       = isLight ? "rgba(10,10,10,0.6)"  : "hsl(var(--primary-foreground) / 0.5)";
    const navColorHover  = isLight ? "rgba(10,10,10,1)"    : "hsl(var(--primary-foreground) / 0.85)";
    const navColorActive = "hsl(var(--hero-accent))";

    return (
        <nav
            className="hidden md:flex items-center gap-6 flex-1 justify-center"
            aria-label="Main navigation"
        >
            {NAV_ITEMS.map(item => {
                const active = isItemActive(item);
                const color  = active ? navColorActive : navColor;

                const activeIndicator = active && (
                    <span
                        className="absolute -bottom-[18px] left-0 right-0 h-px rounded-full"
                        style={{ background: navColorActive }}
                        aria-hidden="true"
                    />
                );

                const sharedProps = {
                    className: "relative text-sm font-medium whitespace-nowrap",
                    style:     { color, transition: "color 0.25s ease" } as React.CSSProperties,
                    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                        if (!active) (e.currentTarget as HTMLElement).style.color = navColorHover;
                    },
                    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                        if (!active) (e.currentTarget as HTMLElement).style.color = navColor;
                    },
                };

                if (item.type === "section") {
                    return (
                        <a
                            key={item.id}
                            href={`/#${item.id}`}
                            onClick={e => { if (isHome) { e.preventDefault(); onSectionClick(item.id); } }}
                            aria-current={active ? "true" : undefined}
                            {...sharedProps}
                        >
                            {item.name}
                            {activeIndicator}
                        </a>
                    );
                }

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        {...sharedProps}
                    >
                        {item.name}
                        {activeIndicator}
                    </Link>
                );
            })}
        </nav>
    );
}
