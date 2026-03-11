"use client";

import * as React from "react";
import { useInView } from "@/hooks/use-in-view";
import { ContactForm }  from "@/components/sections/Contact/ContactForm";
import { SuccessState } from "@/components/sections/Contact/SuccessState";

export function ContactSection() {
    const [sectionRef, sectionVisible] = useInView<HTMLElement>(0.04);
    const [isSuccess, setIsSuccess]    = React.useState(false);

    return (
        <section
            ref={sectionRef}
            id="contact"
            data-header-theme="light"
            className="py-16 md:py-24 overflow-hidden"
            style={{ background: "hsl(var(--background))" }}
            aria-labelledby="contact-heading"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">

                {/* Section label */}
                <div
                    className="flex items-center gap-3 mb-10 md:mb-14 will-change-[opacity,transform]"
                    style={{
                        opacity:    sectionVisible ? 1 : 0,
                        transform:  sectionVisible ? "translateY(0)" : "translateY(1.5rem)",
                        transition: "opacity 700ms ease, transform 700ms ease",
                    }}
                >
                    <span className="font-mono text-[0.62rem] tracking-[0.25em] uppercase select-none" style={{ color: "rgba(10,10,10,0.22)" }}>006</span>
                    <span className="h-px w-7 shrink-0" style={{ background: "rgba(10,10,10,0.12)" }} aria-hidden="true" />
                    <span className="text-[0.62rem] tracking-[0.2em] uppercase" style={{ color: "rgba(10,10,10,0.22)" }}>Contact</span>
                </div>

                {/* Split layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 md:gap-20 items-start">

                    {/* Left — statement + meta */}
                    <div
                        className="will-change-[opacity,transform]"
                        style={{
                            opacity:    sectionVisible ? 1 : 0,
                            transform:  sectionVisible ? "translateY(0)" : "translateY(1.75rem)",
                            transition: "opacity 700ms ease 80ms, transform 700ms ease 80ms",
                        }}
                    >
                        <h2
                            id="contact-heading"
                            className="font-serif font-normal leading-[1.04] tracking-[-0.03em] mb-8"
                            style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", color: "rgba(10,10,10,0.9)" }}
                        >
                            Ready to build something{" "}
                            <em style={{ color: "hsl(var(--hero-accent))", fontStyle: "italic" }}>extraordinary?</em>
                        </h2>

                        <p className="text-[0.88rem] leading-[1.8] mb-10" style={{ color: "rgba(10,10,10,0.45)", maxWidth: "42ch" }}>
                            Whether you have a fully fleshed-out idea or just a spark of inspiration —
                            tell me what you&apos;re trying to build and I&apos;ll help you map the best path forward.
                        </p>

                        {/* Meta strip */}
                        <div className="flex flex-col gap-0 border-t" style={{ borderColor: "rgba(10,10,10,0.08)" }}>
                            {[
                                { label: "Email",    value: "julianedelgado@hotmail.com", href: "mailto:julianedelgado@hotmail.com" },
                                { label: "Based in", value: "Toowoomba, Queensland" },
                                { label: "Serves",   value: "Clients Australia-wide" },
                                { label: "Response", value: "Within 24 hours" },
                            ].map(({ label, value, href }) => (
                                <div
                                    key={label}
                                    className="flex items-start justify-between gap-6 py-3 border-b"
                                    style={{ borderColor: "rgba(10,10,10,0.06)" }}
                                >
                                    <dt className="text-[0.65rem] tracking-[0.16em] uppercase shrink-0" style={{ color: "rgba(10,10,10,0.3)" }}>{label}</dt>
                                    <dd className="text-[0.8rem] text-right" style={{ color: "rgba(10,10,10,0.7)" }}>
                                        {href
                                            ? <a href={href} className="transition-colors duration-200" style={{ color: "hsl(var(--hero-accent))" }}>{value}</a>
                                            : value
                                        }
                                    </dd>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — form on video bg */}
                    <div
                        className="relative will-change-[opacity,transform] overflow-hidden rounded-2xl"
                        style={{
                            opacity:    sectionVisible ? 1 : 0,
                            transform:  sectionVisible ? "translateY(0)" : "translateY(1.75rem)",
                            transition: "opacity 700ms ease 180ms, transform 700ms ease 180ms",
                            background: isSuccess ? "transparent" : "#0c0c0c",
                        }}
                    >
                        {!isSuccess && (
                            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                                <video autoPlay muted loop playsInline className="w-full h-full object-cover" style={{ filter: "saturate(1.08) brightness(0.65)" }}>
                                    <source src="/video/lights.mp4" type="video/mp4" />
                                </video>
                                <div className="absolute inset-0" style={{ background: "rgba(5,3,3,0.68)" }} />
                            </div>
                        )}
                        <div className="relative z-10 p-7 md:p-10">
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
