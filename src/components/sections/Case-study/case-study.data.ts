import {CaseStudyBase} from "@/components/sections/Case-study/case-study.types";

/**
 * Case study preview data for the listing page.
 */
export const caseStudies : CaseStudyBase[] = [
    {
        slug: "ai-contract-automation",
        title: "AI-Powered Contract Automation",
        client: "Legal Tech Startup",
        category: "AI / Automation",
        description:
            "Automating contract interpretation and memo drafting — cutting hours of manual work down to minutes for Australian legal professionals.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    },
    {
        slug: "tradie-booking-platform",
        title: "Tradie Booking Platform",
        client: "Queensland Trade Services",
        category: "Web Application",
        description:
            "A custom booking and job management platform built for a growing Queensland trade services business, streamlining operations and improving customer experience.",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
    },
    {
        slug: "clinic-management-system",
        title: "Clinic Management System",
        client: "Allied Health Practice",
        category: "Healthcare / SaaS",
        description:
            "A modern patient management system for an Australian allied health practice, featuring online booking, patient records, and billing integration.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800",
    },
];