import * as React from "react";

/**
 * Watches elements marked with `data-header-theme="light"`.
 * Returns true when any of them intersects the header band (top 64 px).
 */
export function useLightTheme(pathname: string): boolean {
    const [isLight, setIsLight] = React.useState(false);

    React.useEffect(() => {
        const targets = Array.from(
            document.querySelectorAll<HTMLElement>("[data-header-theme='light']")
        );
        if (!targets.length) return;

        const observer = new IntersectionObserver(
            entries => {
                const anyLight = entries.some(e => e.isIntersecting);
                setIsLight(prev => anyLight !== prev ? anyLight : prev);
            },
            {
                root:       null,
                rootMargin: `0px 0px -${window.innerHeight - 64}px 0px`,
                threshold:  0,
            }
        );

        targets.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [pathname]);

    return isLight;
}
