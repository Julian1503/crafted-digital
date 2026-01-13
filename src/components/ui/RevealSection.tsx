/**
 * @fileoverview Scroll-triggered reveal animation wrapper component.
 * Applies entrance animations when elements scroll into view.
 */
import { useScrollAnimation } from "@/lib/use-scroll-animation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Available animation variants for reveal effect */
type RevealVariant = "up" | "left" | "right" | "scale";

/**
 * Props for the RevealSection component.
 */
interface RevealSectionProps {
    /** Content to be revealed with animation */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Delay before animation starts in milliseconds. Default: 0 */
    delay?: number;
    /** Animation direction/type. Default: "up" */
    variant?: RevealVariant;
}

/**
 * Wrapper component that applies scroll-triggered reveal animations.
 * Uses Intersection Observer to detect when content enters the viewport.
 *
 * @param props - Component configuration
 * @returns A div with reveal animation applied when scrolled into view
 *
 * @example
 * ```tsx
 * <RevealSection variant="left" delay={100}>
 *   <Card>Content appears from left</Card>
 * </RevealSection>
 * ```
 */
export default function RevealSection({
                           children,
                           className,
                           delay = 0,
                           variant = "up",
                       }: RevealSectionProps) {
    const { ref, isVisible } = useScrollAnimation();
    const variantClass =
        variant === "left"
            ? "reveal-left"
            : variant === "right"
                ? "reveal-right"
                : variant === "scale"
                    ? "reveal-scale"
                    : "";

    return (
        <div
            ref={ref}
            style={{ ["--reveal-delay" as never]: `${delay}ms` }}
            className={cn("reveal-on-scroll", variantClass, isVisible && "is-visible", className)}
        >
            {children}
        </div>
    );
}