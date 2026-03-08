/**
 * @fileoverview Contact section — editorial finale layout.
 *
 * Light background. No card wrapping the form.
 * Inputs use a single bottom-border ("underline") style — magazine/studio aesthetic.
 * Left: large serif statement + meta info strip.
 * Right: raw form fields directly on the page.
 * Success state: full-panel serif message, no modal.
 *
 * Intentionally the most typographically generous section on the page,
 * giving it a "grand finale" quality distinct from every other section.
 */
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-sonner";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { formSchema } from "@/components/sections/Contact/contact-data";

// ─── Constants ────────────────────────────────────────────────────────────────

const PROJECT_TOPICS = [
    "New SaaS", "Landing page", "E-commerce",
    "Fix/maintenance", "Performance/SEO", "Integrations", "Other",
];

const BUDGET_OPTIONS = [
    { value: "", label: "Select budget…" },
    { value: "Under $2k",  label: "Under $2k"  },
    { value: "$2k–$5k",   label: "$2k–$5k"   },
    { value: "$5k–$10k",  label: "$5k–$10k"  },
    { value: "$10k+",     label: "$10k+"      },
];

const TIMELINE_OPTIONS = [
    { value: "",           label: "Select timeline…" },
    { value: "ASAP",       label: "ASAP"       },
    { value: "2–4 weeks",  label: "2–4 weeks"  },
    { value: "1–2 months", label: "1–2 months" },
    { value: "Flexible",   label: "Flexible"   },
];

const CONTACT_METHODS = ["Email", "Call"];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView<T extends Element>(threshold = 0.06): [React.RefObject<T | null>, boolean] {
    const ref = React.useRef<T>(null);
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => { if (entry?.isIntersecting) { setVisible(true); io.disconnect(); } },
            { threshold }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [threshold]);
    return [ref, visible];
}

// ─── Underline field wrapper ──────────────────────────────────────────────────

// ─── Form theme context ───────────────────────────────────────────────────────

interface FormColors {
    label:       string;
    optional:    string;
    text:        string;
    placeholder: string;
    border:      string;
    borderFocus: string;
    pillBg:      string;
    pillText:    string;
    pillBorder:  string;
    subtext:     string;
}

const LIGHT_COLORS: FormColors = {
    label:       "rgba(10,10,10,0.38)",
    optional:    "rgba(10,10,10,0.25)",
    text:        "rgba(10,10,10,0.85)",
    placeholder: "rgba(10,10,10,0.22)",
    border:      "rgba(10,10,10,0.15)",
    borderFocus: "rgba(10,10,10,0.70)",
    pillBg:      "rgba(10,10,10,0.88)",
    pillText:    "#fff",
    pillBorder:  "rgba(10,10,10,0.14)",
    subtext:     "rgba(10,10,10,0.28)",
};

const DARK_COLORS: FormColors = {
    label:       "rgba(255,255,255,0.38)",
    optional:    "rgba(255,255,255,0.22)",
    text:        "rgba(255,255,255,0.88)",
    placeholder: "rgba(255,255,255,0.22)",
    border:      "rgba(255,255,255,0.18)",
    borderFocus: "rgba(255,255,255,0.70)",
    pillBg:      "rgba(255,255,255,0.92)",
    pillText:    "#0a0a0a",
    pillBorder:  "rgba(255,255,255,0.18)",
    subtext:     "rgba(255,255,255,0.28)",
};

const FormThemeCtx = React.createContext<FormColors>(LIGHT_COLORS);
const useFormTheme = () => React.useContext(FormThemeCtx);

// ─── Underline field wrapper ──────────────────────────────────────────────────

/**
 * Bare-bones label + underline input — no border box, just a bottom line.
 */
function FieldWrap({
                       label,
                       required,
                       optional,
                       children,
                       error,
                   }: {
    label: string;
    required?: boolean;
    optional?: boolean;
    children: React.ReactNode;
    error?: string;
}) {
    const C = useFormTheme();
    return (
        <div className="group flex flex-col gap-1.5">
            <span
                className="text-[0.65rem] tracking-[0.18em] uppercase transition-colors duration-200"
                style={{ color: error ? "hsl(var(--destructive))" : C.label }}
            >
                {label}
                {required && <span className="ml-1" style={{ color: "hsl(var(--hero-accent))" }} aria-hidden="true">✦</span>}
                {optional && <span className="ml-1 normal-case tracking-normal" style={{ color: C.optional }}>(optional)</span>}
            </span>
            {children}
            {error && (
                <span className="text-[0.7rem]" style={{ color: "hsl(var(--destructive))" }}>{error}</span>
            )}
        </div>
    );
}

// ─── Underline inputs ─────────────────────────────────────────────────────────

