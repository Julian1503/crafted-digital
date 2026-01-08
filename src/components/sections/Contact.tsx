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

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.email({
        message: "Please enter a valid email address.",
    }),
    message: z.string().min(10, {
        message: "Message must be at least 10 characters.",
    }),
});

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
                                    <div className="text-secondary">hello@crafteddigital.com</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-background text-foreground p-8 md:p-10 rounded-3xl shadow-2xl shadow-black/20">
                        {isSuccess ? (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                                    <Check size={32} />
                                </div>
                                <h3 className="text-2xl font-bold">Message Sent!</h3>
                                <p className="text-muted-foreground">
                                    Thanks for reaching out. I’ll be in touch shortly to schedule
                                    your free call.
                                </p>
                                <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-6">
                                    Send another message
                                </Button>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <h3 className="text-2xl font-bold mb-6">Book a free call</h3>

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="John Doe"
                                                        {...field}
                                                        className="h-12 bg-muted/20"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="john@example.com"
                                                        {...field}
                                                        className="h-12 bg-muted/20"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Message</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell me about your project..."
                                                        className="resize-none min-h-[120px] bg-muted/20"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
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
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            "Send Message"
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
