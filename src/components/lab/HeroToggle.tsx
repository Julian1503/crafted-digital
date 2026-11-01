"use client";

import * as React from "react";
import s from "@/components/lab/lab.module.css";
import { Grain, HeroActions } from "@/components/lab/LabParts";

type Mode = "today" | "tidy";

const COPY: Record<Mode, { title: string; body: string }> = {
    today: {
        title: "Your business runs on spreadsheets, sticky notes and memory.",
        body: "It works until someone is sick, a quote gets lost in a reply-all, or the person who knows the spreadsheet goes on holiday.",
    },
    tidy: {
        title: "Same week, same people. One place to run it.",
        body: "Bookings, enquiries, jobs and follow-ups in one tool your whole team can see, built around how you already work.",
    },
};

type Status = "ok" | "due" | "plain";

function Panel({ title, rows }: { title: string; rows: [string, string, Status][] }) {
    return (
        <div className={s.panel}>
            <p className={s.panelTitle}>{title}</p>
            {rows.map(([left, right, status]) => (
                <div key={left} className={s.panelRow}>
                    <span className="truncate">{left}</span>
                    <span className={status === "ok" ? s.pillOk : status === "due" ? s.pillDue : s.pillPlain}>{right}</span>
                </div>
            ))}
        </div>
    );
}

function Item({ cls, mess, tidy }: { cls: string; mess: React.ReactNode; tidy: React.ReactNode }) {
    return (
        <div className={`${s.item} ${cls}`}>
            <div className={`${s.face} ${s.faceMess}`}>{mess}</div>
            <div className={`${s.face} ${s.faceTidy}`}>{tidy}</div>
        </div>
    );
}

const SHEET_CELLS = ["Client", "Date", "Paid?", "Notes", "Dave", "Tue?", "", "call back!!", "Sharon", "12/11", "yes", "", "Mick + co", "?", "NO", "see email", "Bree", "Thu", "", "VAN??"];
const MAIL = ["Re: Re: Fwd: quote for Tuesday?", "Re: invoice (resend)", "Fwd: Fwd: who is doing this one"];

function Desk({ mode }: { mode: Mode }) {
    return (
        <div className={`${s.stage} ${mode === "today" ? s.today : s.tidy}`} aria-hidden="true">
            <div className={s.window}>
                <div className={s.windowBar}>
                    <span className="font-serif text-[1.05rem]">Watson Plumbing</span>
                    <span className={s.windowTabs}><span className={s.windowTabOn}>This week</span><span>Jobs</span><span>Customers</span></span>
                    <span className={s.windowDate}>Thu 13 Nov</span>
                </div>
            </div>

            <Item
                cls={s.sheetItem}
                mess={
                    <div className={s.printout}>
                        <p className={s.printoutName}>Bookings FINAL_v3 (2).xlsx</p>
                        <div className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr] text-[0.72rem]">
                            {SHEET_CELLS.map((c, i) => (
                                <span key={i} className={`${s.cell} ${c === "NO" || c === "VAN??" ? s.cellBad : ""} ${i < 4 ? "font-semibold" : ""}`}>{c || " "}</span>
                            ))}
                        </div>
                    </div>
                }
                tidy={<Panel title="Bookings" rows={[["Dave Watson, Tue 9:00", "Confirmed", "ok"], ["Sharon Lee, Wed 12:00", "Paid", "ok"], ["Mick & Co, Thu 7:30", "Deposit due", "due"], ["Bree Taylor, Thu 14:00", "Van booked", "ok"]]} />}
            />
            <Item
                cls={s.mailItem}
                mess={
                    <div className="space-y-2">
                        {MAIL.map((m, i) => (
                            <div key={m} className={s.notif} style={{ transform: `translateX(${i * 12}px)` }}>
                                <span className={s.notifDot} />{m}
                            </div>
                        ))}
                    </div>
                }
                tidy={<Panel title="Enquiries" rows={[["Quote for Tuesday", "Replied", "ok"], ["Invoice resend", "Sent", "ok"], ["New job, Glenvale", "Bree has it", "plain"]]} />}
            />
            <Item
                cls={s.note1}
                mess={<div className={`${s.sticky} ${s.stickyYellow}`}>Call Dave re invoice before Fri!!</div>}
                tidy={<Panel title="Follow-ups" rows={[["Call Dave about invoice", "Done", "ok"], ["Send Sharon her receipt", "Done", "ok"]]} />}
            />
            <Item
                cls={s.note2}
                mess={<div className={`${s.sticky} ${s.stickyPink}`}>who has the van keys??</div>}
                tidy={<Panel title="Equipment" rows={[["Van keys with Bree", "Until Thu", "plain"], ["Ladder back from Mick", "Returned", "ok"]]} />}
            />
            <Item
                cls={s.calls}
                mess={
                    <div className={s.missed}>
                        <span className={s.missedCount}>3</span>
                        <span><span className="block text-[0.72rem] opacity-70">Phone, just now</span><span className="block text-[0.9rem] font-medium">Missed calls</span></span>
                    </div>
                }
                tidy={<Panel title="Calls" rows={[["3 calls today", "All returned", "ok"], ["Glenvale enquiry", "Booked Fri", "ok"]]} />}
            />
        </div>
    );
}

export function HeroToggle() {
    const [mode, setMode] = React.useState<Mode>("today");
    const copy = COPY[mode];

    return (
        <section aria-labelledby="lab-b-heading" className={`${s.dark} relative overflow-hidden`}>
            <Grain />
            <div className="relative z-[2] mx-auto max-w-7xl px-5 pt-32 pb-24 sm:px-8 md:pt-36">
                <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end">
                    <h1 id="lab-b-heading" key={mode} className={`${s.displayB} ${s.swap}`} aria-live="polite">
                        {copy.title}
                    </h1>
                    <div>
                        <p key={mode} className={`${s.lede} ${s.swap}`}>{copy.body}</p>
                        <div className="mt-8"><HeroActions /></div>
                    </div>
                </div>

                <div className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <div className={s.segmented} role="radiogroup" aria-label="Show the business">
                        <button type="button" role="radio" aria-checked={mode === "today"} className={s.seg} onClick={() => setMode("today")}>Today</button>
                        <button type="button" role="radio" aria-checked={mode === "tidy"} className={s.seg} onClick={() => setMode("tidy")}>With Julian</button>
                    </div>
                    <p className={s.hint}>{mode === "today" ? "Switch to see the same week, sorted." : "Nothing new was added. It is the same week."}</p>
                </div>

                <div className="mt-8"><Desk mode={mode} /></div>
            </div>
        </section>
    );
}
