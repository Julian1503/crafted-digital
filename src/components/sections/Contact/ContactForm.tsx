"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-sonner";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { formSchema, type ContactFormValues } from "@/components/sections/Contact/contact-data";
import { FormThemeCtx } from "@/components/sections/Contact/FormThemeCtx";
import { FieldWrap } from "@/components/sections/Contact/FieldWrap";
import { LineInput, LineTextarea, LineSelect } from "@/components/sections/Contact/LineInputs";
import {
    LIGHT_COLORS, DARK_COLORS,
    PROJECT_TOPICS, BUDGET_OPTIONS, TIMELINE_OPTIONS, CONTACT_METHODS,
} from "@/components/sections/Contact/contact.constants";
import {ContactFormProps} from "@/components/sections/Contact/contact.types";
import { track } from "@/lib/analytics";
import { CONTACT_EMAIL } from "@/lib/constants/site";

interface ApiErrorBody {
    error?: { code?: string; message?: string; retryAfter?: number };
}

async function readErrorMessage(res: Response): Promise<string> {
    try {
        const body = (await res.json()) as ApiErrorBody;
        if (res.status === 429) {
            const mins = body.error?.retryAfter ? Math.ceil(body.error.retryAfter / 60) : null;
            return mins ? `Too many messages from this connection. Try again in about ${mins} min.` : "Too many messages from this connection. Try again later.";
        }
        if (res.status === 400 && body.error?.message) return body.error.message;
    } catch {
        // ignore body parse errors
    }
    return "Couldn't send your message.";
}

