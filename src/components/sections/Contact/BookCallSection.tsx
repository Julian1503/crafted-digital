import { CalBooking } from "@/components/sections/Contact/CalBooking";
import { CAL_BOOKING_URL } from "@/lib/constants/site";

/**
 * The calendar for the fit call, below the form on /contact. Server-rendered
 * shell with a plain link as the no-JS and slow-network fallback.
 */
export function BookCallSection() {
    return (
        <section
            id="book"
            data-header-theme="light"
            className="py-16 md:py-24 border-t scroll-mt-16"
            style={{ background: "hsl(var(--background))", borderColor: "rgba(10,10,10,0.07)" }}
            aria-labelledby="book-heading"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="flex items-center gap-3 mb-8" aria-hidden="true">
                    <span className="font-mono text-[0.7rem] tracking-[0.25em] uppercase select-none" style={{ color: "rgba(10,10,10,0.62)" }}>007</span>
                    <span className="h-px w-7 shrink-0" style={{ background: "rgba(10,10,10,0.15)" }} />
                    <span className="text-[0.7rem] tracking-[0.2em] uppercase" style={{ color: "rgba(10,10,10,0.62)" }}>Book a call</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 md:gap-16 items-start">
                    <div>
                        <h2
                            id="book-heading"
                            className="font-serif font-normal leading-[1.08] tracking-[-0.02em] text-balance mb-5"
                            style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)", color: "rgba(10,10,10,0.9)" }}
                        >
                            Prefer to talk? Pick a time.
                        </h2>
                        <p className="text-[0.95rem] leading-[1.75] mb-6 text-pretty" style={{ color: "rgba(10,10,10,0.72)", maxWidth: "42ch" }}>
                            A short video call to hear what you are building and tell you honestly whether I am the right fit.
                            No preparation needed. Times are shown in your timezone.
                        </p>
                        <p className="text-[0.85rem]" style={{ color: "rgba(10,10,10,0.62)" }}>
                            Calendar not loading?{" "}
                            <a href={CAL_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" style={{ color: "hsl(var(--hero-accent-dark))" }}>
                                Open the booking page
                            </a>
                            .
                        </p>
                    </div>

                    <div
                        className="rounded-2xl border overflow-hidden min-h-[560px]"
                        style={{ borderColor: "rgba(10,10,10,0.1)", background: "#fff" }}
                    >
                        <CalBooking />
                    </div>
                </div>
            </div>
        </section>
    );
}
