/**
 * @fileoverview Mobile device detection hook.
 * Provides responsive breakpoint detection for mobile-specific UI logic.
 */
import * as React from "react"

/** Breakpoint width in pixels below which device is considered mobile */
const MOBILE_BREAKPOINT = 768

/**
 * Custom hook for detecting mobile viewport.
 * Uses window.matchMedia for efficient resize handling.
 *
 * @returns True if viewport width is below mobile breakpoint, false otherwise
 *
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * return isMobile ? <MobileMenu /> : <DesktopNav />;
 * ```
 */
export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

    React.useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        }
        mql.addEventListener("change", onChange)
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        return () => mql.removeEventListener("change", onChange)
    }, [])

    return !!isMobile
}
