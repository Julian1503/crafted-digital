import { TrackedLink } from "@/components/ui/tracked-link";
import { CONTACT_EMAIL, FIT_CALL_LABEL } from "@/lib/constants/site";
import { CONTAINER, EYEBROW, P, PRIMARY_BUTTON } from "@/components/sections/ServicePage/page-tokens";

interface CtaBandProps {
    heading: string;
    body: string;
    location: string;
}

/** Dark closing band with the call CTA and the email as a fallback. */
export function CtaBand({ heading, body, location }: CtaBandProps) {
    return (
        <section className="py-20 md:py-28" style={{ background: P.dark }} aria-labelledby="cta-heading">
            <div className={`${CONTAINER} flex flex-col md:flex-row md:items-end md:justify-between gap-10`}>
                <div>
                    <p className={`${EYEBROW} mb-4`} style={{ color: "rgba(255,255,255,0.6)" }}>Next step</p>
                    <h2 id="cta-heading" className="font-serif font-normal leading-[1.05] tracking-[-0.03em] text-balance max-w-[20ch]" style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)", color: "rgba(255,255,255,0.92)" }}>
                        {heading}
                    </h2>
                    <p className="mt-5 max-w-[46ch] text-[0.98rem] leading-[1.7] text-pretty" style={{ color: "rgba(255,255,255,0.7)" }}>{body}</p>
                </div>
                <div className="flex flex-col items-start gap-4 shrink-0">
                    <TrackedLink
                        href="/contact"
                        event="cta_clicked"
                        eventProps={{ location, label: FIT_CALL_LABEL }}
                        className={PRIMARY_BUTTON}
                        style={{ background: P.accent, color: "#fff" }}
                    >
                        {FIT_CALL_LABEL}
                    </TrackedLink>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-[0.85rem] underline underline-offset-4" style={{ color: "rgba(255,255,255,0.72)" }}>
                        or email {CONTACT_EMAIL}
                    </a>
                </div>
            </div>
        </section>
    );
}
