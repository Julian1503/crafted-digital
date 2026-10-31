import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { TrackedLink } from "@/components/ui/tracked-link";
import { FIT_CALL_LABEL } from "@/lib/constants/site";
import { CONTAINER, EYEBROW, P, PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/components/sections/ServicePage/page-tokens";

interface PageHeroProps {
    crumbs: Crumb[];
    eyebrow: string;
    title: string;
    lede: string;
    /** Secondary action beside the call CTA. */
    secondary?: { href: string; label: string };
    /** Where analytics attributes the click. */
    location: string;
}

/** Light hero for service and pricing pages: breadcrumbs, h1, lede, two CTAs. */
export function PageHero({ crumbs, eyebrow, title, lede, secondary, location }: PageHeroProps) {
    return (
        <section
            data-header-theme="light"
            className="pt-28 pb-14 md:pt-36 md:pb-20"
            aria-labelledby="page-heading"
            style={{ background: "hsl(var(--background))" }}
        >
            <div className={CONTAINER}>
                <Breadcrumbs items={crumbs} className="mb-8" />
                <p className={`${EYEBROW} mb-4`} style={{ color: P.muted }}>{eyebrow}</p>
                <h1
                    id="page-heading"
                    className="font-serif font-normal leading-[1.04] tracking-[-0.03em] text-balance max-w-[18ch]"
                    style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.6rem)", color: P.heading }}
                >
                    {title}
                </h1>
                <p className="mt-6 text-[1.05rem] md:text-[1.15rem] leading-[1.7] text-pretty max-w-[58ch]" style={{ color: P.body }}>
                    {lede}
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                    <TrackedLink
                        href="/contact"
                        event="cta_clicked"
                        eventProps={{ location, label: FIT_CALL_LABEL }}
                        className={PRIMARY_BUTTON}
                        style={{ background: P.accent, color: "#fff" }}
                    >
                        {FIT_CALL_LABEL}
                    </TrackedLink>
                    {secondary && (
                        <TrackedLink
                            href={secondary.href}
                            event="cta_clicked"
                            eventProps={{ location, label: secondary.label }}
                            className={SECONDARY_BUTTON}
                            style={{ borderColor: P.border, color: P.heading }}
                        >
                            {secondary.label}
                        </TrackedLink>
                    )}
                </div>
            </div>
        </section>
    );
}