export function ContactForm({ onSuccess, dark = false }: ContactFormProps) {
    const C = dark ? DARK_COLORS : LIGHT_COLORS;
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const startedRef = React.useRef(false);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "", email: "", message: "", topics: [],
            budget: "", timeline: "", company: "", website: "",
            hp: "", contactMethod: undefined,
        },
    });

    const markStarted = () => {
        if (startedRef.current) return;
        startedRef.current = true;
        track("contact_form_started");
    };

    async function onSubmit(values: ContactFormValues) {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const message = await readErrorMessage(res);
                setSubmitError(message);
                track("contact_form_failed", { reason: `http_${res.status}` });
                toast({ title: message, description: `You can also email ${CONTACT_EMAIL} directly.`, variant: "error" });
                return;
            }

            const body = (await res.json().catch(() => ({}))) as { ok?: boolean; skipped?: boolean };
            if (!body.skipped) {
                track("contact_form_submitted", {
                    topics: values.topics,
                    budget: values.budget || "unspecified",
                    contact_method: values.contactMethod || "unspecified",
                });
            }
            form.reset();
            onSuccess();
        } catch (error: unknown) {
            const message = "Couldn't reach the server.";
            console.error("[contact] submit failed", error instanceof Error ? error.message : error);
            setSubmitError(message);
            track("contact_form_failed", { reason: "network" });
            toast({ title: message, description: `Check your connection and try again, or email ${CONTACT_EMAIL}.`, variant: "error" });
        } finally {
            setIsSubmitting(false);
        }
    }

    const e = form.formState.errors;
    const errorList = Object.entries(e)
        .map(([key, err]) => ({ key, message: (err as { message?: string })?.message }))
        .filter((x): x is { key: string; message: string } => Boolean(x.message));

    return (
        <FormThemeCtx.Provider value={C}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onFocusCapture={markStarted}
                    noValidate
                    className="flex flex-col gap-7"
                    aria-describedby={submitError ? "contact-submit-error" : undefined}
                >
                    {/* Error summary (focusable, announced) */}
                    {form.formState.isSubmitted && errorList.length > 0 && (
                        <div
                            role="alert"
                            tabIndex={-1}
                            ref={(el) => { if (el) el.focus(); }}
                            className="rounded-xl border px-4 py-3 text-[0.8rem]"
                            style={{ borderColor: "hsl(var(--destructive) / 0.5)", color: C.text }}
                        >
                            <p className="font-medium mb-1">Please check {errorList.length === 1 ? "this field" : "these fields"}:</p>
                            <ul className="list-disc pl-5">
                                {errorList.map(({ key, message }) => (
                                    <li key={key}>{message}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FieldWrap label="Name" required error={e.name?.message}>
                                    <FormControl>
                                        <LineInput placeholder="Jane Citizen" autoComplete="name" required {...field} />
                                    </FormControl>
                                </FieldWrap>
                                <FormMessage className="hidden" />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FieldWrap label="Email" required error={e.email?.message}>
                                    <FormControl>
                                        <LineInput placeholder="jane@yourbusiness.com.au" type="email" inputMode="email" autoComplete="email" spellCheck={false} required {...field} />
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
                                        <LineInput {...field} value={field.value ?? ""} placeholder="Acme Pty Ltd" autoComplete="organization" />
                                    </FormControl>
                                </FieldWrap>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="website" render={({ field }) => (
                            <FormItem>
                                <FieldWrap label="Website" optional error={e.website?.message}>
                                    <FormControl>
                                        <LineInput {...field} value={field.value ?? ""} placeholder="https://…" type="url" inputMode="url" autoComplete="url" spellCheck={false} />
                                    </FormControl>
                                </FieldWrap>
                                <FormMessage className="hidden" />
                            </FormItem>
                        )} />
                    </div>

                    {/* Topics */}
                    <FormField control={form.control} name="topics" render={({ field }) => (
                        <FormItem>
                            <FieldWrap label="What do you want to build?" required error={e.topics?.message}>
                                <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="What do you want to build?">
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
                                                className="min-h-[36px] text-[0.75rem] tracking-[0.06em] rounded-full px-3.5 py-1.5 border transition-[background-color,color,border-color] duration-200"
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
                            <FormMessage className="hidden" />
                        </FormItem>
                    )} />

                    {/* Budget + Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                        <FormField control={form.control} name="budget" render={({ field }) => (
                            <FormItem>
                                <FieldWrap label="Budget" optional>
                                    <FormControl>
                                        <LineSelect name={field.name} value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur}>
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
                                <FieldWrap label="Timeline" optional>
                                    <FormControl>
                                        <LineSelect name={field.name} value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur}>
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
                            <FieldWrap label="Preferred contact" optional>
                                <div className="flex gap-3 pt-1" role="radiogroup" aria-label="Preferred contact method">
                                    {CONTACT_METHODS.map((method, index) => {
                                        const selected  = field.value === method;
                                        const tabbable  = selected || (index === 0 && !CONTACT_METHODS.includes(field.value ?? ""));
                                        return (
                                            <button
                                                key={method}
                                                type="button"
                                                role="radio"
                                                aria-checked={selected}
                                                tabIndex={tabbable ? 0 : -1}
                                                onClick={() => field.onChange(method)}
                                                onKeyDown={(ev) => {
                                                    const forward  = ev.key === "ArrowRight" || ev.key === "ArrowDown";
                                                    const backward = ev.key === "ArrowLeft"  || ev.key === "ArrowUp";
                                                    if (!forward && !backward) return;
                                                    ev.preventDefault();
                                                    const cur  = CONTACT_METHODS.indexOf(field.value ?? "");
                                                    const next = forward
                                                        ? (cur < CONTACT_METHODS.length - 1 ? cur + 1 : 0)
                                                        : (cur > 0 ? cur - 1 : CONTACT_METHODS.length - 1);
                                                    field.onChange(CONTACT_METHODS[next]);
                                                    (ev.currentTarget.parentElement?.querySelectorAll("button")[next] as HTMLElement)?.focus();
                                                }}
                                                className="min-h-[36px] text-[0.75rem] tracking-[0.06em] rounded-full px-4 py-1.5 border transition-[background-color,color,border-color] duration-200"
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
                                    <LineTextarea placeholder="What are you trying to build, and what's getting in the way today?" required {...field} />
                                </FormControl>
                            </FieldWrap>
                            <FormMessage className="hidden" />
                        </FormItem>
                    )} />

                    {/* Honeypot: hidden from everyone, including assistive tech */}
                    <FormField
                        control={form.control}
                        name="hp"
                        render={({ field }) => (
                            <div hidden aria-hidden="true">
                                <label htmlFor="contact-website-url">Leave this empty</label>
                                <input id="contact-website-url" {...field} value={field.value ?? ""} tabIndex={-1} autoComplete="off" />
                            </div>
                        )}
                    />

                    {submitError && (
                        <p id="contact-submit-error" role="alert" className="text-[0.8rem]" style={{ color: "hsl(var(--destructive))" }}>
                            {submitError} Email{" "}
                            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2" style={{ color: C.text }} onClick={() => track("email_clicked", { location: "contact_form_error" })}>
                                {CONTACT_EMAIL}
                            </a>{" "}
                            if it keeps happening.
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                        className="group self-start flex items-center gap-3 rounded-full font-medium tracking-wide disabled:opacity-60 min-h-[44px]"
                        style={{
                            background:    "hsl(var(--hero-accent))",
                            color:         "#fff",
                            padding:       "0.85rem 2rem",
                            fontSize:      "0.78rem",
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            transition:    "background-color 0.25s, transform 0.2s",
                        }}
                        onMouseEnter={ev => {
                            if (!isSubmitting) {
                                (ev.currentTarget as HTMLElement).style.background = "hsl(var(--hero-accent-dark))";
                                (ev.currentTarget as HTMLElement).style.transform  = "translateY(-2px)";
                            }
                        }}
                        onMouseLeave={ev => {
                            (ev.currentTarget as HTMLElement).style.background = "hsl(var(--hero-accent))";
                            (ev.currentTarget as HTMLElement).style.transform  = "";
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                Sending…
                            </>
                        ) : (
                            <>
                                Send message
                                <span
                                    aria-hidden="true"
                                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[0.75rem] group-hover:rotate-45"
                                    style={{ border: "1.5px solid rgba(255,255,255,0.4)", transition: "transform 0.25s" }}
                                >
                                    ↗
                                </span>
                            </>
                        )}
                    </button>

                    <p className="text-[0.72rem]" style={{ color: C.subtext }}>
                        No commitment. I reply within 24 hours, even if the answer is that I&rsquo;m not the right fit.
                    </p>
                </form>
            </Form>
        </FormThemeCtx.Provider>
    );
}
