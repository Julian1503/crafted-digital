"use client";

import * as React from "react";
import Link from "next/link";
import s from "@/components/lab/lab.module.css";

type Mode = "today" | "tidy";

const COPY: Record<Mode, { title: string; body: string }> = {
    today: {
        title: "Your business runs on spreadsheets, sticky notes and memory.",
        body: "It works until someone is sick, a quote gets lost in a reply-all, or the person who knows how the spreadsheet works goes on holiday.",
    },
    tidy: {
        title: "One tool, built around how you already work.",
        body: "Bookings, enquiries, jobs and follow-ups in one place your whole team can see. Custom software and AI automation for Australian small businesses.",
    },
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl bg-white p-4" style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.07), 0 10px 30px -18px rgba(0,0,0,0.4)" }}>
            <p className="text-[0.8rem] font-medium" style={{ color: "#5b5b5b" }}>{title}</p>
            <div className="mt-2">{children}</div>
        </div>
    );
}

function Row({ left, right, ok }: { left: string; right: string; ok?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-3 border-t py-1.5 text-[0.85rem]" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <span className="truncate">{left}</span>
            <span className="shrink-0" style={{ color: ok ? "#2f7d5b" : "#5b5b5b" }}>{right}</span>
        </div>
    );
}

export function HeroToggle() {
    const [mode, setMode] = React.useState<Mode>("today");
    const copy = COPY[mode];

    return (
        <section
            aria-labelledby="lab-b-heading"
            data-header-theme="light"
            className="min-h-[100svh] pt-28 pb-28 md:pt-32"
            style={{ background: "#f9fafb", color: "#0c0c0c" }}
        >
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <div className="flex flex-col items-start gap-7">
                    <h1
                        id="lab-b-heading"
                        className="font-serif font-normal leading-[1.04] tracking-[-0.03em] text-balance"
                        style={{ fontSize: "clamp(2.1rem, 4.4vw, 3.9rem)", maxWidth: "22ch", minHeight: "2.1em" }}
                        aria-live="polite"
                    >
                        {copy.title}
                    </h1>
                    <div className={s.segmented} role="radiogroup" aria-label="Show the business">
                        <button type="button" role="radio" aria-checked={mode === "today"} className={s.seg} onClick={() => setMode("today")}>Today</button>
                        <button type="button" role="radio" aria-checked={mode === "tidy"} className={s.seg} onClick={() => setMode("tidy")}>With Julian</button>
                    </div>
                </div>

                <div className={`${s.stage} ${mode === "today" ? s.today : s.tidy} mt-10`} aria-hidden="true">
                    {/* Spreadsheet → bookings */}
                    <div className={`${s.item} ${s.sheet}`}>
                        <div className={`${s.face} ${s.faceMess}`}>
                            <div className="rounded-md bg-white" style={{ boxShadow: "0 0 0 1px #c9cdc3, 0 18px 40px -20px rgba(0,0,0,0.45)" }}>
                                <p className="border-b px-3 py-1.5 text-[0.75rem]" style={{ background: "#e7eee3", borderColor: "#c9cdc3", color: "#3d5a2f" }}>Bookings FINAL_v3 (2).xlsx</p>
                                <div className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr] text-[0.72rem]">
                                    {["Client", "Date", "Paid?", "Notes", "Dave", "Tue?", "", "call back!!", "Sharon", "12/11", "yes", "", "Mick + co", "?", "NO", "see email", "Bree", "Thu", "", "VAN??"].map((c, i) => (
                                        <span key={i} className="truncate border-b border-r px-2 py-1" style={{ borderColor: "#e3e5df", background: c === "NO" || c === "VAN??" ? "#fde2df" : undefined, fontWeight: i < 4 ? 600 : 400 }}>{c || " "}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={`${s.face} ${s.faceTidy}`}>
                            <Card title="This week's bookings">
                                <Row left="Dave Watson, Tue 9:00" right="Confirmed" ok />
                                <Row left="Sharon Lee, Wed 12:00" right="Paid" ok />
                                <Row left="Mick & Co, Thu 7:30" right="Deposit due" />
                                <Row left="Bree Taylor, Thu 14:00" right="Van booked" ok />
                            </Card>
                        </div>
                    </div>

                    {/* Email chain → enquiries */}
                    <div className={`${s.item} ${s.mail}`}>
                        <div className={`${s.face} ${s.faceMess}`}>
                            <div className="space-y-[-0.6rem]">
                                {["Re: Re: Fwd: quote for Tuesday?", "Re: invoice (resend)", "Fwd: Fwd: who is doing this one"].map((m, i) => (
                                    <div key={m} className="rounded-lg bg-white px-3 py-2.5 text-[0.82rem]" style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 8px 20px -12px rgba(0,0,0,0.4)", transform: `translateX(${i * 10}px)` }}>
                                        <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: "#c0392b" }} />{m}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={`${s.face} ${s.faceTidy}`}>
                            <Card title="Enquiries">
                                <Row left="Quote for Tuesday" right="Replied" ok />
                                <Row left="Invoice resend" right="Sent" ok />
                                <Row left="New job, Glenvale" right="Assigned to Bree" />
                            </Card>
                        </div>
                    </div>

                    {/* Sticky notes → tasks */}
                    <div className={`${s.item} ${s.note1}`}>
                        <div className={`${s.face} ${s.faceMess}`}>
                            <div className="p-4 font-serif text-[1.05rem] leading-snug" style={{ background: "#fde68a", boxShadow: "0 14px 24px -16px rgba(0,0,0,0.5)" }}>Call Dave re invoice before Fri!!</div>
                        </div>
                        <div className={`${s.face} ${s.faceTidy}`}>
                            <Card title="Follow-ups">
                                <Row left="Call Dave about invoice" right="Done" ok />
                            </Card>
                        </div>
                    </div>
                    <div className={`${s.item} ${s.note2}`}>
                        <div className={`${s.face} ${s.faceMess}`}>
                            <div className="p-4 font-serif text-[1.05rem] leading-snug" style={{ background: "#fbcfe8", boxShadow: "0 14px 24px -16px rgba(0,0,0,0.5)" }}>who has the van keys??</div>
                        </div>
                        <div className={`${s.face} ${s.faceTidy}`}>
                            <Card title="Equipment">
                                <Row left="Van, keys with Bree" right="Until Thu" />
                            </Card>
                        </div>
                    </div>

                    {/* Missed calls → call log */}
                    <div className={`${s.item} ${s.calls}`}>
                        <div className={`${s.face} ${s.faceMess}`}>
                            <div className="rounded-2xl px-4 py-3 text-white" style={{ background: "rgba(30,30,30,0.92)", boxShadow: "0 16px 30px -16px rgba(0,0,0,0.7)" }}>
                                <p className="text-[0.75rem]" style={{ color: "rgba(255,255,255,0.7)" }}>Phone, now</p>
                                <p className="text-[0.9rem] font-medium">3 missed calls</p>
                            </div>
                        </div>
                        <div className={`${s.face} ${s.faceTidy}`}>
                            <Card title="Calls">
                                <Row left="3 calls today" right="All returned" ok />
                            </Card>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <p className="max-w-[56ch] text-[1.02rem] leading-[1.7]" style={{ color: "#4a4a4a" }}>{copy.body}</p>
                    <div className="flex flex-wrap items-center gap-6">
                        <Link href="/contact" className={s.primary}>Book a 30-minute call</Link>
                        <Link href="/case-studies" className={s.quiet}>See the work</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
