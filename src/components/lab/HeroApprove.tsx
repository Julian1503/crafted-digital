"use client";

import * as React from "react";
import s from "@/components/lab/lab.module.css";
import { Grain, HeroActions } from "@/components/lab/LabParts";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface Task {
    from: string;
    kind: string;
    subject: string;
    message: string;
    draft: string;
    checked: string;
    logLine: string;
}

// Fictional examples from the kinds of businesses the site is for.
const TASKS: Task[] = [
    {
        from: "Priya Nair",
        kind: "Website enquiry",
        subject: "Anything this Saturday?",
        message: "Hi, my son rolled his ankle at footy. Do you have anything Saturday morning? And can I claim it?",
        draft: "Hi Priya, sorry to hear about the ankle. Sam has 8:30 and 10:15 free this Saturday and sees a lot of footy injuries. We can claim your private health cover on the spot. Want me to hold 8:30 for you?",
        checked: "Checked the Saturday calendar and the clinic's billing notes.",
        logLine: "Reply to Priya Nair",
    },
    {
        from: "Riverina Hardware",
        kind: "Overdue invoice",
        subject: "INV-2207 is 14 days late",
        message: "Invoice INV-2207 for $1,840.00 was due on 17 October. Two reminders have gone out.",
        draft: "Hi team, a quick reminder that INV-2207 for $1,840.00 was due on 17 October. The payment link is below. If it is already on its way, thank you and please ignore this.",
        checked: "Checked the balance in Xero and the last two reminders.",
        logLine: "Reminder to Riverina Hardware",
    },
    {
        from: "Tuesday shift, 4 pm",
        kind: "Shift notes",
        subject: "Rough notes into a progress note",
        message: "shops w/ J. picked ingredients, paid at self checkout w/ prompting. bit anxious in queue, did breathing.",
        draft: "J attended a community access shift at the local supermarket. J chose ingredients independently and paid at self-checkout with verbal prompting. J showed mild anxiety while queuing and used a breathing strategy to settle. Goal progress: independent shopping, on track.",
        checked: "Checked J's plan goals and the organisation's note template.",
        logLine: "Progress note for J",
    },
];

const TYPE_MS = 18;
const STAMP_MS = 950;
const LEAVE_MS = 520;

type Phase = "drafting" | "stamped" | "leaving";
interface LogEntry { line: string; time: string }

function clockNow(): string {
    return new Intl.DateTimeFormat("en-AU", { hour: "numeric", minute: "2-digit" }).format(new Date());
}

function useTypewriter(text: string, instant: boolean): string {
    const [shown, setShown] = React.useState("");
    const [prevText, setPrevText] = React.useState(text);
    if (prevText !== text) {
        setPrevText(text);
        setShown("");
    }
    React.useEffect(() => {
        if (instant) return;
        let i = 0;
        const id = window.setInterval(() => {
            i += 2;
            setShown(text.slice(0, i));
            if (i >= text.length) window.clearInterval(id);
        }, TYPE_MS);
        return () => window.clearInterval(id);
    }, [text, instant]);
    return instant ? text : shown;
}

function Stamp({ time }: { time: string }) {
    return (
        <div className={s.stamp} aria-hidden="true">
            <span className={s.stampBig}>Approved</span>
            <span className={s.stampSmall}>by you, {time}</span>
        </div>
    );
}

function DoneSheet({ onReset }: { onReset: () => void }) {
    return (
        <article className={`${s.sheet} ${s.front} ${s.enter}`} aria-label="All caught up">
            <p className={s.sheetMeta}>All caught up</p>
            <p className="mt-6 font-serif text-[clamp(1.9rem,3vw,2.5rem)] leading-[1.08] tracking-[-0.02em]">
                Three replies out. Three times you said yes.
            </p>
            <p className={`${s.sheetBody} mt-5 max-w-[40ch]`}>
                The software did the reading, the checking and the first draft. The decision stayed with you, and the log shows who approved what.
            </p>
            <button type="button" className={`${s.sheetLink} mt-8`} onClick={onReset}>Run it again</button>
        </article>
    );
}

