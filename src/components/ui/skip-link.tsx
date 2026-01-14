/**
 * @fileoverview Skip to main content link component.
 * Provides keyboard users with a way to skip navigation and go directly to main content.
 * WCAG 2.4.1 Bypass Blocks (Level A)
 */

/**
 * Props for the SkipLink component.
 */
interface SkipLinkProps {
    /** The ID of the main content element to skip to. Default: "main-content" */
    targetId?: string;
    /** The text to display in the skip link. Default: "Skip to main content" */
    text?: string;
}

/**
 * Skip link component for keyboard accessibility.
 * Hidden by default, becomes visible when focused.
 *
 * @param props - Component configuration
 * @returns A skip link that appears on focus
 */
export function SkipLink({
                             targetId = "main-content",
                             text = "Skip to main content"
                         }: SkipLinkProps) {
    return (
        <a href={`#${targetId}`} className="skip-link">
            {text}
        </a>
    );
}