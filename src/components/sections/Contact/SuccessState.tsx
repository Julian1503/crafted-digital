import * as React from "react";
import {SuccessStateProps} from "@/components/sections/Contact/contact.types";


export function SuccessState({ onReset }: SuccessStateProps) {
    return (
        <div className="flex flex-col justify-center min-h-[480px] py-8">
            <span
                className="block font-mono text-[0.62rem] tracking-[0.25em] uppercase mb-8"
                style={{ color: "rgba(10,10,10,0.22)" }}
            >
                Message sent ✦
            </span>
            <p
                className="font-serif font-normal leading-[1.05] tracking-[-0.025em] mb-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "rgba(10,10,10,0.88)" }}
            >
                Thanks for reaching out — I&apos;ll be in touch within 24 hours.
            </p>
            <p className="text-[0.85rem] leading-relaxed mb-10" style={{ color: "rgba(10,10,10,0.42)" }}>
                In the meantime, feel free to browse the case studies or connect on LinkedIn.
            </p>
            <button
                type="button"
                onClick={onReset}
                className="self-start text-[0.72rem] tracking-[0.1em] uppercase border-b pb-0.5 transition-colors duration-200"
                style={{ color: "rgba(10,10,10,0.38)", borderColor: "rgba(10,10,10,0.15)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(10,10,10,0.8)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(10,10,10,0.38)"; }}
            >
                Send another message →
            </button>
        </div>
    );
}
