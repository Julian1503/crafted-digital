/**
 * @fileoverview Utility functions used across the application.
 * Includes styling helpers and DOM manipulation utilities.
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge for optimal Tailwind CSS class handling.
 * Merges conflicting Tailwind classes intelligently.
 *
 * @param inputs - Class values to combine (strings, arrays, objects, or conditional expressions)
 * @returns Merged and deduplicated class string
 *
 * @example
 * ```tsx
 * cn("px-4 py-2", isActive && "bg-blue-500", className)
 * cn("text-sm", { "font-bold": isBold })
 * ```
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Smoothly scrolls the viewport to an element with the specified ID.
 *
 * @param id - The HTML element ID to scroll to (without the # prefix)
 * @returns True if the element was found and scrolled to, false otherwise
 *
 * @example
 * ```tsx
 * onClick={() => scrollToId("contact")}
 * ```
 */
export function scrollToId(id: string): boolean {
    const el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
}


/**
 * Clamps a number between 0 and 1.
 * @param n - The number to clamp
 * @returns The clamped number
 * @example
 * clamp01(0.5) // 0.5
 * clamp01(2) // 1
 * clamp01(-1) // 0
 * clamp01(1.5) // 1
 * clamp01(NaN) // 0
 */
export function clamp01 (n: number) : number {
    return Math.max(0, Math.min(1, n))
}

/**
 * Removes the query string and fragment identifier from the current URL without reloading the page.
 * Updates the browser's history to reflect the cleaned URL.
 *
 * @return {void} This method does not return a value.
 */
export function setUrlClean(): void {
    try { window.history.replaceState({}, "", window.location.pathname); } catch { /* noop */ }
}