import { motion, useReducedMotion } from "framer-motion";
import {ContentPanelProps} from "@/components/sections/Contact/contact.types";


const L = {
    label:       "rgba(10,10,10,0.22)",
    labelMid:    "rgba(10,10,10,0.38)",
    body:        "rgba(10,10,10,0.45)",
    heading:     "rgba(10,10,10,0.9)",
    border:      "rgba(10,10,10,0.08)",
    borderSub:   "rgba(10,10,10,0.06)",
    accent:      "hsl(var(--hero-accent))",
    accentBorder:"hsla(var(--hero-accent) / 0.35)",
};

export function ContentPanel({ service, index, total, isActive, isPrev }: ContentPanelProps) {
    const prefersReducedMotion = useReducedMotion();
    const state = isActive ? "active" : isPrev ? "prev" : "next";
    const d = (n: number) => (isActive ? n : 0);

    const wrapVariants = {
        active: { opacity: 1, y: 0,   filter: "blur(0px)" },
        prev:   { opacity: 0, y: prefersReducedMotion ? 0 : -32, filter: prefersReducedMotion ? "blur(0px)" : "blur(3px)" },
        next:   { opacity: 0, y: prefersReducedMotion ? 0 :  48, filter: prefersReducedMotion ? "blur(0px)" : "blur(3px)" },
    };

    return (
        <motion.div
            className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20"
            initial={false}
            animate={state}
            variants={wrapVariants}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ pointerEvents: isActive ? "auto" : "none" }}
            aria-hidden={!isActive}
        >
            {/* Section label */}
            <motion.div className="flex items-center gap-3 mb-10" animate={{ opacity: isActive ? 1 : 0 }} transition={{ duration: 0.4, delay: d(0.08) }}>
                <span className="font-mono text-[0.62rem] tracking-[0.25em] uppercase select-none" style={{ color: L.label }}>002</span>
                <span className="h-px w-7 shrink-0" style={{ background: L.border }} aria-hidden="true" />
                <span className="text-[0.62rem] tracking-[0.2em] uppercase" style={{ color: L.label }}>Services</span>
                <span className="ml-auto font-mono text-[0.58rem] tracking-[0.2em] tabular-nums" style={{ color: L.label }}>
                    {String(index + 1).padStart(2, "0")}&thinsp;/&thinsp;{String(total).padStart(2, "0")}
                </span>
            </motion.div>

            {/* Tag */}
            {service.tag && (
                <motion.span
                    className="self-start text-[0.62rem] tracking-[0.2em] uppercase border rounded-full px-3 py-1.5 mb-5"
                    style={{ color: L.accent, borderColor: L.accentBorder }}
                    animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
                    transition={{ duration: 0.4, delay: d(0.12) }}
                >
                    {service.tag}
                </motion.span>
            )}

            {/* Title */}
            <div className="overflow-hidden mb-5">
                <motion.h3
                    className="font-serif font-normal leading-[1.04] tracking-[-0.03em]"
                    style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", color: L.heading }}
                    animate={{ y: isActive ? 0 : isPrev ? "-106%" : "106%", opacity: isActive ? 1 : 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.62, delay: d(0.06), ease: [0.16, 1, 0.3, 1] }}
                >
                    {service.title}
                </motion.h3>
            </div>

            {/* Description */}
            {service.description && (
                <motion.p
                    className="mb-7 text-[0.88rem] leading-[1.8] max-w-[46ch]"
                    style={{ color: L.body }}
                    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 18 }}
                    transition={{ duration: 0.5, delay: d(0.2), ease: [0.16, 1, 0.3, 1] }}
                >
                    {service.description}
                </motion.p>
            )}

            {/* Bullets */}
            {service.bullets && service.bullets.length > 0 && (
                <motion.dl
                    className="flex flex-col border-t mb-8 max-w-[42ch]"
                    style={{ borderColor: L.border }}
                    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 14 }}
                    transition={{ duration: 0.5, delay: d(0.26), ease: [0.16, 1, 0.3, 1] }}
                >
                    {service.bullets.map((bullet, i) => (
                        <motion.div
                            key={bullet}
                            className="flex items-center justify-between gap-6 py-2.5 border-b"
                            style={{ borderColor: L.borderSub }}
                            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -8 }}
                            transition={{ duration: 0.32, delay: d(0.3 + i * 0.04) }}
                        >
                            <dt className="text-[0.65rem] tracking-[0.16em] uppercase" style={{ color: L.labelMid }}>{bullet}</dt>
                            <dd style={{ color: L.accent, fontSize: "0.55rem" }} aria-hidden="true">✦</dd>
                        </motion.div>
                    ))}
                </motion.dl>
            )}

            {/* Price + Duration */}
            <motion.div
                className="flex items-center gap-5 flex-wrap"
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                transition={{ duration: 0.4, delay: d(0.38), ease: [0.16, 1, 0.3, 1] }}
            >
                {service.price && (
                    <span className="text-[0.8rem]" style={{ color: L.body }}>
                        From <strong className="font-medium" style={{ color: L.heading }}>{service.price}</strong>
                    </span>
                )}
                {service.duration && (
                    <span className="text-[0.65rem] tracking-[0.12em] uppercase border rounded-full px-3 py-1.5" style={{ color: L.labelMid, borderColor: L.border }}>
                        {service.duration}
                    </span>
                )}
            </motion.div>
        </motion.div>
    );
}