const lineInputBaseClass = "w-full bg-transparent outline-none border-0 border-b pb-2 text-[0.92rem] transition-[border-color,color] duration-200";

function LineInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    const C = useFormTheme();
    const [focused, setFocused] = React.useState(false);
    return (
        <input
            {...props}
            className={lineInputBaseClass}
            style={{
                color:           C.text,
                borderColor:     focused ? C.borderFocus : C.border,
                // placeholder via ::placeholder isn't inline — use a data attr workaround
                ...props.style,
            }}
            placeholder={props.placeholder}
            onFocus={e => { setFocused(true); props.onFocus?.(e); }}
            onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        />
    );
}

function LineTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const C = useFormTheme();
    const [focused, setFocused] = React.useState(false);
    return (
        <textarea
            {...props}
            className={[lineInputBaseClass, "resize-none min-h-[80px]"].join(" ")}
            style={{
                color:       C.text,
                borderColor: focused ? C.borderFocus : C.border,
                ...props.style,
            }}
            onFocus={e => { setFocused(true); props.onFocus?.(e); }}
            onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        />
    );
}

function LineSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    const C = useFormTheme();
    const [focused, setFocused] = React.useState(false);
    return (
        <select
            {...props}
            className={[lineInputBaseClass, "cursor-pointer appearance-none pr-6"].join(" ")}
            style={{
                color:       C.text,
                borderColor: focused ? C.borderFocus : C.border,
                ...props.style,
            }}
            onFocus={e => { setFocused(true); props.onFocus?.(e); }}
            onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        />
    );
}

// ─── Success State ────────────────────────────────────────────────────────────

