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
    const [i, setI] = useState(0);
    const startedRef = useRef(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        const tick = (nextI: number) => {
            setI(nextI);
            if (nextI >= text.length) return;

            timeoutRef.current = window.setTimeout(() => tick(nextI + 1), typingSpeed);
        };

        timeoutRef.current = window.setTimeout(() => tick(1), startDelay);

        return () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
    }, [text, typingSpeed, startDelay]);

    const displayed = useMemo(() => text.slice(0, i), [text, i]);
    const done = i >= text.length;

    return (
        <span className={cn("relative inline-block", className)}>
            <span className="invisible">
        {text}
                <span className={cn("ml-0.5", cursorClassName)} aria-hidden>
          _
        </span>
      </span>

            <span className="absolute inset-0">
        {displayed}
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
