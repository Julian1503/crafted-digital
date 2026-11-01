"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import s from "@/components/lab/lab.module.css";

interface ChipCase {
    id: string;
    label: string;
    title: string;
    cover: string;
    href: string;
}

const CASES: Record<string, ChipCase> = {
    crm: { id: "crm", label: "CRM", title: "A CRM that never sends without approval", cover: "/img/covers/ai4l-crm.webp", href: "/case-studies/ai4l-crm-consent-safe-campaigns" },
    studio: { id: "studio", label: "content tool", title: "A content studio for course marketing", cover: "/img/covers/wrcc-content-studio.webp", href: "/case-studies/wrcc-social-media-content-studio" },
    agent: { id: "agent", label: "AI that asks before it acts", title: "An AI agent with a human in the loop", cover: "/img/covers/social-media-scout.webp", href: "/case-studies/social-media-scout-ai-agent-human-review" },
};

const TZ = "Australia/Brisbane";

function subscribeMinute(onChange: () => void) {
    const id = window.setInterval(onChange, 20_000);
    return () => window.clearInterval(id);
}

function useToowoombaTime(): string {
    return React.useSyncExternalStore(
        subscribeMinute,
        () => new Intl.DateTimeFormat("en-AU", { hour: "numeric", minute: "2-digit", timeZone: TZ }).format(new Date()),
        () => ""
    );
}

function Chip({ c, open, onOpen, onClose }: { c: ChipCase; open: boolean; onOpen: () => void; onClose: () => void }) {
    // A real link that wraps like text; the preview is a visual extra on hover or focus.
    return (
        <span className={s.chipWrap}>
            <Link
                href={c.href}
                className={s.chip}
                aria-expanded={open}
                aria-label={`${c.label}: ${c.title}`}
                onMouseEnter={onOpen}
                onFocus={onOpen}
                onBlur={onClose}
            >
                <span className={s.thumb} aria-hidden="true">
                    <Image src={c.cover} alt="" fill sizes="40px" className="object-cover" />
                </span>
                {c.label}
            </Link>
        </span>
    );
}

export function HeroSentence() {
    const [open, setOpen] = React.useState<string | null>(null);
    const time = useToowoombaTime();

    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <section
            aria-labelledby="lab-c-heading"
            data-header-theme="light"
            className="min-h-[100svh] pt-32 pb-28 md:pt-40"
            style={{ background: "#f9fafb", color: "#0c0c0c" }}
            onMouseLeave={() => setOpen(null)}
        >
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
                {/* One preview slot in the empty right column, so the sentence stays readable. */}
                {open && (
                    <div className={s.peek} aria-hidden="true">
                        <div className="relative aspect-[5/4]">
                            <Image src={CASES[open].cover} alt="" fill sizes="320px" className="object-cover" />
                        </div>
                        <div className="p-5">
                            <p className="text-[1rem] font-medium leading-snug" style={{ color: "#0c0c0c" }}>{CASES[open].title}</p>
                            <p className="mt-1 text-[0.85rem]" style={{ color: "#a93226" }}>Click the word to read the case study</p>
                        </div>
                    </div>
                )}
                <h1
                    id="lab-c-heading"
                    className="font-serif font-normal leading-[1.12] tracking-[-0.025em]"
                    style={{ fontSize: "clamp(2.1rem, 4.6vw, 4.4rem)", maxWidth: "23ch" }}
                >
                    I build the <Chip c={CASES.crm} open={open === "crm"} onOpen={() => setOpen("crm")} onClose={() => setOpen(null)} /> your team keeps asking for, the{" "}
                    <Chip c={CASES.studio} open={open === "studio"} onOpen={() => setOpen("studio")} onClose={() => setOpen(null)} /> that ends the copy‑paste, and{" "}
                    <Chip c={CASES.agent} open={open === "agent"} onOpen={() => setOpen("agent")} onClose={() => setOpen(null)} />.
                </h1>

                <div className="mt-12 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
                    <p className="max-w-[48ch] text-[1.05rem] leading-[1.7]" style={{ color: "#4a4a4a" }}>
                        Julian Delgado, software engineer. Custom software, AI automation and websites for Australian small businesses, from the first call to launch, by the person who writes the code.
                    </p>
                    <div className="flex flex-wrap items-center gap-6 md:justify-end">
                        <Link href="/contact" className={s.primary}>Book a 30-minute call</Link>
                        <Link href="/case-studies" className={s.quiet}>See the work</Link>
                    </div>
                </div>

                <dl className="mt-12 grid gap-6 border-t pt-6 text-[0.95rem] sm:grid-cols-3" style={{ borderColor: "rgba(12,12,12,0.1)" }}>
                    <div>
                        <dt style={{ color: "#6b6b6b" }}>In Toowoomba it is</dt>
                        <dd className="mt-1 font-serif text-[1.6rem] leading-none" suppressHydrationWarning>{time || " "}</dd>
                    </div>
                    <div>
                        <dt style={{ color: "#6b6b6b" }}>Taking new projects</dt>
                        <dd className="mt-1 font-serif text-[1.6rem] leading-none">From December</dd>
                    </div>
                    <div>
                        <dt style={{ color: "#6b6b6b" }}>You hear back</dt>
                        <dd className="mt-1 font-serif text-[1.6rem] leading-none">Within 24 hours</dd>
                    </div>
                </dl>
            </div>
        </section>
    );
}
