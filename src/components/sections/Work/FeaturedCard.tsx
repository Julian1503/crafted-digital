import {Project} from "@/components/sections/Work/work.types";
import {useRef, useState} from "react";
import Link from "next/link";
import {Vec2} from "@/hooks/use-spring-cursor";
import Image from "next/image";

export default function FeaturedCard({ project, visible, reduced }: {
    project: Project;
    visible: boolean;
    reduced: boolean;
}) {
    const cardRef = useRef<HTMLElement>(null);
    const [tilt, setTilt] = useState<Vec2>({ x: 0, y: 0 });
    const rafRef = useRef<number>(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (reduced) return;
        const rect = cardRef.current!.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 → 0.5
        const cy = (e.clientY - rect.top)  / rect.height - 0.5;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            setTilt({ x: cy * -6, y: cx * 6 }); // max ±3 degrees
        });
    };

    const handleMouseLeave = () => {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => setTilt({ x: 0, y: 0 }));
    };

    const href = project.href ?? `/case-studies/${project.slug}`;

    return (
        <article
            ref={cardRef}
            className="relative w-full cursor-pointer"
            style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? "translateY(0)" : "translateY(2rem)",
                transition: "opacity 800ms ease 100ms, transform 800ms cubic-bezier(0.16,1,0.3,1) 100ms",
                perspective: "1200px",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <Link href={href} style={{ display: "block" }}>
                <div
                    style={{
                        transform: reduced
                            ? "none"
                            : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                        transition: "transform 600ms cubic-bezier(0.16,1,0.3,1)",
                        transformStyle: "preserve-3d",
                    }}
                >
                    {/* Image area */}
                    <div
                        className="relative w-full overflow-hidden"
                        style={{ aspectRatio: "16/9" }}
                    >
                        {project.image && (
                            <Image

                                src={project.image}
                                alt={project.title}
                                fill
                                priority
                                sizes="100vw"
                                className="object-cover"
                                style={{
                                    transform:  visible ? "scale(1)" : "scale(1.06)",
                                    transition: "transform 1.6s cubic-bezier(0.16,1,0.3,1) 200ms",
                                    filter: "saturate(0.82) brightness(0.62)",
                                }}
                            />
                        )}
                        {/* Gradient — heavier at bottom so title is always legible */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(to bottom, rgba(12,12,12,0.25) 0%, transparent 35%, rgba(12,12,12,0.7) 75%, #0c0c0c 100%)",
                            }}
                        />

                        {/* Meta — top left */}
                        <div className="absolute top-6 left-6 sm:left-10 flex items-center gap-3">
                            {project.industry && (
                                <span
                                    className="text-[0.58rem] tracking-[0.2em] uppercase border rounded-full px-2.5 py-1"
                                    style={{
                                        color: "rgba(255,255,255,0.55)",
                                        borderColor: "rgba(255,255,255,0.18)",
                                        background: "rgba(0,0,0,0.25)",
                                        backdropFilter: "blur(8px)",
                                    }}
                                >
                                    {project.industry}
                                </span>
                            )}
                            {project.year && (
                                <time
                                    dateTime={String(project.year)}
                                    className="font-mono text-[0.58rem]"
                                    style={{ color: "rgba(255,255,255,0.35)" }}
                                >
                                    {project.year}
                                </time>
                            )}
                        </div>

                        {/* "View Case Study" — top right */}
                        <div
                            className="absolute top-6 right-6 sm:right-10 flex items-center gap-2"
                            style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", letterSpacing: "0.08em" }}
                        >
                            <span className="hidden sm:inline uppercase tracking-[0.15em] text-[0.58rem]">
                                View case study
                            </span>
                            <span
                                className="inline-flex items-center justify-center w-7 h-7 rounded-full"
                                style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}
                            >
                                ↗
                            </span>
                        </div>
                    </div>

                    {/* Title — breaks out of the image, sits on the dark bg */}
                    <div className="pt-6 pb-0 px-0">
                        <h3
                            className="font-serif font-normal md:text-left text-center leading-[0.95] tracking-[-0.04em]"
                            style={{
                                fontSize: "clamp(2.8rem, 5vw, 6.5rem)",
                                color:    "rgba(255,255,255,0.92)",
                                marginTop: "-0.15em", // pulls title UP into image overlap
                            }}
                        >
                            {project.title}
                        </h3>
                    </div>

                    {/* Stats + testimonial strip */}
                    <div
                        className="mt-6 pt-6 flex flex-col md:flex-row md:items-start gap-6 md:gap-16 border-t"
                        style={{ borderColor: "rgba(255,255,255,0.07)" }}
                    >
                        {/* Stats */}
                        {!!project.stats?.length && (
                            <div className="flex gap-8 md:gap-12 shrink-0">
                                {project.stats.map((stat) => (
                                    <div key={stat.label}>
                                        <p
                                            className="font-serif font-normal leading-none tracking-[-0.035em]"
                                            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#fff" }}
                                        >
                                            {stat.prefix}{stat.numericValue}{stat.suffix}
                                        </p>
                                        <p
                                            className="mt-1.5 text-[0.65rem] tracking-[0.1em] uppercase"
                                            style={{ color: "rgba(255,255,255,0.32)" }}
                                        >
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Testimonial */}
                        {project.testimonial && (
                            <blockquote className="flex-1 flex flex-col gap-3">
                                <p
                                    className="text-[0.82rem] leading-[1.75] italic"
                                    style={{ color: "rgba(255,255,255,0.42)", maxWidth: "52ch" }}
                                >
                                    &ldquo;{project.testimonial.quote}&rdquo;
                                </p>
                                <footer className="flex items-center gap-2.5">
                                    {project.testimonial.avatar ? (
                                        <Image
                                            src={project.testimonial.avatar}
                                            alt={project.testimonial.author}
                                            width={28} height={28}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <span
                                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.5rem] font-semibold uppercase"
                                            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                                        >
                                            {project.testimonial.author.split(" ").map(n => n[0]).join("")}
                                        </span>
                                    )}
                                    <div>
                                        <p className="text-[0.72rem] font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
                                            {project.testimonial.author}
                                        </p>
                                        <p className="text-[0.65rem]" style={{ color: "rgba(255,255,255,0.32)" }}>
                                            {project.testimonial.role}
                                        </p>
                                    </div>
                                </footer>
                            </blockquote>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    );
}