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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentText, setCurrentText] = useState(text);
    const timeoutRef = useRef<number | null>(null);

    // Reset state when text prop changes
    if (currentText !== text) {
        setCurrentText(text);
        setCurrentIndex(0);
    }

    const displayText = useMemo(() => text.slice(0, currentIndex), [text, currentIndex]);

    const incrementIndex = useCallback(() => {
        setCurrentIndex((prev) => prev + 1);
    }, []);

    // Handle typing animation
    useEffect(() => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (currentIndex >= text.length) return;

        const delay = currentIndex === 0 ? startDelay : typingSpeed;

        timeoutRef.current = window.setTimeout(incrementIndex, delay);

        return () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
    }, [currentIndex, text.length, typingSpeed, startDelay, incrementIndex]);

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
