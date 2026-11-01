"use client";

import * as React from "react";
import Link from "next/link";
import s from "@/components/lab/lab.module.css";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface Task {
    from: string;
    kind: string;
    subject: string;
    message: string;
    draft: string;
    checked: string;
    sentTo: string;
}

// Fictional examples from the kinds of businesses the site is for.
const TASKS: Task[] = [
    {
        from: "Priya Nair",
        kind: "Website enquiry, Northside Physio",
        subject: "Anything this Saturday?",
        message: "Hi, my son rolled his ankle at footy. Do you have anything Saturday morning? And can I claim it?",
        draft: "Hi Priya, sorry to hear about the ankle. Sam has 8:30 and 10:15 free this Saturday and sees a lot of footy injuries. We can claim your private health cover on the spot. Want me to hold 8:30 for you?",
        checked: "Checked the Saturday calendar and the clinic's billing notes",
        sentTo: "Priya",
    },
    {
        from: "Riverina Hardware",
        kind: "Overdue invoice",
        subject: "INV-2207 is 14 days late",
        message: "Invoice INV-2207 for $1,840.00 was due on 17 October. Two reminders have gone out.",
        draft: "Hi team, a quick reminder that INV-2207 for $1,840.00 was due on 17 October. The payment link is below. If it is already on its way, thank you and please ignore this.",
        checked: "Checked the balance in Xero and the last two reminders",
        sentTo: "Riverina Hardware",
    },
    {
        from: "Tuesday shift, 4 pm",
        kind: "NDIS shift notes",
        subject: "Turn rough notes into a progress note",
        message: "shops w/ J. picked ingredients, paid at self checkout w/ prompting. bit anxious in queue, did breathing.",
        draft: "J attended a community access shift at the local supermarket. J chose ingredients independently and paid at self-checkout with verbal prompting. J showed mild anxiety while queuing and used a breathing strategy to settle. Goal progress: independent shopping, on track.",
        checked: "Checked J's plan goals and the organisation's note template",
        sentTo: "J's file",
    },
];

const TYPE_MS = 18;

function useTypewriter(text: string, run: boolean, instant: boolean): string {
    const [shown, setShown] = React.useState(instant ? text : "");
    const [prevText, setPrevText] = React.useState(text);
    if (prevText !== text) {
        setPrevText(text);
        setShown(instant ? text : "");
    }
    React.useEffect(() => {
        if (!run || instant) return;
        let i = 0;
        const id = window.setInterval(() => {
            i += 2;
            setShown(text.slice(0, i));
            if (i >= text.length) window.clearInterval(id);
        }, TYPE_MS);
        return () => window.clearInterval(id);
    }, [text, run, instant]);
    return instant ? text : shown;
}

