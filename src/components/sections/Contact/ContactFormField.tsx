/**
 * @fileoverview Contact form fields component.
 * Renders all form inputs for the contact form with validation.
 * Implements WCAG 2.x AAA accessible form patterns.
 */
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { ContactFormFieldsProps } from "@/components/sections/Contact/contact.types";

/** Available project topics for selection */
const PROJECT_TOPICS = [
    "New SaaS",
    "Landing page",
    "E-commerce",
    "Fix/maintenance",
    "Performance/SEO",
    "Integrations",
    "Other",
];

/** Budget range options */
const BUDGET_OPTIONS = [
    { value: "", label: "Select…" },
    { value: "Under $2k", label: "Under $2k" },
    { value: "$2k–$5k", label: "$2k–$5k" },
    { value: "$5k–$10k", label: "$5k–$10k" },
    { value: "$10k+", label: "$10k+" },
];

/** Timeline options */
const TIMELINE_OPTIONS = [
    { value: "", label: "Select…" },
    { value: "ASAP", label: "ASAP" },
    { value: "2–4 weeks", label: "2–4 weeks" },
    { value: "1–2 months", label: "1–2 months" },
    { value: "Flexible", label: "Flexible" },
];

/** Contact method options */
const CONTACT_METHODS = ["Email", "Call"];

/**
 * Contact form fields component.
 * Renders the complete contact form with all input fields and validation.
 *
 * @param props - Form instance, submit handler, and loading state
 * @returns The rendered form with all fields
 */
export default function ContactFormFields({ form, onSubmit, isSubmitting }: ContactFormFieldsProps) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <h3 className="text-2xl font-bold mb-6">Book a free call</h3>

                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Name <span className="text-destructive" aria-hidden="true">*</span>
                                <span className="sr-only">(required)</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="John Doe"
                                    {...field}
                                    autoComplete="name"
                                    required
                                    className="h-12 bg-muted/20"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Email <span className="text-destructive" aria-hidden="true">*</span>
                                <span className="sr-only">(required)</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="john@example.com"
                                    {...field}
                                    className="h-12 bg-muted/20"
                                    type="email"
                                    autoComplete="email"
                                    required
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="company"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Company (optional)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Acme Pty Ltd"
                                    autoComplete="organization"
                                    {...field}
                                    className="h-12 bg-muted/20"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="website"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Website (optional)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="https://…"
                                    type="url"
                                    autoComplete="url"
                                    {...field}
                                    className="h-12 bg-muted/20"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="topics"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel id="topics-label" >What do you want to talk about?</FormLabel>
                            <FormControl>
                                <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="topics-label">
                                    {PROJECT_TOPICS.map((t) => {
                                        const checked = field.value?.includes(t);
                                        const checkboxId = `topic-${t.toLowerCase().replace(/\s+/g, '-')}`;
                                        return (
                                            <label
                                                key={t}
                                                htmlFor={checkboxId}
                                                className="flex items-center gap-2 rounded-xl border bg-muted/10 px-3 py-2 cursor-pointer hover:bg-muted/20 transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={checkboxId}
                                                    checked={checked}
                                                    onChange={(e) => {
                                                        const next = e.target.checked
                                                            ? [...(field.value ?? []), t]
                                                            : (field.value ?? []).filter((x: string) => x !== t);
                                                        field.onChange(next);
                                                    }}
                                                    className="w-4 h-4 rounded border-border"
                                                />
                                                <span className="text-sm">{t}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="budget"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel htmlFor="budget-select" >Budget</FormLabel>
                            <FormControl>
                                <select
                                    className="h-12 w-full rounded-md border bg-muted/20 px-3"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                >
                                    {BUDGET_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="timeline"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel htmlFor="timeline-select" >Timeline</FormLabel>
                            <FormControl>
                                <select
                                    className="h-12 w-full rounded-md border bg-muted/20 px-3"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                >
                                    {TIMELINE_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="contactMethod"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel id="contact-method-label">Preferred contact</FormLabel>
                            <FormControl>
                                <div
                                    className="flex gap-2"
                                    role="radiogroup"
                                    aria-labelledby="contact-method-label"
                                >
                                    {CONTACT_METHODS.map((method, index) => {
                                        const isSelected = field.value === method;
                                        const isFirst = index === 0;
                                        const shouldBeTabbable = isSelected || (isFirst && !CONTACT_METHODS.includes(field.value || ""));

                                        return (
                                            <button
                                                type="button"
                                                key={method}
                                                role="radio"
                                                aria-checked={isSelected}
                                                tabIndex={shouldBeTabbable ? 0 : -1}
                                                onClick={() => field.onChange(method)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                                                        e.preventDefault();
                                                        const currentIndex = CONTACT_METHODS.indexOf(field.value || "");
                                                        let nextIndex: number;
                                                        if (e.key === "ArrowRight") {
                                                            nextIndex = currentIndex < CONTACT_METHODS.length - 1 ? currentIndex + 1 : 0;
                                                        } else {
                                                            nextIndex = currentIndex > 0 ? currentIndex - 1 : CONTACT_METHODS.length - 1;
                                                        }
                                                        field.onChange(CONTACT_METHODS[nextIndex]);
                                                        const parent = e.currentTarget.parentElement;
                                                        const buttons = parent?.querySelectorAll("button");
                                                        buttons?.[nextIndex]?.focus();
                                                    }
                                                }}
                                                className={`px-4 py-2 rounded-xl border ${isSelected ? "bg-foreground text-background" : "bg-muted/10"}`}
                                            >
                                                {method}
                                            </button>
                                        );
                                    })}
                                </div>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Honeypot field for spam prevention - hidden from users */}
                <FormField
                    control={form.control}
                    name="hp"
                    render={({field}) => (
                        <div aria-hidden="true" className="absolute -left-[9999px]">
                            <input
                                tabIndex={-1}
                                autoComplete="off"
                                {...field}
                            />
                        </div>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Message <span className="text-destructive" aria-hidden="true">*</span>
                                <span className="sr-only">(required)</span>
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell me about your project..."
                                    className="resize-none min-h-30 bg-muted/20"
                                    {...field}
                                    required
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full h-12 text-lg rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                            Sending...
                        </>
                    ) : (
                        "Send Message"
                    )}
                </Button>
            </form>
        </Form>
    );
}