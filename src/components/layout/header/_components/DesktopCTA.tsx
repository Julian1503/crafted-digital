import * as React from "react";

interface DesktopCTAProps {
    visible: boolean;
    isLight: boolean;
}

export function DesktopCTA({ visible, isLight }: DesktopCTAProps) {
    const borderColor = isLight
        ? "1px solid hsl(var(--hero-accent)/0.15)"
        : "1px solid hsl(var(--primary-foreground) / 0.15)";
    const background  = isLight
        ? "hsl(var(--hero-accent)/0.04)"
        : "hsl(var(--primary-foreground) / 0.04)";
    const color       = isLight
        ? "hsl(var(--hero-accent)/0.8)"
        : "hsl(var(--primary-foreground) / 0.8)";

    return (
        <div
            className="hidden md:flex shrink-0"
            style={{
                opacity:       visible ? 1 : 0,
                transform:     visible ? "translateY(0)" : "translateY(-6px)",
                transition:    "opacity 0.35s ease, transform 0.35s ease",
                pointerEvents: visible ? "auto" : "none",
            }}
        >
            <a
                href="/contact"
                className="group flex items-center gap-2 rounded-full no-underline whitespace-nowrap"
                style={{
                    border:        borderColor,
                    background,
                    color,
                    padding:       "0.5rem 1.2rem",
                    fontSize:      "0.78rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontWeight:    500,
                    transition:    "background 0.25s, border-color 0.25s, color 0.25s, transform 0.25s",
                }}
                onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background  = "hsl(var(--hero-accent))";
                    el.style.borderColor = "hsl(var(--hero-accent))";
                    el.style.color       = "hsl(var(--primary-foreground))";
                    el.style.transform   = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background  = background;
                    el.style.borderColor = borderColor;
                    el.style.color       = color;
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
    );
}
