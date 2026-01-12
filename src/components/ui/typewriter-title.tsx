"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
    text: string;
    className?: string;
    cursorClassName?: string;
    typingSpeed?: number;
    startDelay?: number;
};

export function TypewriterTitle({
                                    text,
                                    className,
                                    cursorClassName,
                                    typingSpeed = 70,
                                    startDelay = 0,
                                }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<number | null>(null);
    const prevTextRef = useRef(text);

    const displayText = useMemo(() => text.slice(0, currentIndex), [text, currentIndex]);

    useEffect(() => {
        if (prevTextRef.current !== text) {
            prevTextRef.current = text;
            setCurrentIndex(0);
        }
    }, [text]);

    useEffect(() => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (currentIndex >= text.length) return;

        const delay = currentIndex === 0 ? startDelay : typingSpeed;

        timeoutRef.current = window.setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
        }, delay);

        return () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
    }, [currentIndex, text.length, typingSpeed, startDelay]);

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
