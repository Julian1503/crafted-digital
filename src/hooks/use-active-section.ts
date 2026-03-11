import * as React from "react";
import { NAV_ITEMS } from "@/components/layout/header/header.data";

/**
 * Uses IntersectionObserver to highlight which section is currently
 * in the centre of the viewport.
 */
export function useActiveSection(isHome: boolean): string {
    const [activeSection, setActiveSection] = React.useState("");

    React.useEffect(() => {
        if (!isHome) return;

        const sectionIds = NAV_ITEMS
            .filter(x => x.type === "section")
            .map(x => x.id);

        const elements = sectionIds
            .map(id => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        if (!elements.length) return;

        const observer = new IntersectionObserver(
            entries => {
                const hit = entries.find(e => e.isIntersecting);
                if (hit?.target?.id) setActiveSection(hit.target.id);
            },
            { root: null, threshold: 0, rootMargin: "-50% 0px -50% 0px" },
        );

        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [isHome]);

    return activeSection;
}
