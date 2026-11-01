"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import s from "@/components/lab/lab.module.css";
import { Grain, HeroActions } from "@/components/lab/LabParts";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type CaseId = "crm" | "studio" | "agent";

interface CaseRef {
    label: string;
    category: string;
    title: string;
    cover: string;
    href: string;
}

const ORDER: CaseId[] = ["crm", "studio", "agent"];
const CASES: Record<CaseId, CaseRef> = {
    crm: { label: "CRM", category: "CRM & automation", title: "A CRM that never sends without approval", cover: "/img/covers/ai4l-crm.webp", href: "/case-studies/ai4l-crm-consent-safe-campaigns" },
    studio: { label: "content tool", category: "Internal tool", title: "A content studio for course marketing", cover: "/img/covers/wrcc-content-studio.webp", href: "/case-studies/wrcc-social-media-content-studio" },
    agent: { label: "AI that asks before it acts", category: "AI agent", title: "An AI agent with a human in the loop", cover: "/img/covers/social-media-scout.webp", href: "/case-studies/social-media-scout-ai-agent-human-review" },
};

const CYCLE_MS = 4500;
const TZ = "Australia/Brisbane";

function subscribeClock(onChange: () => void) {
    const id = window.setInterval(onChange, 20_000);
    return () => window.clearInterval(id);
}

function useToowoombaTime(): string {
    return React.useSyncExternalStore(
        subscribeClock,
        () => new Intl.DateTimeFormat("en-AU", { hour: "numeric", minute: "2-digit", timeZone: TZ }).format(new Date()),
        () => ""
    );
}

interface WordProps { id: CaseId; active: CaseId; held: boolean; onPick: (id: CaseId) => void }

function Word({ id, active, held, onPick }: WordProps) {
    const c = CASES[id];
    return (
        <Link
            href={c.href}
            className={s.word}
            data-active={id === active ? "true" : undefined}
            data-held={held && id === active ? "true" : undefined}
            aria-label={`${c.label}. Case study: ${c.title}`}
            onMouseEnter={() => onPick(id)}
            onFocus={() => onPick(id)}
        >
            {c.label}
        </Link>
    );
}

function Plate({ active, held }: { active: CaseId; held: boolean }) {
    const c = CASES[active];
    return (
        <figure className={s.plate}>
            <div className={`${s.plateImg} ${held ? s.plateHeld : ""}`}>
                {ORDER.map((id) => (
                    <Image
                        key={id}
                        src={CASES[id].cover}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 38vw, 100vw"
                        className={`${s.platePhoto} ${id === active ? s.platePhotoOn : ""}`}
                        priority={id === "crm"}
                    />
                ))}
                <div className={s.plateBand} aria-hidden="true" />
                <div className={s.plateTicks} aria-hidden="true">
                    {ORDER.map((id) => <span key={id} data-on={id === active ? "true" : undefined} />)}
                </div>
            </div>
            <figcaption className="mt-5 flex items-end justify-between gap-6">
                <span>
                    <span className={s.plateKicker}>{c.category}</span>
                    <span className="mt-1 block font-serif text-[1.35rem] leading-[1.15]">{c.title}</span>
                </span>
                <Link href={c.href} className={`${s.textLink} shrink-0`}>Read it</Link>
            </figcaption>
        </figure>
    );
}

export function HeroSentence() {
    const reduced = usePrefersReducedMotion();
    const [active, setActive] = React.useState<CaseId>("crm");
    const [held, setHeld] = React.useState(false);
    const time = useToowoombaTime();

    // Cycle through the three case studies until the visitor points at one.
    React.useEffect(() => {
        if (reduced || held) return;
        const id = window.setInterval(() => setActive((a) => ORDER[(ORDER.indexOf(a) + 1) % ORDER.length]), CYCLE_MS);
        return () => window.clearInterval(id);
    }, [reduced, held]);

    const pick = (id: CaseId) => { setActive(id); setHeld(true); };

    return (
        <section aria-labelledby="lab-c-heading" className={`${s.dark} relative overflow-hidden`}>
            <Grain />
            <div className="relative z-[2] mx-auto max-w-7xl px-5 pt-28 pb-24 sm:px-8 lg:pt-32">
                <div className="grid items-center gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
                    <div onMouseLeave={() => setHeld(false)}>
                        <h1 id="lab-c-heading" className={s.displayC}>
                            I build the <Word id="crm" active={active} held={held} onPick={pick} /> your team keeps asking for, the{" "}
                            <Word id="studio" active={active} held={held} onPick={pick} /> that ends the copy&#8209;paste, and{" "}
                            <Word id="agent" active={active} held={held} onPick={pick} />.
                        </h1>
                    </div>
                    <div onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}>
                        <Plate active={active} held={held} />
                    </div>
                </div>

                <div className="mt-12 grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-center">
                    <p className={`${s.lede} max-w-[50ch]`}>
                        Julian Delgado, software engineer in Toowoomba. Custom software, AI automation and websites for Australian small businesses, from the first call to launch, by the person who writes the code.
                    </p>
                    <HeroActions />
                </div>

                <dl className={s.facts}>
                    <div>
                        <dt>In Toowoomba it is</dt>
                        <dd suppressHydrationWarning>{time || " "}</dd>
                    </div>
                    <div>
                        <dt>Taking new projects</dt>
                        <dd>From December</dd>
                    </div>
                    <div>
                        <dt>You hear back</dt>
                        <dd>Within 24 hours</dd>
                    </div>
                </dl>
            </div>
        </section>
    );
}
