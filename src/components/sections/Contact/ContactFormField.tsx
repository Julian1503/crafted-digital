import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Loader2} from "lucide-react";
import {ContactFormFieldsProps} from "@/components/sections/Contact/contact.types";

export default function ContactFormFields({form, onSubmit, isSubmitting}: ContactFormFieldsProps) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Book a free call</h3>

                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="John Doe"
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
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="john@example.com"
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
                    name="company"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Company (optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Acme Pty Ltd" {...field} className="h-12 bg-muted/20"/>
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
                                <Input placeholder="https://…" {...field} className="h-12 bg-muted/20"/>
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
                            <FormLabel>What do you want to talk about?</FormLabel>
                            <FormControl>
                                <div className="grid grid-cols-2 gap-2">
                                    {["New SaaS", "Landing page", "E-commerce", "Fix/maintenance", "Performance/SEO", "Integrations", "Other"].map((t) => {
                                        const checked = field.value?.includes(t);
                                        return (
                                            <label key={t}
                                                   className="flex items-center gap-2 rounded-xl border bg-muted/10 px-3 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={(e) => {
                                                        const next = e.target.checked
                                                            ? [...(field.value ?? []), t]
                                                            : (field.value ?? []).filter((x: string) => x !== t);
                                                        field.onChange(next);
                                                    }}
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
                            <FormLabel>Budget</FormLabel>
                            <FormControl>
                                <select
                                    className="h-12 w-full rounded-md border bg-muted/20 px-3"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                >
                                    <option value="">Select…</option>
                                    <option value="Under $2k">Under $2k</option>
                                    <option value="$2k–$5k">$2k–$5k</option>
                                    <option value="$5k–$10k">$5k–$10k</option>
                                    <option value="$10k+">$10k+</option>
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
                            <FormLabel>Timeline</FormLabel>
                            <FormControl>
                                <select
                                    className="h-12 w-full rounded-md border bg-muted/20 px-3"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                >
                                    <option value="">Select…</option>
                                    <option value="ASAP">ASAP</option>
                                    <option value="2–4 weeks">2–4 weeks</option>
                                    <option value="1–2 months">1–2 months</option>
                                    <option value="Flexible">Flexible</option>
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
                            <FormLabel>Preferred contact</FormLabel>
                            <FormControl>
                                <div className="flex gap-2">
                                    {["Email", "Call"].map((m) => (
                                        <button
                                            type="button"
                                            key={m}
                                            onClick={() => field.onChange(m)}
                                            className={`px-4 py-2 rounded-xl border ${field.value === m ? "bg-foreground text-background" : "bg-muted/10"}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* honeypot hidden */}
                <FormField
                    control={form.control}
                    name="hp"
                    render={({field}) => (
                        <input
                            tabIndex={-1}
                            autoComplete="off"
                            className="hidden"
                            {...field}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell me about your project..."
                                    className="resize-none min-h-30 bg-muted/20"
                                    {...field}
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
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
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