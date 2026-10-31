import { TrackedLink } from "@/components/ui/tracked-link";
import { formatAud, type OfferPlan } from "@/lib/content/offers";
import { CONTAINER, EYEBROW, P, PRIMARY_BUTTON } from "@/components/sections/ServicePage/page-tokens";

interface PlanCardsProps {
    heading: string;
    plans: OfferPlan[];
    location: string;
}

/** Price, timeline and inclusions for each plan of a service. */
export function PlanCards({ heading, plans, location }: PlanCardsProps) {
    return (
        <section className="py-16 md:py-24 border-t" style={{ borderColor: P.borderSub }} aria-labelledby="plans-heading">
            <div className={CONTAINER}>
                <p className={`${EYEBROW} mb-3`} style={{ color: P.muted }}>Packages</p>
                <h2 id="plans-heading" className="font-serif font-normal leading-[1.1] tracking-[-0.02em] text-balance mb-10" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)", color: P.heading }}>
                    {heading}
                </h2>
                <ul className={`grid gap-6 list-none p-0 m-0 ${plans.length > 1 ? "md:grid-cols-2" : "md:max-w-2xl"}`}>
                    {plans.map((plan) => (
                        <li
                            key={plan.name}
                            className="flex flex-col rounded-2xl border p-7 md:p-9"
                            style={{ borderColor: P.border, background: "#fff" }}
                        >
                            <h3 className="font-serif font-normal text-[1.6rem] leading-tight" style={{ color: P.heading }}>{plan.name}</h3>
                            <p className="mt-3 text-[1.5rem] tabular-nums" style={{ color: P.heading }}>{formatAud(plan)}</p>
                            <p className={`${EYEBROW} mt-1`} style={{ color: P.muted }}>{plan.timeline}</p>
                            <ul className="mt-6 space-y-2.5 list-none p-0 m-0 text-[0.95rem] leading-[1.6]" style={{ color: P.body }}>
                                {plan.includes.map((line) => (
                                    <li key={line} className="flex gap-3">
                                        <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: P.accent }} />
                                        <span>{line}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 pt-6 border-t" style={{ borderColor: P.borderSub }}>
                                <TrackedLink
                                    href={`/contact?plan=${encodeURIComponent(plan.name)}`}
                                    event="plan_cta_clicked"
                                    eventProps={{ plan: plan.name, location }}
                                    className={PRIMARY_BUTTON}
                                    style={{ background: P.dark, color: "#fff" }}
                                >
                                    Get a fixed quote
                                </TrackedLink>
                            </div>
                        </li>
                    ))}
                </ul>
                <p className="mt-6 text-[0.85rem]" style={{ color: P.muted }}>
                    All prices in Australian dollars. 50% deposit to lock in the start date, 50% on completion and approval.
                </p>
            </div>
        </section>
    );
}
