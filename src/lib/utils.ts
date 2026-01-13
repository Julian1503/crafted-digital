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