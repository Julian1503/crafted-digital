"use client";

import {TECH} from "@/lib/constants";
import Image from "next/image";
import RevealSection from "@/components/ui/RevealSection";

function IconItem({ name, icon }: { name: string; icon: string }) {
    return (
        <div className="flex items-center justify-center">
            <div
                className="
          relative
          h-12 w-24 md:h-14 md:w-28
          rounded-2xl
          border border-primary-foreground/30
          bg-primary-foreground/10
          px-3
          flex items-center justify-center
          backdrop-blur
          transition
          duration-200
          ease-out
          will-change-transform
          hover:z-10
          hover:bg-primary-foreground/20
          hover:border-primary-foreground/40
          hover:ring-1 hover:ring-primary-foreground/15
          hover:shadow-lg hover:shadow-black/20
          hover:scale-[1.03]
        "
                title={name}
            >
                <Image
                    src={icon}
                    alt={name}
                    loading="lazy"
                    draggable={false}
                    width={200}
                    height={200}
                    className="object-contain h-7 md:h-8 w-auto opacity-90 transition-opacity duration-200 hover:opacity-100"
                />
            </div>
        </div>
    );
}


export default function TechStack() {
    return (
        <RevealSection
            delay={100}
            variant="scale"
            className="relative overflow-hidden bg-primary py-16 border-y border-primary-foreground/10">
            {/* subtle glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,hsl(var(--secondary)/0.18),transparent_60%)]" aria-hidden="true" />

            <div className="relative container mx-auto px-4 md:px-6">
                {/* Title */}
                <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-xs font-medium uppercase tracking-wider text-primary-foreground/60">
                            Tech I ship with
                        </h2>
                        <p className="mt-2 text-sm md:text-base text-primary-foreground/80 leading-relaxed max-w-xl">
                            Modern web stack for shipping fast with performance, scalability, and clean architecture.
                        </p>
                    </div>

                    {/* Fixed names (chips) */}
                    <div className="mt-4 md:mt-0 flex flex-wrap gap-2" role="list" aria-label="Technologies">
                        {TECH.map((t) => (
                            <span
                                key={t.name}
                                role="listitem"
                                className="rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-1 text-xs font-medium text-primary-foreground/80"
                            >
                {t.name}
              </span>
                        ))}
                    </div>
                </div>

                {/* Moving icons carousel - decorative, main content is in chips above */}
                <div className="mt-8 relative" aria-hidden="true">
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r from-primary to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-primary to-transparent" />
                    <div className="overflow-hidden py-2 group">
                        <div className="flex gap-3 md:gap-4 w-max animate-techscroll group-hover:paused"
                            style={{ ["--techscroll-duration" as string]: "26s" }}
                        >
                            {[...TECH, ...TECH].map((t, idx) => (
                                <IconItem key={`${t.name}-${idx}`} name={t.name} icon={t.icon} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </RevealSection>
    );
}
