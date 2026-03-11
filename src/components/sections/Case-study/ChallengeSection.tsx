import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { StudyData } from "@/components/sections/Case-study/case-study.types";
import { ChapterLabel } from "@/components/sections/Case-study/ChapterLabel";
import { splitChallenge } from "@/components/sections/Case-study/case-study.constants";
import { C } from "@/components/sections/Case-study/case-study.constants";

interface ChallengeSectionProps {
    study: StudyData;
    image?: string;
}

export function ChallengeSection({ study, image }: ChallengeSectionProps) {
    const ref      = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    const [lead, rest] = splitChallenge(study.challenge);

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
                <ChapterLabel index="I" label="The Challenge" />
            </motion.div>

            <div className={`grid gap-10 md:gap-16 items-start ${image ? "md:grid-cols-[1fr_380px]" : ""}`}>
                {/* Text */}
                <div>
                    <motion.h2
                        className="font-serif italic leading-[1.18] tracking-[-0.03em]"
                        style={{ fontSize: "clamp(1.7rem, 3.8vw, 3rem)", color: "rgba(255,255,255,0.92)", maxWidth: "26ch" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {lead}
                    </motion.h2>

                    {rest && (
                        <motion.div
                            className="mt-8"
                            initial={{ opacity: 0, y: 16 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="w-8 h-px mb-6" style={{ background: C.accent }} aria-hidden="true" />
                            <p className="text-[0.92rem] leading-[1.9]"
                                style={{ color: "rgba(255,255,255,0.48)", maxWidth: "58ch" }}>
                                {rest}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Clip-reveal image */}
                {image && (
                    <motion.div
                        className="relative overflow-hidden rounded-sm"
                        style={{ aspectRatio: "3/4", border: `1px solid ${C.border}` }}
                        initial={{ clipPath: "inset(0 100% 0 0)" }}
                        animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
                        transition={{ duration: 0.9, delay: 0.12, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <Image src={image} alt="" fill sizes="380px" className="object-cover"
                            style={{ filter: "brightness(0.85) saturate(0.75)" }} />
                    </motion.div>
                )}
            </div>
        </section>
    );
}
