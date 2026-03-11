"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-sonner";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/components/sections/Contact/contact-data";
import { FormThemeCtx } from "@/components/sections/Contact/FormThemeCtx";
import { FieldWrap } from "@/components/sections/Contact/FieldWrap";
import { LineInput, LineTextarea, LineSelect } from "@/components/sections/Contact/LineInputs";
import {
    LIGHT_COLORS, DARK_COLORS,
    PROJECT_TOPICS, BUDGET_OPTIONS, TIMELINE_OPTIONS, CONTACT_METHODS,
} from "@/components/sections/Contact/contact.constants";
import {ContactFormProps} from "@/components/sections/Contact/contact.types";


export function ContactForm({ onSuccess, dark = false }: ContactFormProps) {
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
            if (!res.ok) console.error("ContactSection form error:", await res.text());
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
                                        <LineInput {...field} value={field.value ?? ""} placeholder="Acme Pty Ltd" autoComplete="organization" />
                                    </FormControl>
                                </FieldWrap>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="website" render={({ field }) => (
                            <FormItem>
                                <FieldWrap label="Website" optional>
                                    <FormControl>
                                        <LineInput {...field} value={field.value ?? ""} placeholder="https://…" type="url" autoComplete="url" />
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
                                                    if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") {
                                                        ev.preventDefault();
                                                        const cur  = CONTACT_METHODS.indexOf(field.value ?? "");
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
                    <FormField
                        control={form.control}
                        name="hp"
                        render={({ field }) => (
                            <div aria-hidden="true" className="absolute -left-[9999px]">
                                <Input {...field} value={field.value ?? ""} tabIndex={-1} autoComplete="off" />
                            </div>
                        )}
                    />

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
                        No commitment · I&apos;ll reply within 24 hours
                    </p>
                </form>
            </Form>
        </FormThemeCtx.Provider>
    );
}
