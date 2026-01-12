"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-sonner";
import { useScrollAnimation } from "@/lib/use-scroll-animation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Loader2, Send, Check } from "lucide-react";
import {formSchema} from "@/components/sections/Contact/contact-data";
import ContactSuccessState from "@/components/sections/Contact/ContactSuccessState";
import ContactFormFields from "@/components/sections/Contact/ContactFormField";

export function Contact() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { ref, isVisible } = useScrollAnimation();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            console.log(values);
            setIsSubmitting(false);
            setIsSuccess(true);
            toast({
                title: "Message sent!",
                description: "I’ll get back to you within 24 hours.",
            });
            form.reset();
        }, 1500);
    }

    return (
        <section id="contact" className="py-24 bg-foreground text-background">
            <div className="container mx-auto px-4 md:px-6">
                <div
                    ref={ref}
                    className={cn(
                        "grid lg:grid-cols-2 gap-16 items-center reveal-on-scroll",
                        isVisible && "is-visible"
                    )}
                >
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            Ready to build something{" "}
                            <span className="text-secondary">extraordinary?</span>
                        </h2>
                        <p className="text-xl text-muted-foreground/80 leading-relaxed">
                            Whether you have a fully fleshed-out idea or just a spark of
                            inspiration, I’d love to hear from you. Tell me what you’re trying
                            to build, and I’ll help you map the best path forward.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-4 text-background/80">
                                <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                    <Send size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-background">Email me directly</div>
                                    <div className="text-secondary">julianedelgado@hotmail.com</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-background text-foreground p-8 md:p-10 rounded-3xl shadow-2xl shadow-black/20">
                        {isSuccess ? (
                            <ContactSuccessState setIsSuccess={setIsSuccess}/>
                        ) : (
                            <ContactFormFields
                                form={form}
                                onSubmit={onSubmit}
                                isSubmitting={isSubmitting}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
