import { useRef } from "react";
import Image from "next/image";
import { motion, useInView as useFramerInView } from "framer-motion";
import { Testimonial } from "@/components/sections/Case-study/case-study.types";
import {C} from "@/components/sections/Case-study/case-study.constants";

export function TestimonialSection({ testimonial }: { testimonial: Testimonial }) {
    const ref      = useRef<HTMLElement>(null);
    const isInView = useFramerInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            ref={ref}
            className="mt-28 md:mt-40 py-24 md:py-40 px-5 sm:px-8 md:px-14 lg:px-20 overflow-hidden"
            style={{ background: C.bgDark }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Opening quote mark */}
                <motion.div
                    className="font-serif leading-none select-none mb-2"
                    aria-hidden="true"
                    style={{ fontSize: "clamp(5rem, 16vw, 14rem)", color: C.accent, lineHeight: 0.8 }}
                    initial={{ opacity: 0, y: "1.5rem" }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    &ldquo;
                </motion.div>

                <blockquote>
                    <motion.p
                        className="font-serif italic leading-[1.15] tracking-[-0.03em]"
                        style={{ fontSize: "clamp(1.6rem, 4vw, 3.5rem)", color: "rgba(255,255,255,0.92)", maxWidth: "24ch" }}
                        initial={{ opacity: 0, y: "2rem" }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {testimonial.quote}
                    </motion.p>

                    <motion.footer
                        className="mt-10 md:mt-14 flex items-center gap-4"
                        initial={{ opacity: 0, y: "1rem" }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {testimonial.avatar ? (
                            <Image
                                src={testimonial.avatar}
                                alt={testimonial.author}
                                width={44} height={44}
                                className="rounded-full object-cover shrink-0"
                                style={{ filter: "grayscale(0.2)" }}
                            />
                        ) : (
                            <span
                                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-semibold uppercase tracking-wider"
                                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}
                            >
                                {testimonial.author.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </span>
                        )}
                        <div>
                            <p className="text-[0.85rem] font-medium" style={{ color: "rgba(255,255,255,0.88)" }}>
                                {testimonial.author}
                            </p>
                            <p className="text-[0.7rem] mt-0.5" style={{ color: C.dim }}>
                                {testimonial.role}
                            </p>
                        </div>
                    </motion.footer>
                </blockquote>
            </div>
        </section>
    );
}
