/**
 * @fileoverview FAQ section component.
 * Displays frequently asked questions in an accordion format.
 */
"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/lib/use-scroll-animation";
import { cn } from "@/lib/utils";
import { FAQS } from "@/components/sections/faq-data";

/**
 * FAQ section component displaying questions and answers in an accordion.
 * Features scroll-triggered reveal animation.
 *
 * @returns The rendered FAQ section
 */
export function FAQ() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="faq" className="py-24 bg-background" aria-labelledby="faq-heading">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 id="faq-heading"  className="text-4xl font-bold mb-4 text-foreground">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Everything you need to know about working with me.
                    </p>
                </div>

                <div ref={ref} className={cn("reveal-on-scroll", isVisible && "is-visible")}>
                    <Accordion type="single" collapsible className="w-full">
                        {FAQS.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border-b border-border/60"
                            >
                                <AccordionTrigger className="text-lg font-medium py-6 hover:text-secondary hover:no-underline text-left">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
