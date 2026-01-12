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
                    name="message"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell me about your project..."
                                    className="resize-none min-h-[120px] bg-muted/20"
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