import * as React from "react";
import Link from "next/link";
import {SuccessStateProps} from "@/components/sections/Contact/contact.types";

export function SuccessState({ onReset }: SuccessStateProps) {
    const headingRef = React.useRef<HTMLParagraphElement>(null);

    React.useEffect(() => {
        headingRef.current?.focus();
    }, []);

    return (
        <div className="flex flex-col justify-center min-h-[480px] py-8" role="status" aria-live="polite">
            <span
                className="block font-mono text-[0.7rem] tracking-[0.25em] uppercase mb-8"
                style={{ color: "rgba(10,10,10,0.62)" }}
            >
                Message sent
            </span>
            <p
                ref={headingRef}
                tabIndex={-1}
                className="font-serif font-normal leading-[1.05] tracking-[-0.025em] mb-6 outline-none"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "rgba(10,10,10,0.88)" }}
            >
                Thanks. I&rsquo;ll reply within 24 hours.
            </p>
            <p className="text-[0.9rem] leading-relaxed mb-10" style={{ color: "rgba(10,10,10,0.62)" }}>
                In the meantime, have a look at the{" "}
                <Link href="/case-studies" className="underline underline-offset-2" style={{ color: "rgba(10,10,10,0.85)" }}>case studies</Link>
                {" "}or connect on{" "}
                <a href="https://www.linkedin.com/in/julianedelgado/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2" style={{ color: "rgba(10,10,10,0.85)" }}>LinkedIn</a>.
            </p>
            <button
                type="button"
                onClick={onReset}
                className="self-start min-h-[44px] text-[0.75rem] tracking-[0.1em] uppercase border-b pb-0.5 transition-colors duration-200"
                style={{ color: "rgba(10,10,10,0.62)", borderColor: "rgba(10,10,10,0.25)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(10,10,10,0.9)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(10,10,10,0.62)"; }}
            >
                Send another message →
            </button>
        </div>
    );
}
