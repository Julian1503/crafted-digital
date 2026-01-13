import {z} from "zod";

export const formSchema = z.object({
    name: z.string().min(1, "Please enter your name"),
    email: z.email("Please enter a valid email"),
    message: z.string().min(10, "Please add a bit more detail"),
    topics: z.array(z.string()).min(1, "Select at least one topic"),
    budget: z.string().optional(),
    timeline: z.string().optional(),
    contactMethod: z.enum(["Email", "Call"]).optional(),
    company: z.string().optional(),
    website: z.string().optional(),
    hp: z.string().optional(),
});


