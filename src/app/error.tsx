"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/constants/site";

/**
 * Route-level error boundary for the public site. Keeps the brand look,
 * offers a retry and a direct email so a transient failure never dead-ends.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error("[app error boundary]", error.digest ?? "", error.message);
    }, [error]);

    return (
        <main id="main-content" className="min-h-screen flex items-center bg-[#0c0c0c] text-white px-6">
            <div className="mx-auto max-w-[60ch] py-24">
                <p className="text-[0.7rem] tracking-[0.22em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Something went wrong
                </p>
                <h1 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] mb-6 text-balance" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                    This page didn&rsquo;t load properly.
                </h1>
                <p className="text-[1rem] leading-[1.75] mb-10" style={{ color: "rgba(255,255,255,0.75)" }}>
                    It&rsquo;s on my side, not yours. You can try again, or email{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2 text-white">{CONTACT_EMAIL}</a>{" "}
                    and I&rsquo;ll reply within 24 hours.
                    {error.digest && <span className="block mt-3 text-[0.75rem]" style={{ color: "rgba(255,255,255,0.5)" }}>Reference: {error.digest}</span>}
                </p>
                <div className="flex flex-wrap gap-4">
                    <button
                        type="button"
                        onClick={reset}
                        className="min-h-[44px] rounded-full px-6 py-3 text-[0.78rem] uppercase tracking-[0.08em] font-medium text-white"
                        style={{ background: "hsl(var(--hero-accent))" }}
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="min-h-[44px] inline-flex items-center rounded-full px-6 py-3 text-[0.78rem] uppercase tracking-[0.08em] font-medium border"
                        style={{ borderColor: "rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.85)" }}
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </main>
    );
}