export function HeroApprove() {
    const reduced = usePrefersReducedMotion();
    const [index, setIndex] = React.useState(0);
    const [phase, setPhase] = React.useState<Phase>("drafting");
    const [log, setLog] = React.useState<LogEntry[]>([]);
    const [stampTime, setStampTime] = React.useState("");
    const [editing, setEditing] = React.useState(false);
    const [edited, setEdited] = React.useState<Record<number, string>>({});
    const timers = React.useRef<number[]>([]);

    React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

    const allDone = index >= TASKS.length;
    const task = TASKS[Math.min(index, TASKS.length - 1)];
    const typed = useTypewriter(task.draft, reduced || allDone);
    const draft = edited[index] ?? typed;
    const ready = typed.length >= task.draft.length || edited[index] !== undefined;
    const behind = Math.min(TASKS.length - index - 1, 2);

    const approve = () => {
        if (phase !== "drafting" || !ready) return;
        const time = clockNow();
        setStampTime(time);
        setEditing(false);
        setPhase("stamped");
        setLog((prev) => [...prev, { line: task.logLine, time }]);
        timers.current.push(
            window.setTimeout(() => setPhase("leaving"), STAMP_MS),
            window.setTimeout(() => { setIndex((i) => i + 1); setPhase("drafting"); }, STAMP_MS + LEAVE_MS),
        );
    };

    const reset = () => { setIndex(0); setLog([]); setEdited({}); setPhase("drafting"); };

    return (
        <section aria-labelledby="lab-a-heading" className={`${s.dark} relative overflow-hidden`}>
            <Grain />
            <div className={s.band} aria-hidden="true" />
            <div className="relative z-[2] mx-auto grid min-h-[100svh] max-w-7xl gap-x-20 gap-y-14 px-5 pt-32 pb-28 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:grid-rows-[auto_1fr] lg:pt-36">
                <div>
                    <h1 id="lab-a-heading" className={s.displayA}>
                        <span className="block">Software that does the busywork.</span>
                        <span className={`${s.line2} ${log.length ? s.line2On : ""}`}>You keep the final say.</span>
                    </h1>
                    <p className={`${s.lede} mt-8 max-w-[42ch]`}>
                        Custom software and AI automation for Australian small businesses. It reads, checks and drafts. Nothing goes out until a person says yes. Built by one engineer in Toowoomba.
                    </p>
                    <div className="mt-10"><HeroActions /></div>
                </div>

                <div className={`${s.desk} lg:row-span-2`} role="region" aria-label="Demo: approve a draft written by AI">
                    {behind >= 2 && <div className={`${s.sheet} ${s.back2}`} aria-hidden="true" />}
                    {behind >= 1 && <div className={`${s.sheet} ${s.back1}`} aria-hidden="true" />}
                    {allDone ? (
                        <DoneSheet onReset={reset} />
                    ) : (
                        <article
                            key={index}
                            className={`${s.sheet} ${s.front} ${phase === "leaving" ? s.leaving : s.enter}`}
                            aria-label={`${task.kind}: ${task.subject}`}
                        >
                            <header className="flex items-baseline justify-between gap-4">
                                <p className={s.sheetMeta}>{task.kind}</p>
                                <p className={s.sheetMeta}>{index + 1} of {TASKS.length}</p>
                            </header>
                            <p className="mt-5 font-serif text-[clamp(1.5rem,2.2vw,1.9rem)] leading-[1.1] tracking-[-0.015em]">{task.subject}</p>
                            <p className={`${s.sheetMeta} mt-1`}>From {task.from}</p>
                            <blockquote className={s.quote}>{task.message}</blockquote>

                            <p className={`${s.sheetLabel} mt-7`}>Draft reply, written by AI</p>
                            {editing ? (
                                <textarea
                                    className={`${s.draft} ${s.draftEdit}`}
                                    value={draft}
                                    onChange={(e) => setEdited((prev) => ({ ...prev, [index]: e.target.value }))}
                                    aria-label="Edit the draft reply"
                                    autoFocus
                                />
                            ) : (
                                <p className={s.draft}>
                                    {draft}
                                    {!ready && <span className={s.caret} aria-hidden="true" />}
                                </p>
                            )}
                            <p className={`${s.sheetMeta} mt-3`}>{task.checked}</p>

                            <footer className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                                <button type="button" className={s.approve} onClick={approve} disabled={!ready || phase !== "drafting"}>
                                    Approve and send
                                </button>
                                <button type="button" className={s.sheetLink} onClick={() => setEditing((v) => !v)} disabled={phase !== "drafting"}>
                                    {editing ? "Done editing" : "Edit first"}
                                </button>
                            </footer>
                            {phase !== "drafting" && <Stamp time={stampTime} />}
                        </article>
                    )}
                </div>

                <div className="lg:self-end">
                    <p className={s.logLabel}>Sent today. Every one approved by you.</p>
                    <ol className="mt-3" aria-live="polite">
                        {log.length === 0 && <li className={s.logEmpty}>Nothing sent yet. The drafts wait for you.</li>}
                        {log.map((e) => (
                            <li key={e.line} className={s.logRow}>
                                <span>{e.line}</span>
                                <span className={s.logTime}>{e.time}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}
