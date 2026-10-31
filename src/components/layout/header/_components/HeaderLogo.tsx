import * as React from "react";
import Link from "next/link";

interface HeaderLogoProps {
    opacity: number;
    isLight: boolean;
}

export function HeaderLogo({ opacity, isLight }: HeaderLogoProps) {
    return (
        <Link
            href="/"
            aria-label="Julian Delgado — Home"
            className="shrink-0 leading-none"
            style={{
                opacity,
                transition: "opacity 0.3s ease",
                visibility: opacity === 0 ? "hidden" : "visible",
            }}
        >
            <span
                className="font-serif font-normal tracking-[-0.02em] whitespace-nowrap"
                style={{
                    fontSize: "1.1rem",
                    color:    isLight ? "#0a0a0a" : "hsl(var(--primary-foreground))",
                }}
            >
                Julian <br /> Delgado
            </span>
        </Link>
    );
}
