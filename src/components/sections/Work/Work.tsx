"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Project } from "@/components/sections/Work/work.types";

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);
    return reduced;
}

function useInView<T extends Element>(threshold = 0.1): [React.RefObject<T | null>, boolean] {
    const ref = useRef<T>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setVisible(true);
                    io.disconnect();
                }
            },
            { threshold }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [threshold]);
    return [ref, visible];
}

// ─── FadeUp ───────────────────────────────────────────────────────────────────

interface FadeUpProps {
    children: React.ReactNode;
    delay?: number;
    visible: boolean;
    className?: string;
}

function FadeUp({ children, delay = 0, visible, className }: FadeUpProps) {
    return (
        <div
            className={cn("will-change-[transform,opacity]", className)}
            style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? "translateY(0)" : "translateY(1.75rem)",
                transition: `opacity 700ms ease ${delay}ms, transform 700ms ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

// ─── MetaRow ─────────────────────────────────────────────────────────────────

function MetaRow({
                     label,
                     value,
                     topBorder,
                 }: {
    label: string;
    value: string;
    topBorder?: boolean;
}) {
    return (
        <div
            className={cn(
                "flex items-start justify-between gap-4 py-2.5 md:py-3",
                topBorder && "border-t border-white/10"
            )}
        >
            <dt className="shrink-0 text-[0.65rem] md:text-[0.68rem] tracking-widest text-white/35 uppercase">
                {label}
            </dt>
            <dd className="text-[0.75rem] md:text-[0.78rem] text-white text-right leading-snug">{value}</dd>
        </div>
    );
}

// ─── Counter ─────────────────────────────────────────────────────────────────

interface CounterProps {
    target: number;
    prefix?: string;
    suffix?: string;
    active: boolean;
    reduced: boolean;
}

function Counter({ target, prefix = "", suffix = "", active, reduced }: CounterProps) {
    const [count, setCount] = useState(reduced ? target : 0);

    useEffect(() => {
        if (!active || reduced) {
            setCount(target);
            return;
        }
        const DURATION = 1400;
        const startTime = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const t    = Math.min((now - startTime) / DURATION, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            setCount(Math.round(ease * target));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [active, reduced, target]);

    return <>{prefix}{count}{suffix}</>;
}

// ─── Secondary Preview ───────────────────────────────────────────────────────

function SecondaryPreview({
                              project,
                              reduced,
                          }: {
    project?: Project;
    reduced: boolean;
}) {
    if (!project?.image) {
        return (
            <div className="relative h-full min-h-[30rem] w-full bg-white/[0.03] border-l border-white/10" />
        );
    }

    return (
        <div className="relative h-full min-h-[30rem] w-full overflow-hidden border-l border-white/10 bg-white/[0.03]">
            <div
                key={project.slug ?? project.title}
                className="absolute inset-0 will-change-[transform,opacity,filter]"
                style={{
                    animation: reduced
                        ? undefined
                        : "fadeIn 650ms ease, zoomIn 1100ms cubic-bezier(0.16,1,0.3,1)",
                }}
            >
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1280px) 0px, 28vw"
                    className="object-cover"
                    priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="mb-3 flex items-center gap-3">
                        {project.testimonial?.avatar ? (
                            <Image
                                src={project.testimonial.avatar}
                                alt={project.testimonial.author}
                                width={30}
                                height={30}
                                className="h-7 w-7 rounded-full object-cover"
                            />
                        ) : (
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[0.55rem] font-semibold text-white/70 uppercase">
                                {project.testimonial?.author
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2) ?? "CS"}
                            </span>
                        )}
                        <span className="text-[0.68rem] uppercase tracking-[0.14em] text-white/65">
                            {project.industry ?? project.category ?? "Case Study"}
                        </span>
                    </div>
                    <h3 className="font-serif text-[1.55rem] leading-[1.02] tracking-[-0.03em] text-white">
                        {project.title}
                    </h3>
                    {project.testimonial?.quote && (
                        <p className="mt-4 max-w-md text-[0.82rem] leading-[1.55] text-white/75">
                            "{project.testimonial.quote}"
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Secondary Row ───────────────────────────────────────────────────────────

function SecondaryCaseRow({
                              year,
                              title,
                              category,
                              href,
                              active,
                              onHover,
                          }: {
    year?: string | number;
    title: string;
    category?: string;
    href: string;
    active: boolean;
    onHover: () => void;
}) {
    const chars = title.split("").map((c) => (c === " " ? "\u00A0" : c));

    const MAX_STAGGER_MS = 260;
    const charDelay = (i: number) =>
        Math.min((i / Math.max(chars.length - 1, 1)) * MAX_STAGGER_MS, MAX_STAGGER_MS);

    return (
        <li
            className="relative border-b border-white/[0.07] last:border-b-0"
            onMouseEnter={onHover}
            onFocus={onHover}
        >
            {/* Hover fill */}
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                    background:      "rgba(255,255,255,0.03)",
                    transform:       active ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left center",
                    transition:      "transform 560ms cubic-bezier(0.16,1,0.3,1)",
                }}
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:      "linear-gradient(90deg, transparent 58%, rgba(255,255,255,0.05) 100%)",
                    transform:       active ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left center",
                    transition:      "transform 680ms cubic-bezier(0.16,1,0.3,1) 40ms",
                }}
            />

            <Link
                href={href}
                className="relative flex items-center gap-3 md:gap-6 py-4 px-4 sm:px-8 md:px-20 min-h-[4.5rem] md:min-h-[5.25rem]"
            >
                {/* Year — visible sm+ */}
                <time
                    dateTime={year ? String(year) : undefined}
                    className="hidden sm:block shrink-0 font-mono text-[0.65rem] w-10 transition-colors duration-300"
                    style={{ color: active ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.28)" }}
                >
                    {year}
                </time>

                {/* Title */}
                <span
                    className="flex-1 min-w-0 overflow-hidden text-[0.88rem] md:text-[0.95rem] font-medium tracking-tight leading-none"
                    aria-label={title}
                >
                    {chars.map((char, i) => (
                        <span
                            key={i}
                            aria-hidden="true"
                            style={{
                                display:    "inline-block",
                                color:      active ? "#ffffff" : "rgba(255,255,255,0.68)",
                                transform:  active ? "translateY(0) skewX(0deg)" : "translateY(0.4em) skewX(-4deg)",
                                opacity:    active ? 1 : 0.7,
                                transition: `transform 440ms cubic-bezier(0.16,1,0.3,1) ${charDelay(i)}ms,
                                             opacity 380ms ease ${charDelay(i)}ms,
                                             color 300ms ease 0ms`,
                                willChange: "transform, opacity",
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </span>

                {/* Category — lg+ */}
                <span
                    className="hidden lg:block shrink-0 text-[0.72rem] uppercase tracking-[0.12em] transition-colors duration-300"
                    style={{ color: active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.32)" }}
                >
                    {category}
                </span>

                {/* Mobile: category pill */}
                <span
                    className="lg:hidden shrink-0 text-[0.6rem] uppercase tracking-[0.1em] border border-white/10 rounded-full px-2 py-0.5 transition-colors duration-300"
                    style={{ color: active ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.28)" }}
                >
                    {category}
                </span>

                {/* Arrow */}
                <span
                    className="shrink-0 inline-flex h-[1.4rem] w-[1.4rem] md:h-[1.55rem] md:w-[1.55rem] items-center justify-center rounded-full border border-white/20 text-[0.6rem] md:text-[0.65rem]"
                    aria-hidden="true"
                    style={{
                        opacity:    active ? 1 : 0,
                        color:      "#ffffff",
                        transform:  active ? "translate(0,0)" : "translate(-5px,5px)",
                        transition: "opacity 220ms ease, transform 220ms ease",
                    }}
                >
                    ↗
                </span>
            </Link>
        </li>
    );
}

// ─── Work ─────────────────────────────────────────────────────────────────────

interface WorkProps {
    projects: Project[];
}

export function Work({ projects }: WorkProps) {
    const reduced = useReducedMotion();
    const [sectionRef, sectionVisible] = useInView<HTMLElement>(0.08);
    const [statsRef,   statsVisible]   = useInView<HTMLDivElement>(0.5);

    if (!projects.length) return null;

    const [featured, ...secondary] = projects;
    const featuredCompany = featured.company;
    const featuredHref    = featured.href ?? `/case-studies/${featured.slug}`;

    const [activeSecondarySlug, setActiveSecondarySlug] = useState<string | null>(
        secondary[0]?.slug ?? null
    );

    useEffect(() => {
        if (!activeSecondarySlug && secondary[0]?.slug) {
            setActiveSecondarySlug(secondary[0].slug);
        }
    }, [activeSecondarySlug, secondary]);

    const activeSecondary = useMemo(() => {
        if (!secondary.length) return undefined;
        return secondary.find((p) => p.slug === activeSecondarySlug) ?? secondary[0];
    }, [activeSecondarySlug, secondary]);

    return (
        <section
            ref={sectionRef}
            id="work"
            className="py-16 md:py-24 bg-[#0c0c0c] text-white overflow-hidden"
            aria-labelledby="work-heading"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-16 md:mb-30">

                {/* ── Section label ─────────────────────────────────────────── */}
                <FadeUp visible={sectionVisible} delay={0} className="flex items-center gap-3 mb-8 md:mb-10">
                    <span className="font-mono text-[0.62rem] tracking-[0.25em] text-white/24 uppercase select-none">
                        001
                    </span>
                    <span className="h-px w-7 bg-white/16 shrink-0" aria-hidden="true" />
                    <span className="text-[0.62rem] tracking-[0.2em] text-white/24 uppercase">
                        Success Story
                    </span>
                </FadeUp>

                <FadeUp visible={sectionVisible} delay={800} className="mb-10 md:mb-14">
                    <h2
                        id="work-heading"
                        className="font-serif text-[clamp(2rem,4.5vw,3.75rem)] font-normal leading-[1.06] tracking-[-0.025em]"
                    >
                        Case study
                    </h2>
                </FadeUp>

                {/* ── Featured project ──────────────────────────────────────── */}
                <FadeUp visible={sectionVisible} delay={180}>
                    <article
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-20 mb-12 md:mb-16"
                        aria-label={`Featured: ${featured.title}`}
                    >
                        {/* Image — taller on mobile for impact */}
                        <div className="relative w-full overflow-hidden rounded-xl md:rounded-2xl bg-white/5"
                             style={{ aspectRatio: "3/4" }}
                        >
                            {featured.image && (
                                <Image
                                    src={featured.image}
                                    alt={featured.title}
                                    fill
                                    priority
                                    sizes="(max-width:1024px) 100vw, 50vw"
                                    className="object-cover"
                                    style={{
                                        transform:  sectionVisible ? "scale(1)" : "scale(1.07)",
                                        transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1) 300ms",
                                    }}
                                />
                            )}
                            {/* Mobile overlay with title */}
                            <div className="lg:hidden absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                            {featured.industry && (
                                <div className="lg:hidden absolute bottom-4 left-4">
                                    <span className="text-[0.6rem] uppercase tracking-[0.15em] text-white/60 border border-white/20 rounded-full px-2.5 py-1">
                                        {featured.industry}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-5 md:gap-7 pt-0 md:pt-2">
                            <div className="flex items-center justify-between">
                                {featuredCompany?.logo ? (
                                    <Image
                                        src={featuredCompany.logo}
                                        alt={`${featuredCompany.name} logo`}
                                        width={120}
                                        height={40}
                                        className="h-6 md:h-7 w-auto object-contain invert"
                                    />
                                ) : (
                                    <span className="font-serif text-lg md:text-xl font-normal tracking-tight">
                                        {featured.title}
                                    </span>
                                )}
                                {featured.year && (
                                    <time
                                        dateTime={String(featured.year)}
                                        className="text-[0.72rem] text-white/35"
                                    >
                                        {featured.year}
                                    </time>
                                )}
                            </div>

                            <dl className="border-t border-white/10">
                                {featured.industry   && <MetaRow label="Industry"   value={featured.industry} />}
                                {featured.tools      && <MetaRow label="Tools"      value={featured.tools} />}
                                {featured.challenge  && <MetaRow label="Challenge"  value={featured.challenge} topBorder />}
                                {featured.solution   && <MetaRow label="Solution"   value={featured.solution} />}
                            </dl>

                            <div>
                                <Link
                                    href={featuredHref}
                                    className={cn(
                                        "inline-flex items-center gap-2 text-[0.75rem] md:text-[0.78rem] font-medium tracking-wide",
                                        "border border-white/18 rounded-full px-4 md:px-5 py-2 md:py-2.5",
                                        "hover:bg-white/8 transition-colors duration-200"
                                    )}
                                >
                                    Read Full Story
                                    <span className="text-[0.8rem]" aria-hidden="true">↗</span>
                                </Link>
                            </div>

                            {/* Stats */}
                            {!!featured.stats?.length && (
                                <div
                                    ref={statsRef}
                                    className="grid grid-cols-2 sm:flex sm:flex-wrap gap-6 md:gap-10 border-t border-white/10 pt-4 md:pt-5"
                                    aria-label="Project results"
                                >
                                    {featured.stats.map((stat) => (
                                        <div key={stat.label}>
                                            <p className="font-serif text-[1.9rem] md:text-[2.2rem] font-normal tracking-[-0.035em] leading-none text-white">
                                                <Counter
                                                    target={stat.numericValue}
                                                    prefix={stat.prefix}
                                                    suffix={stat.suffix}
                                                    active={statsVisible}
                                                    reduced={reduced}
                                                />
                                            </p>
                                            <p className="mt-1.5 text-[0.68rem] md:text-[0.7rem] text-white/38">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Testimonial */}
                            {featured.testimonial && (
                                <blockquote className="flex flex-col gap-3 md:gap-4 border-t border-white/10 pt-4 md:pt-5">
                                    <p className="text-[0.8rem] md:text-[0.82rem] leading-[1.75] md:leading-[1.78] text-white/50 italic">
                                        &ldquo;{featured.testimonial.quote}&rdquo;
                                    </p>
                                    <footer className="flex items-center gap-3">
                                        {featured.testimonial.avatar ? (
                                            <Image
                                                src={featured.testimonial.avatar}
                                                alt={featured.testimonial.author}
                                                width={36}
                                                height={36}
                                                className="h-8 w-8 md:h-9 md:w-9 rounded-full object-cover shrink-0"
                                            />
                                        ) : (
                                            <span className="inline-flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[0.58rem] font-semibold text-white/50 uppercase tracking-wider">
                                                {featured.testimonial.author.split(" ").map((n) => n[0]).join("")}
                                            </span>
                                        )}
                                        <div>
                                            <p className="text-[0.75rem] md:text-[0.78rem] font-medium text-white">
                                                {featured.testimonial.author}
                                            </p>
                                            <p className="text-[0.68rem] md:text-[0.7rem] text-white/38">
                                                {featured.testimonial.role}
                                            </p>
                                        </div>
                                    </footer>
                                </blockquote>
                            )}
                        </div>
                    </article>
                </FadeUp>

                {/* ── Secondary projects ────────────────────────────────────── */}
                {secondary.length > 0 && (
                    <FadeUp visible={sectionVisible} delay={320}>
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-[0.72rem] text-white/32">
                                <span className="text-white font-medium">{secondary.length}</span> More Cases
                            </p>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_22rem] 2xl:grid-cols-[minmax(0,1fr)_26rem] gap-0 items-stretch">
                            {/* Rows */}
                            <div className="min-w-0 border border-white/[0.07] rounded-xl md:rounded-none md:border-0">
                                <ul>
                                    {secondary.map((project) => {
                                        const slug   = project.slug ?? project.title;
                                        const active = activeSecondarySlug === project.slug;
                                        return (
                                            <SecondaryCaseRow
                                                key={slug}
                                                year={project.year}
                                                title={project.title}
                                                category={project.industry ?? project.category}
                                                href={project.href ?? `/case-studies/${project.slug}`}
                                                active={active}
                                                onHover={() => {
                                                    if (project.slug) setActiveSecondarySlug(project.slug);
                                                }}
                                            />
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Preview panel — desktop only */}
                            <div className="relative hidden xl:block">
                                <SecondaryPreview project={activeSecondary} reduced={reduced} />
                            </div>

                            {/* See all link */}
                            <div className="flex justify-start items-center mt-4 md:mt-6 col-span-full xl:col-span-2">
                                <Link
                                    href="/case-studies"
                                    className="group flex items-center gap-2 rounded-full no-underline whitespace-nowrap"
                                    style={{
                                        border:        "1px solid hsl(var(--primary-foreground) / 0.15)",
                                        background:    "hsl(var(--primary-foreground) / 0.04)",
                                        color:         "hsl(var(--primary-foreground) / 0.8)",
                                        padding:       "0.5rem 1.2rem",
                                        fontSize:      "0.78rem",
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        fontWeight:    500,
                                        transition:    "background 0.25s, border-color 0.25s, color 0.25s, transform 0.25s",
                                    }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget as HTMLAnchorElement;
                                        el.style.background   = "hsl(var(--hero-accent))";
                                        el.style.borderColor  = "hsl(var(--hero-accent))";
                                        el.style.color        = "hsl(var(--primary-foreground))";
                                        el.style.transform    = "translateY(-1px)";
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget as HTMLAnchorElement;
                                        el.style.background  = "hsl(var(--primary-foreground) / 0.04)";
                                        el.style.borderColor = "hsl(var(--primary-foreground) / 0.15)";
                                        el.style.color       = "hsl(var(--primary-foreground) / 0.8)";
                                        el.style.transform   = "";
                                    }}
                                >
                                    See All Cases →
                                </Link>
                            </div>
                        </div>
                    </FadeUp>
                )}
            </div>
        </section>
    );
}