"use client";

import * as React from "react";
import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { ContactForm }  from "@/components/sections/Contact/ContactForm";
import { SuccessState } from "@/components/sections/Contact/SuccessState";
import { track } from "@/lib/analytics";
import { CONTACT_EMAIL } from "@/lib/constants/site";

const VIDEO_POSTER = "https://res.cloudinary.com/dpnkr4r6w/video/upload/v1773265024/lights_bfoa7s.jpg";
const VIDEO_SRC    = "https://res.cloudinary.com/dpnkr4r6w/video/upload/v1773265024/lights_bfoa7s.webm";
const DESKTOP_QUERY = "(min-width: 1024px)";

/** True only on desktop-sized viewports; false during SSR and on phones/tablets. */
function useIsDesktop(): boolean {
    const [isDesktop, setIsDesktop] = React.useState(false);
    React.useEffect(() => {
        const mql = window.matchMedia(DESKTOP_QUERY);
        setIsDesktop(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);
    return isDesktop;
}

interface ContactSectionProps {
    /** Visually bumps the heading to h1 semantics on the standalone /contact page. */
    asPageHeading?: boolean;
}

export function ContactSection({ asPageHeading = false }: ContactSectionProps) {
    const [sectionRef, sectionVisible] = useInView<HTMLElement>(0.04);
    const [isSuccess, setIsSuccess]    = React.useState(false);
    const reducedMotion                = usePrefersReducedMotion();
    const isDesktop                    = useIsDesktop();
    const showVideo                    = isDesktop && !reducedMotion && sectionVisible && !isSuccess;

    const Heading = asPageHeading ? "h1" : "h2";

    return (
        <section
            ref={sectionRef}
            id="contact"
            data-header-theme="light"
            className="py-16 md:py-24 overflow-hidden scroll-mt-16"
            style={{ background: "hsl(var(--background))" }}
            aria-labelledby="contact-heading"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">

                {/* Section label */}
                <div
                    className="flex items-center gap-3 mb-10 md:mb-14"
                    style={{
                        opacity:    sectionVisible ? 1 : 0,
                        transform:  sectionVisible ? "translateY(0)" : "translateY(1.5rem)",
                        transition: "opacity 700ms ease, transform 700ms ease",
                    }}
                    aria-hidden="true"
                >
                    <span className="font-mono text-[0.68rem] tracking-[0.25em] uppercase select-none" style={{ color: "rgba(10,10,10,0.5)" }}>006</span>
                    <span className="h-px w-7 shrink-0" style={{ background: "rgba(10,10,10,0.15)" }} />
                    <span className="text-[0.68rem] tracking-[0.2em] uppercase" style={{ color: "rgba(10,10,10,0.5)" }}>Contact</span>
                </div>

                {/* Split layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 md:gap-20 items-start">

                    {/* Left: statement + meta */}
                    <div
                        style={{
                            opacity:    sectionVisible ? 1 : 0,
                            transform:  sectionVisible ? "translateY(0)" : "translateY(1.75rem)",
                            transition: "opacity 700ms ease 80ms, transform 700ms ease 80ms",
                        }}
                    >
                        <Heading
                            id="contact-heading"
                            className="font-serif font-normal leading-[1.04] tracking-[-0.03em] mb-6 text-balance"
                            style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)", color: "rgba(10,10,10,0.9)" }}
                        >
                            Tell me what you&rsquo;re{" "}
                            <em style={{ color: "hsl(var(--hero-accent))", fontStyle: "italic" }}>building.</em>
                        </Heading>

                        <p className="text-[0.95rem] leading-[1.75] mb-8" style={{ color: "rgba(10,10,10,0.65)", maxWidth: "46ch" }}>
                            Send a few lines about the problem and I&rsquo;ll reply within 24 hours with the best next step.
                            If that step isn&rsquo;t me, I&rsquo;ll say so.
                        </p>

                        {/* Meta strip */}
                        <dl className="flex flex-col gap-0 border-t" style={{ borderColor: "rgba(10,10,10,0.1)" }}>
                            {[
                                { label: "Email",    value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
                                { label: "Based in", value: "Toowoomba, Queensland" },
                                { label: "Serves",   value: "Clients Australia-wide" },
                                { label: "Response", value: "Within 24 hours" },
                            ].map(({ label, value, href }) => (
                                <div
                                    key={label}
                                    className="flex items-start justify-between gap-6 py-3 border-b"
                                    style={{ borderColor: "rgba(10,10,10,0.08)" }}
                                >
                                    <dt className="text-[0.7rem] tracking-[0.16em] uppercase shrink-0" style={{ color: "rgba(10,10,10,0.55)" }}>{label}</dt>
                                    <dd className="text-[0.85rem] text-right" style={{ color: "rgba(10,10,10,0.78)" }}>
                                        {href
                                            ? <a href={href} className="transition-colors duration-200 inline-block py-2 -my-2" style={{ color: "hsl(var(--hero-accent-dark))" }} onClick={() => track("email_clicked", { location: "contact_section" })}>{value}</a>
                                            : value
                                        }
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {/* Right: form */}
                    <div
                        className="relative overflow-hidden rounded-2xl"
                        style={{
                            opacity:    sectionVisible ? 1 : 0,
                            transform:  sectionVisible ? "translateY(0)" : "translateY(1.75rem)",
                            transition: "opacity 700ms ease 180ms, transform 700ms ease 180ms",
                            background: isSuccess ? "transparent" : "#0c0c0c",
                        }}
                    >
                        {showVideo && (
                            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                                <video
                                    poster={VIDEO_POSTER}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
                                    className="w-full h-full object-cover"
                                    style={{ filter: "saturate(1.08) brightness(0.65)" }}
                                >
                                    <source src={VIDEO_SRC} type="video/webm" />
                                </video>
                                <div className="absolute inset-0" style={{ background: "rgba(5,3,3,0.68)" }} />
                            </div>
                        )}
                        <div className="relative z-10 p-6 md:p-10">
                            {isSuccess
                                ? <SuccessState onReset={() => setIsSuccess(false)} />
                                : <ContactForm onSuccess={() => setIsSuccess(true)} dark />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