function SuccessState({ onReset }: { onReset: () => void }) {
    return (
        <div className="flex flex-col justify-center min-h-[480px] py-8">
            <span
                className="block font-mono text-[0.62rem] tracking-[0.25em] uppercase mb-8"
                style={{ color: "rgba(10,10,10,0.22)" }}
            >
                Message sent ✦
            </span>
            <p
                className="font-serif font-normal leading-[1.05] tracking-[-0.025em] mb-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "rgba(10,10,10,0.88)" }}
            >
                Thanks for reaching out — I'll be in touch within 24 hours.
            </p>
            <p className="text-[0.85rem] leading-relaxed mb-10" style={{ color: "rgba(10,10,10,0.42)" }}>
                In the meantime, feel free to browse the case studies or connect on LinkedIn.
            </p>
            <button
                type="button"
                onClick={onReset}
                className="self-start text-[0.72rem] tracking-[0.1em] uppercase border-b pb-0.5 transition-colors duration-200"
                style={{ color: "rgba(10,10,10,0.38)", borderColor: "rgba(10,10,10,0.15)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(10,10,10,0.8)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(10,10,10,0.38)"; }}
            >
                Send another message →
            </button>
        </div>
    );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

function ContactForm({
                         onSuccess,
                         dark = false,
                     }: {
    onSuccess: () => void;
    dark?: boolean;
}) {
    const C = dark ? DARK_COLORS : LIGHT_COLORS;
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "", email: "", message: "", topics: [],
            budget: "", timeline: "", company: "", website: "",
            hp: "", contactMethod: undefined,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            if (!res.ok) console.error("Contact form error:", await res.text());
            onSuccess();
            toast({ title: "Message sent!", description: "I'll get back to you within 24 hours." });
            form.reset();
        } catch {
            toast({ title: "Something went wrong", description: "Please try again or email me directly." });
        } finally {
            setIsSubmitting(false);
        }
    }

    const e = form.formState.errors;

    return (
        <FormThemeCtx.Provider value={C}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-7">

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FieldWrap label="Name" required error={e.name?.message}>
                                    <FormControl>
                                        <LineInput placeholder="John Doe" autoComplete="name" required {...field} />
                                    </FormControl>
                                </FieldWrap>
                                <FormMessage className="hidden" />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FieldWrap label="Email" required error={e.email?.message}>
                                    <FormControl>
                                        <LineInput placeholder="john@example.com" type="email" autoComplete="email" required {...field} />
                                    </FormControl>
                                </FieldWrap>
                                <FormMessage className="hidden" />
                            </FormItem>
                        )} />
                    </div>

                    {/* Company + Website */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                        <FormField control={form.control} name="company" render={({ field }) => (
                            <FormItem>
                                <FieldWrap label="Company" optional>
                                    <FormControl>
                                        <LineInput placeholder="Acme Pty Ltd" autoComplete="organization" {...field} />
                                    </FormControl>
                                </FieldWrap>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="website" render={({ field }) => (
                            <FormItem>
                                <FieldWrap label="Website" optional>
                                    <FormControl>
                                        <LineInput placeholder="https://…" type="url" autoComplete="url" {...field} />
                                    </FormControl>
                                </FieldWrap>
                            </FormItem>
                        )} />
                    </div>

                    {/* Topics */}
                    <FormField control={form.control} name="topics" render={({ field }) => (
                        <FormItem>
                            <FieldWrap label="What do you want to talk about?">
                                <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Project topics">
                                    {PROJECT_TOPICS.map((t) => {
                                        const checked = field.value?.includes(t);
                                        return (
                                            <button
                                                key={t}
                                                type="button"
                                                role="checkbox"
                                                aria-checked={checked}
                                                onClick={() => {
                                                    const next = checked
                                                        ? (field.value ?? []).filter((x: string) => x !== t)
                                                        : [...(field.value ?? []), t];
                                                    field.onChange(next);
                                                }}
                                                className="text-[0.7rem] tracking-[0.08em] rounded-full px-3 py-1.5 border transition-all duration-200"
                                                style={{
                                                    background:  checked ? C.pillBg : "transparent",
                                                    color:       checked ? C.pillText : C.label,
                                                    borderColor: checked ? "transparent" : C.pillBorder,
                                                }}
                                            >
                                                {t}
                                            </button>
                                        );
                                    })}
                                </div>
                            </FieldWrap>
                        </FormItem>
                    )} />

                    {/* Budget + Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                        <FormField control={form.control} name="budget" render={({ field }) => (
                            <FormItem>
                                <FieldWrap label="Budget">
                                    <FormControl>
                                        <LineSelect value={field.value ?? ""} onChange={field.onChange}>
                                            {BUDGET_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </LineSelect>
                                    </FormControl>
                                </FieldWrap>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="timeline" render={({ field }) => (
                            <FormItem>
                                <FieldWrap label="Timeline">
                                    <FormControl>
                                        <LineSelect value={field.value ?? ""} onChange={field.onChange}>
                                            {TIMELINE_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </LineSelect>
                                    </FormControl>
                                </FieldWrap>
                            </FormItem>
                        )} />
                    </div>

                    {/* Preferred contact */}
                    <FormField control={form.control} name="contactMethod" render={({ field }) => (
                        <FormItem>
                            <FieldWrap label="Preferred contact">
                                <div className="flex gap-3 pt-1" role="radiogroup" aria-label="Preferred contact method">
                                    {CONTACT_METHODS.map((method, index) => {
                                        const selected = field.value === method;
                                        const tabbable = selected || (index === 0 && !CONTACT_METHODS.includes(field.value ?? ""));
                                        return (
                                            <button
                                                key={method}
                                                type="button"
                                                role="radio"
                                                aria-checked={selected}
                                                tabIndex={tabbable ? 0 : -1}
                                                onClick={() => field.onChange(method)}
                                                onKeyDown={(ev) => {
                                                    if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") {
                                                        ev.preventDefault();
                                                        const cur = CONTACT_METHODS.indexOf(field.value ?? "");
                                                        const next = ev.key === "ArrowRight"
                                                            ? (cur < CONTACT_METHODS.length - 1 ? cur + 1 : 0)
                                                            : (cur > 0 ? cur - 1 : CONTACT_METHODS.length - 1);
                                                        field.onChange(CONTACT_METHODS[next]);
                                                        (ev.currentTarget.parentElement?.querySelectorAll("button")[next] as HTMLElement)?.focus();
                                                    }
                                                }}
                                                className="text-[0.72rem] tracking-[0.08em] rounded-full px-4 py-1.5 border transition-all duration-200"
                                                style={{
                                                    background:  selected ? C.pillBg : "transparent",
                                                    color:       selected ? C.pillText : C.label,
                                                    borderColor: selected ? "transparent" : C.pillBorder,
                                                }}
                                            >
                                                {method}
                                            </button>
                                        );
                                    })}
                                </div>
                            </FieldWrap>
                        </FormItem>
                    )} />

                    {/* Message */}
                    <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem>
                            <FieldWrap label="Message" required error={e.message?.message}>
                                <FormControl>
                                    <LineTextarea placeholder="Tell me about your project…" required {...field} />
                                </FormControl>
                            </FieldWrap>
                            <FormMessage className="hidden" />
                        </FormItem>
                    )} />

                    {/* Honeypot */}
                    <FormField control={form.control} name="hp" render={({ field }) => (
                        <div aria-hidden="true" className="absolute -left-[9999px]">
                            <input tabIndex={-1} autoComplete="off" {...field} />
                        </div>
                    )} />

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group self-start flex items-center gap-3 rounded-full font-medium tracking-wide disabled:opacity-60"
                        style={{
                            background:    "hsl(var(--hero-accent))",
                            color:         "#fff",
                            padding:       "0.85rem 2rem",
                            fontSize:      "0.78rem",
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            transition:    "background 0.25s, transform 0.2s",
                        }}
                        onMouseEnter={e => {
                            if (!isSubmitting) {
                                (e.currentTarget as HTMLElement).style.background = "hsl(var(--hero-accent-dark))";
                                (e.currentTarget as HTMLElement).style.transform  = "translateY(-2px)";
                            }
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = "hsl(var(--hero-accent))";
                            (e.currentTarget as HTMLElement).style.transform  = "";
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                Sending…
                            </>
                        ) : (
                            <>
                                Send Message
                                <span
                                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[0.75rem] group-hover:rotate-45"
                                    style={{ border: "1.5px solid rgba(255,255,255,0.4)", transition: "transform 0.25s" }}
                                >
                                ↗
                            </span>
                            </>
                        )}
                    </button>

                    <p className="text-[0.68rem]" style={{ color: C.subtext }}>
                        No commitment · I'll reply within 24 hours
                    </p>
                </form>
            </Form>
        </FormThemeCtx.Provider>
    );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export function Contact() {
    const [sectionRef, sectionVisible] = useInView<HTMLElement>(0.04);
    const [isSuccess, setIsSuccess] = React.useState(false);

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

                {/* ── Label ───────────────────────────────────────────────── */}
                <div
                    className="flex items-center gap-3 mb-10 md:mb-14 will-change-[opacity,transform]"
                    style={{
                        opacity:    sectionVisible ? 1 : 0,
                        transform:  sectionVisible ? "translateY(0)" : "translateY(1.5rem)",
                        transition: "opacity 700ms ease, transform 700ms ease",
                    }}
                >
                    <span
                        className="font-mono text-[0.62rem] tracking-[0.25em] uppercase select-none"
                        style={{ color: "rgba(10,10,10,0.22)" }}
                    >
                        006
                    </span>
                    <span className="h-px w-7 shrink-0" style={{ background: "rgba(10,10,10,0.12)" }} aria-hidden="true" />
                    <span className="text-[0.62rem] tracking-[0.2em] uppercase" style={{ color: "rgba(10,10,10,0.22)" }}>
                        Contact
                    </span>
                </div>

                {/* ── Split layout ─────────────────────────────────────────── */}
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
                            <em style={{ color: "hsl(var(--hero-accent))", fontStyle: "italic" }}>
                                extraordinary?
                            </em>
                        </h2>

                        <p
                            className="text-[0.88rem] leading-[1.8] mb-10"
                            style={{ color: "rgba(10,10,10,0.45)", maxWidth: "42ch" }}
                        >
                            Whether you have a fully fleshed-out idea or just a spark of inspiration —
                            tell me what you're trying to build and I'll help you map the best path forward.
                        </p>

                        {/* Meta strip */}
                        <div
                            className="flex flex-col gap-0 border-t"
                            style={{ borderColor: "rgba(10,10,10,0.08)" }}
                        >
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
                                    <dt className="text-[0.65rem] tracking-[0.16em] uppercase shrink-0" style={{ color: "rgba(10,10,10,0.3)" }}>
                                        {label}
                                    </dt>
                                    <dd className="text-[0.8rem] text-right" style={{ color: "rgba(10,10,10,0.7)" }}>
                                        {href ? (
                                            <a
                                                href={href}
                                                className="transition-colors duration-200"
                                                style={{ color: "hsl(var(--hero-accent))" }}
                                            >
                                                {value}
                                            </a>
                                        ) : value}
                                    </dd>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — video fills the column, form floats on top */}
                    <div
                        className="relative will-change-[opacity,transform] overflow-hidden rounded-2xl"
                        style={{
                            opacity:    sectionVisible ? 1 : 0,
                            transform:  sectionVisible ? "translateY(0)" : "translateY(1.75rem)",
                            transition: "opacity 700ms ease 180ms, transform 700ms ease 180ms",
                            /* Fallback bg for when video hasn't loaded / success state */
                            background: isSuccess ? "transparent" : "#0c0c0c",
                        }}
                    >
                        {/* Video bg — hidden on success */}
                        {!isSuccess && (
                            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                                <video
                                    autoPlay muted loop playsInline
                                    className="w-full h-full object-cover"
                                    style={{ filter: "saturate(1.08) brightness(0.65)" }}
                                >
                                    <source src="/lights.mp4" type="video/mp4" />
                                </video>
                                {/* Dark tint so text is legible at all times */}
                                <div className="absolute inset-0" style={{ background: "rgba(5,3,3,0.68)" }} />
                            </div>
                        )}

                        {/* Content */}
                        <div className="relative z-10 p-7 md:p-10">
                            {isSuccess ? (
                                <SuccessState onReset={() => setIsSuccess(false)} />
                            ) : (
                                <ContactForm onSuccess={() => setIsSuccess(true)} dark />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}