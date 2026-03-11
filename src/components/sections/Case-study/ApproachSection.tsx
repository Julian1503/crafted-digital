import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { StudyData } from "@/components/sections/Case-study/case-study.types";
import { ChapterLabel } from "@/components/sections/Case-study/ChapterLabel";
import { C } from "@/components/sections/Case-study/case-study.constants";

const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
    hidden:  { opacity: 0, x: 14 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

interface ApproachSectionProps {
    study: StudyData;
    image?: string;
}

export function ApproachSection({ study, image }: ApproachSectionProps) {
    const ref      = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section
            ref={ref}
            className="mt-24 md:mt-36 px-5 sm:px-8 md:px-14 lg:px-20 max-w-7xl mx-auto border-t"
            style={{ borderColor: C.border, paddingTop: "4rem" }}
        >
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
            >
                <ChapterLabel index="II" label="The Approach" />
            </motion.div>

            <div className={`grid gap-12 md:gap-20 ${image ? "md:grid-cols-[1fr_360px]" : ""} items-start`}>

                {/* Staggered list */}
                <motion.ol
                    variants={listVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {study.approach.map((item, i) => (
                        <motion.li
                            key={i}
                            variants={itemVariants}
                            className="flex items-start gap-6 py-7 border-b"
                            style={{ borderColor: C.border }}
                        >
                            <span
                                className="shrink-0 font-serif italic leading-none select-none"
                                aria-hidden="true"
                                style={{
                                    fontSize: "clamp(2rem, 4vw, 3.2rem)",
                                    color: "rgba(255,255,255,0.06)",
                                    letterSpacing: "-0.04em",
                                    marginTop: "-0.05em",
                                }}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <p className="flex-1 text-[0.9rem] leading-[1.85] pt-1"
                                style={{ color: "rgba(255,255,255,0.58)", maxWidth: "60ch" }}>
                                {item}
                            </p>
                        </motion.li>
                    ))}
                </motion.ol>

                {/* Clip-reveal image — sticky while list scrolls */}
                {image && (
                    <motion.div
                        className="relative overflow-hidden rounded-sm md:sticky md:top-24"
                        style={{ aspectRatio: "3/4", border: `1px solid ${C.border}` }}
                        initial={{ clipPath: "inset(0 100% 0 0)" }}
                        animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <Image src={image} alt="" fill sizes="360px" className="object-cover"
                            style={{ filter: "brightness(0.85) saturate(0.75)" }} />
                    </motion.div>
                )}
            </div>
        </section>
    );
}
