import { FAQS } from "@/components/sections/faq-data";
import { safeJsonLd } from "@/lib/seo/json-ld";
import { CONTAINER, EYEBROW, P } from "@/components/sections/ServicePage/page-tokens";

interface FaqListProps {
    /** FAQ ids from faq-data, in display order. */
    ids: string[];
}

/** A subset of the site FAQs as native disclosures, with FAQPage markup. */
export function FaqList({ ids }: FaqListProps) {
    const items = ids.map((id) => {
        const item = FAQS.find((f) => f.id === id);
        if (!item) console.error(`[faq] unknown FAQ id "${id}"`);
        return item;
    }).filter((f): f is NonNullable<typeof f> => Boolean(f));
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
    };

    return (
        <section className="py-16 md:py-24 border-t" style={{ borderColor: P.borderSub }} aria-labelledby="faq-heading">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
            <div className={CONTAINER}>
                <p className={`${EYEBROW} mb-3`} style={{ color: P.muted }}>Questions</p>
                <h2 id="faq-heading" className="font-serif font-normal leading-[1.1] tracking-[-0.02em] mb-8" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)", color: P.heading }}>
                    Before you get in touch
                </h2>
                <div className="max-w-3xl divide-y" style={{ borderColor: P.border }}>
                    {items.map((faq) => (
                        <details key={faq.question} className="group py-1" style={{ borderColor: P.border }}>
                            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 text-[1.05rem] leading-snug font-medium [&::-webkit-details-marker]:hidden" style={{ color: P.heading }}>
                                <span>{faq.question}</span>
                                <span aria-hidden="true" className="mt-1 shrink-0 text-[1.1rem] transition-transform duration-200 group-open:rotate-45" style={{ color: P.accent }}>+</span>
                            </summary>
                            <p className="pb-5 pr-10 text-[0.95rem] leading-[1.7] text-pretty" style={{ color: P.body }}>{faq.answer}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
