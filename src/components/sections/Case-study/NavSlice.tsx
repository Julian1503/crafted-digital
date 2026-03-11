import Link from "next/link";
import Image from "next/image";
import { NavStudy } from "@/components/sections/Case-study/case-study.types";
import { C } from "@/components/sections/Case-study/case-study.constants";

interface NavSliceProps {
    study:     NavStudy;
    direction: "prev" | "next";
}

export function NavSlice({ study, direction }: NavSliceProps) {
    const href   = `/case-studies/${study.slug}`;
    const isPrev = direction === "prev";

    // Pull first result/stat as a teaser if it exists on the nav study
    // NavStudy may optionally carry a `description` or `highlightStat`
    const teaser = (study as any).description as string | undefined;

    return (
        <Link
            href={href}
            className="group relative flex-1 overflow-hidden min-h-[32vh] md:min-h-[40vh] flex flex-col justify-end p-8 md:p-12"
            style={{ background: "#111" }}
        >
            {/* Background image */}
            {study.image && (
                <div className="absolute inset-0 transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
                    <Image
                        src={study.image}
                        alt={study.title}
                        fill
                        sizes="50vw"
                        className="object-cover"
                        style={{ filter: "saturate(0.15) brightness(0.28)", transition: "filter 600ms ease" }}
                    />
                </div>
            )}

            {/* Hover: lift image brightness slightly */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: "rgba(255,255,255,0.03)" }}
            />

            {/* Directional gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: isPrev
                        ? "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 100%)"
                        : "linear-gradient(to left,  rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 100%)",
                }}
            />

            {/* Content */}
            <div className={`relative z-10 ${isPrev ? "" : "text-right"}`}>
                {/* Direction label */}
                <span
                    className="block text-[0.52rem] tracking-[0.28em] uppercase mb-3 transition-colors duration-300"
                    style={{ color: C.dim }}
                >
                    {isPrev ? "← Previous" : "Next →"}
                </span>

                {/* Category */}
                {study.category && (
                    <span
                        className="block text-[0.58rem] tracking-[0.18em] uppercase mb-2"
                        style={{ color: C.accent }}
                    >
                        {study.category}
                    </span>
                )}

                {/* Title */}
                <h3
                    className="font-serif font-normal leading-[1.05] tracking-[-0.025em] transition-[color] duration-300"
                    style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)", color: "rgba(255,255,255,0.82)" }}
                >
                    {study.title}
                </h3>

                {/* Description teaser — slides in on hover */}
                {teaser && (
                    <p
                        className={`
                            mt-3 text-[0.75rem] leading-[1.7] max-w-[30ch]
                            overflow-hidden
                            max-h-0 opacity-0
                            group-hover:max-h-[5rem] group-hover:opacity-100
                            transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                            ${isPrev ? "" : "ml-auto"}
                        `}
                        style={{ color: "rgba(255,255,255,0.38)" }}
                    >
                        {/* Truncate to ~120 chars */}
                        {teaser.length > 120 ? teaser.slice(0, 117) + "…" : teaser}
                    </p>
                )}

                {/* "Read case study" micro-CTA — appears on hover */}
                <span
                    className={`
                        inline-flex items-center gap-1.5 mt-4
                        text-[0.58rem] tracking-[0.16em] uppercase
                        opacity-0 group-hover:opacity-100
                        translate-y-1 group-hover:translate-y-0
                        transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
                        ${isPrev ? "" : "ml-auto"}
                    `}
                    style={{ color: C.accent }}
                >
                    Read case study
                    <span aria-hidden="true">{isPrev ? "←" : "→"}</span>
                </span>
            </div>

            {/* Accent side bar */}
            <div
                className={`absolute ${isPrev ? "left-0" : "right-0"} top-0 bottom-0 w-[3px] transition-transform duration-500 origin-top scale-y-0 group-hover:scale-y-100`}
                style={{ background: C.accent }}
                aria-hidden="true"
            />
        </Link>
    );
}