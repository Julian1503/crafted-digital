import { steps } from "@/components/sections/Process/process-data";
import { CONTAINER, EYEBROW, P } from "@/components/sections/ServicePage/page-tokens";

/** The four phases, as a plain numbered list. */
export function ProcessSummary() {
    return (
        <section className="py-16 md:py-24 border-t" style={{ borderColor: P.borderSub }} aria-labelledby="process-heading">
            <div className={CONTAINER}>
                <p className={`${EYEBROW} mb-3`} style={{ color: P.muted }}>How it works</p>
                <h2 id="process-heading" className="font-serif font-normal leading-[1.1] tracking-[-0.02em] text-balance mb-10" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)", color: P.heading }}>
                    Four phases, a demo every week.
                </h2>
                <ol className="grid gap-8 md:grid-cols-4 list-none p-0 m-0">
                    {steps.map((step, i) => (
                        <li key={step.title} className="border-t pt-5" style={{ borderColor: P.border }}>
                            <p className="font-mono text-[0.75rem] tracking-[0.18em]" style={{ color: P.muted }} aria-hidden="true">
                                0{i + 1}
                            </p>
                            <h3 className="mt-2 font-serif font-normal text-[1.35rem] leading-tight" style={{ color: P.heading }}>{step.title}</h3>
                            <p className={`${EYEBROW} mt-1`} style={{ color: P.accentDark }}>{step.range}</p>
                            <p className="mt-3 text-[0.95rem] leading-[1.65] text-pretty" style={{ color: P.body }}>{step.description}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