export function HeroApprove() {
    const reduced = usePrefersReducedMotion();
    const [index, setIndex] = React.useState(0);
    const [sent, setSent] = React.useState<number[]>([]);
    const [toast, setToast] = React.useState<string | null>(null);
    const [editing, setEditing] = React.useState(false);
    const [edited, setEdited] = React.useState<Record<number, string>>({});

    const allDone = sent.length === TASKS.length;
    const task = TASKS[Math.min(index, TASKS.length - 1)];
    const typed = useTypewriter(task.draft, !allDone, reduced);
    const draft = edited[index] ?? typed;
    const ready = typed.length >= task.draft.length;

    const approve = () => {
        if (sent.includes(index)) return;
        setSent((prev) => [...prev, index]);
        setEditing(false);
        setToast(`Sent to ${task.sentTo}. Approved by you, logged with your name.`);
        window.setTimeout(() => {
            setToast(null);
            if (index < TASKS.length - 1) setIndex(index + 1);
        }, 1400);
    };

    return (
        <section
            aria-labelledby="lab-a-heading"
            className="relative min-h-[100svh] pt-28 pb-28 md:pt-32"
            style={{ background: "#0c0c0c", color: "#fff" }}
        >
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
                <div>
                    <h1
                        id="lab-a-heading"
                        className="font-serif font-normal leading-[0.98] tracking-[-0.03em]"
                        style={{ fontSize: "clamp(2.8rem, 6vw, 5.6rem)" }}
                    >
                        <span className="block">Software that does the busywork.</span>
                        <span className={`${s.headlineLine2} ${sent.length ? s.done : s.pending}`}>You keep the final say.</span>
                    </h1>
                    <p className="mt-7 max-w-[44ch] text-[1.05rem] leading-[1.7]" style={{ color: "rgba(255,255,255,0.74)" }}>
                        Custom software and AI automation for Australian small businesses. The AI drafts, you approve, and nothing goes out without a person saying yes. Built by one engineer in Toowoomba.
                    </p>
                    <div className="mt-9 flex flex-wrap items-center gap-6">
                        <Link href="/contact" className={s.primary}>Book a 30-minute call</Link>
                        <Link href="/case-studies" className={s.quiet} style={{ color: "rgba(255,255,255,0.86)" }}>See the work</Link>
                    </div>
                </div>

                {/* The demo: a real-looking approval queue */}
                <div className={s.inbox} role="region" aria-label="Demo: approve an AI draft">
                    <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                        <p className="text-[0.9rem] font-medium">Waiting for your approval</p>
                        <p className="text-[0.85rem]" style={{ color: "#6b6b6b" }}>
                            {allDone ? "All caught up" : `${TASKS.length - sent.length} left`}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-[230px_1fr]">
                        <ul className="hidden md:block border-r" style={{ borderColor: "rgba(0,0,0,0.07)", background: "#f1f1ee" }}>
                            {TASKS.map((t, i) => (
                                <li key={t.subject}>
                                    <button
                                        type="button"
                                        className={s.task}
                                        aria-current={i === index ? "true" : undefined}
                                        onClick={() => { setIndex(i); setEditing(false); }}
                                    >
                                        <span className="flex items-center justify-between gap-2">
                                            <span className="truncate text-[0.85rem] font-medium">{t.from}</span>
                                            {sent.includes(i) && <span className="text-[0.75rem]" style={{ color: "#2f7d5b" }}>Sent</span>}
                                        </span>
                                        <span className="mt-0.5 block truncate text-[0.8rem]" style={{ color: "#6b6b6b" }}>{t.subject}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="min-h-[420px] p-5 md:p-6 flex flex-col">
                            {allDone ? (
                                <div className="m-auto max-w-[34ch] text-center">
                                    <p className="font-serif text-[1.8rem] leading-tight">Three replies sent. Three approved by you.</p>
                                    <p className="mt-3 text-[0.95rem]" style={{ color: "#5b5b5b" }}>That is the whole idea: the busywork is done for you, and every decision stays yours.</p>
                                    <button type="button" className={`${s.quiet} mt-4`} onClick={() => { setSent([]); setIndex(0); setEdited({}); }}>
                                        Run the demo again
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p className="text-[0.8rem]" style={{ color: "#6b6b6b" }}>{task.kind}</p>
                                    <p className="mt-1 text-[1.05rem] font-medium">{task.subject}</p>
                                    <blockquote className="mt-4 rounded-lg p-4 text-[0.92rem] leading-[1.6]" style={{ background: "#ecece8" }}>
                                        {task.message}
                                    </blockquote>

                                    <p className="mt-5 text-[0.8rem]" style={{ color: "#6b6b6b" }}>Draft reply, written by AI</p>
                                    {editing ? (
                                        <textarea
                                            className="mt-2 min-h-[130px] w-full rounded-lg border p-3 text-[0.92rem] leading-[1.6]"
                                            style={{ borderColor: "rgba(0,0,0,0.15)", background: "#fff" }}
                                            value={draft}
                                            onChange={(e) => setEdited((prev) => ({ ...prev, [index]: e.target.value }))}
                                            aria-label="Edit the draft reply"
                                            autoFocus
                                        />
                                    ) : (
                                        <p className="mt-2 min-h-[130px] rounded-lg border bg-white p-3 text-[0.92rem] leading-[1.6]" style={{ borderColor: "rgba(0,0,0,0.1)" }} aria-live="off">
                                            {draft}
                                            {!ready && !edited[index] && <span className={s.caret} aria-hidden="true" />}
                                        </p>
                                    )}
                                    <p className="mt-2 text-[0.8rem]" style={{ color: "#6b6b6b" }}>{task.checked}</p>

                                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                                        <button type="button" className={s.primary} onClick={approve} disabled={!ready && !edited[index]} style={{ opacity: ready || edited[index] ? 1 : 0.5 }}>
                                            Approve and send
                                        </button>
                                        <button type="button" className={s.quiet} onClick={() => setEditing((v) => !v)}>
                                            {editing ? "Done editing" : "Edit"}
                                        </button>
                                        {toast && <p role="status" className={`${s.toast} text-[0.85rem]`} style={{ color: "#2f7d5b" }}>{toast}</p>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
