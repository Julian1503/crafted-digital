"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn, setUrlClean } from "@/lib/utils";
import { scrollToId } from "@/lib/utils";
import { NavItem } from "@/components/layout/header/header.types";
import { useScrollState }   from "@/hooks/use-scroll-state";
import { useActiveSection } from "@/hooks/use-active-section";
import { useLightTheme }    from "@/hooks/use-light-theme";
import { useMobileMenu }    from "@/hooks/use-mobile-menu";
import { HeaderLogo }   from "@/components/layout/header/_components/HeaderLogo";
import { DesktopNav }   from "@/components/layout/header/_components/DesktopNav";
import { DesktopCTA }   from "@/components/layout/header/_components/DesktopCTA";
import { MobileToggle } from "@/components/layout/header/_components/MobileToggle";
import { MobileMenu }   from "@/components/layout/header/_components/MobileMenu";

export function Header() {
    const router   = useRouter();
    const pathname = usePathname();
    const isHome   = pathname === "/";

    const { isScrolled, logoOpacity, pastHero } = useScrollState(isHome);
    const activeSection                          = useActiveSection(isHome);
    const isLight                                = useLightTheme(pathname);
    const { isOpen, setIsOpen, menuRef, toggleButtonRef } = useMobileMenu();

    // ── Cross-page section navigation via query param ────────────────────────
    React.useEffect(() => {
        if (!isHome) return;
        const target = new URL(window.location.href).searchParams.get("section");
        if (!target) return;
        requestAnimationFrame(() => {
            scrollToId(target);
            router.replace("/", { scroll: false });
            setUrlClean();
        });
    }, [isHome, router]);

    // ── Helpers ──────────────────────────────────────────────────────────────
    const navigateToSection = (id: string) => {
        setIsOpen(false);
        if (isHome) {
            const ok = scrollToId(id);
            if (ok) setUrlClean();
            return;
        }
        router.push(`/?section=${encodeURIComponent(id)}`);
    };

    const isItemActive = (item: NavItem): boolean => {
        if (item.type === "route")   return pathname === item.href;
        if (!isHome)                 return false;
        return activeSection === item.id;
    };

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <header
            className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500")}
            style={{ height: 64 }}
        >
            <div className="h-full mx-auto px-10 max-md:px-6 flex items-center justify-between gap-8">
                <HeaderLogo opacity={logoOpacity} isLight={isLight} />

                <DesktopNav
                    isHome={isHome}
                    isLight={isLight}
                    isItemActive={isItemActive}
                    onSectionClick={navigateToSection}
                />

                <DesktopCTA visible={pastHero} isLight={isLight} />

                <MobileToggle
                    isOpen={isOpen}
                    isLight={isLight}
                    onClick={() => setIsOpen(v => !v)}
                    buttonRef={toggleButtonRef as React.RefObject<HTMLButtonElement>}
                />
            </div>

            {/* Thin accent line when scrolled */}
            <div
                className="absolute bottom-0 left-0 right-0 h-px pointer-events-none transition-opacity duration-500"
                style={{ opacity: isScrolled ? 1 : 0 }}
            />

            {isOpen && (
                <MobileMenu
                    isLight={isLight}
                    menuRef={menuRef as React.RefObject<HTMLDivElement>}
                    isHome={isHome}
                    pastHero={pastHero}
                    isItemActive={isItemActive}
                    onSectionClick={navigateToSection}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </header>
    );
}
