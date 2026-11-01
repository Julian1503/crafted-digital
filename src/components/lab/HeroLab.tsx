"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import s from "@/components/lab/lab.module.css";
import { HeroApprove } from "@/components/lab/HeroApprove";
import { HeroToggle } from "@/components/lab/HeroToggle";
import { HeroSentence } from "@/components/lab/HeroSentence";

const VARIANTS = [
    { id: "a", label: "A. You approve", short: "A", Component: HeroApprove },
    { id: "b", label: "B. Today / With Julian", short: "B", Component: HeroToggle },
    { id: "c", label: "C. The sentence", short: "C", Component: HeroSentence },
] as const;

export function HeroLab() {
    const router = useRouter();
    const params = useSearchParams();
    const current = VARIANTS.find((v) => v.id === params.get("v")) ?? VARIANTS[0];
    const { Component } = current;

    return (
        <>
            <Component key={current.id} />
            <nav className={s.switcher} aria-label="Hero prototypes">
                {VARIANTS.map((v) => (
                    <button
                        key={v.id}
                        type="button"
                        className={s.tab}
                        aria-pressed={v.id === current.id}
                        onClick={() => router.replace(`/lab/hero?v=${v.id}`, { scroll: true })}
                    >
                        <span className={s.tabLong}>{v.label}</span>
                        <span className={s.tabShort} aria-hidden="true">{v.short}</span>
                        <span className="sr-only sm:hidden">{v.label}</span>
                    </button>
                ))}
            </nav>
        </>
    );
}
