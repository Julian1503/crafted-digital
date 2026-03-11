import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { StudyData } from "@/components/sections/Case-study/case-study.types";
import { ChapterLabel } from "@/components/sections/Case-study/ChapterLabel";
import { C } from "@/components/sections/Case-study/case-study.constants";

const stackVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.055, delayChildren: 0.2 } },
};

const stackItemVariants = {
    hidden:  { opacity: 0, x: 14 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

interface SolutionSectionProps {
    study: StudyData;
    image?: string;
}

export function SolutionSection({ study, image }: SolutionSectionProps) {
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
                <ChapterLabel index="III" label="The Solution" />
            </motion.div>

            {/* Two-column: text + staggered stack */}
            <div className="grid md:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-12 md:gap-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p className="font-serif italic leading-[1.45] tracking-[-0.02em]"
                        style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)", color: "rgba(255,255,255,0.72)", maxWidth: "44ch" }}>
                        {study.solution}
                    </p>
                </motion.div>

                {/* Staggered tech stack */}
                <div>
                    <motion.p
                        className="font-mono text-[0.52rem] tracking-[0.28em] uppercase mb-5"
                        style={{ color: C.label }}
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Stack
                    </motion.p>
                    <motion.ul
                        variants={stackVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        {study.technologies.map((tech) => (
                            <motion.li
                                key={tech}
                                variants={stackItemVariants}
                                className="flex items-center gap-3 py-2.5 border-b"
                                style={{ borderColor: "rgba(255,255,255,0.05)" }}
                            >
                                <span className="font-mono text-[0.48rem]" style={{ color: C.accent }}>
                                    —
                                </span>
                                <span className="font-mono text-[0.72rem] tracking-[0.06em]"
                                    style={{ color: "rgba(255,255,255,0.6)" }}>
                                    {tech}
                                </span>
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
            </div>

            {/* Clip-reveal full-width image */}
            {image && (
                <motion.div
                    className="mt-14 md:mt-20 relative overflow-hidden rounded-sm"
                    style={{ aspectRatio: "16/7", border: `1px solid ${C.border}` }}
                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                    animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
                    transition={{ duration: 1.0, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
                >
                    <Image src={image} alt="The solution" fill sizes="100vw" className="object-cover object-top"
                        style={{ filter: "brightness(0.9) saturate(0.85)" }} />
                </motion.div>
            )}
        </section>
    );
}
