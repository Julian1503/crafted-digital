/**
 * @fileoverview Typewriter-style animated title component.
 * Renders text character-by-character with a blinking cursor effect.
 */
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the TypewriterTitle component.
 */
interface TypewriterTitleProps {
    /** The text to display with typewriter effect */
    text: string;
    /** Additional CSS classes for the container */
    className?: string;
    /** Additional CSS classes for the cursor element */
    cursorClassName?: string;
    /** Speed of typing in milliseconds per character. Default: 70 */
    typingSpeed?: number;
    /** Initial delay before typing starts in milliseconds. Default: 0 */
    startDelay?: number;
}

/**
 * Custom hook to manage typewriter animation state.
 * Resets the animation when text changes.
 *
 * @param text - The text to animate
 * @returns The current character index
 */
function useTypewriterIndex(text: string, typingSpeed: number, startDelay: number): number {
    const [index, setIndex] = useState(0);
    const [trackedText, setTrackedText] = useState(text);
    const timeoutRef = useRef<number | null>(null);

    // Track text changes and reset index synchronously during render
    // This is the recommended React pattern for deriving state from props
    if (trackedText !== text) {
        setTrackedText(text);
        setIndex(0);
    }

    const incrementIndex = useCallback(() => {
        setIndex((prev) => prev + 1);
    }, []);

    useEffect(() => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (index >= text.length) return;

        const delay = index === 0 ? startDelay : typingSpeed;
        timeoutRef.current = window.setTimeout(incrementIndex, delay);

        return () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
    }, [index, text.length, typingSpeed, startDelay, incrementIndex]);

    return index;
}

/**
 * Typewriter-style animated title component.
 * Renders text character-by-character with a blinking cursor.
 *
 * @param props - Component configuration
 * @returns A span element with animated typewriter text effect
 *
 * @example
 * ```tsx
 * <TypewriterTitle text="Hello World" typingSpeed={100} />
 * ```
 */
export function TypewriterTitle({
    text,
    className,
    cursorClassName,
    typingSpeed = 70,
    startDelay = 0,
}: TypewriterTitleProps) {
    const currentIndex = useTypewriterIndex(text, typingSpeed, startDelay);
    const displayText = useMemo(() => text.slice(0, currentIndex), [text, currentIndex]);
    const done = currentIndex >= text.length;

    return (
        <span className={cn("relative inline-block", className)}>
            <span className="invisible">
                {text}
                <span className={cn("ml-0.5", cursorClassName)} aria-hidden>
                    _
                </span>
            </span>

            <span className="absolute inset-0">
                {displayText}
                <span
                    className={cn(
                        "ml-0.5 inline-block",
                        done ? "animate-blink" : "",
                        cursorClassName
                    )}
                >
                    _
                </span>
            </span>
        </span>
    );
}
