/**
 * @fileoverview Shared FAQ data for UI and structured data.
 */

/**
 * FAQ item structure.
 */
export interface FAQItem {
    /** The question text */
    question: string;
    /** The answer text */
    answer: string;
}

/**
 * List of frequently asked questions and answers.
 */
export const FAQS: FAQItem[] = [
    {
        question: "What is your typical project timeline?",
        answer:
            "Most web application projects take between 4–8 weeks from kickoff to launch. Simple websites can be faster (2–3 weeks), while more complex builds may take 3+ months depending on scope. I work with clients Australia-wide, so timezone alignment is never an issue.",
    },
    {
        question: "Do you work with businesses across Australia?",
        answer:
            "Yes! While I'm based in Toowoomba, Queensland, I work with clients across all of Australia — from Sydney and Melbourne to Brisbane, Perth, Adelaide, and regional areas. All collaboration happens remotely with weekly video calls and clear communication.",
    },
    {
        question: "Do you provide post-launch support?",
        answer:
            "Yes. I include 30 days of post-launch support to fix any bugs and make small adjustments. After that, I can offer an ongoing maintenance plan to keep everything secure, updated, and fast.",
    },
    {
        question: "What technologies do you use?",
        answer:
            "I specialise in a modern JavaScript stack: React, Next.js, Node.js, and TypeScript. For styling, I usually use Tailwind CSS. For databases, PostgreSQL is my default choice for most projects.",
    },
    {
        question: "Do you work with startups and small businesses?",
        answer:
            "Absolutely. I enjoy working with founders and small business owners to build MVPs quickly, iterate fast, and still keep the codebase clean and scalable. Many of my clients are Australian service businesses — tradies, consultants, clinics, and agencies.",
    },
    {
        question: "What do I need to get started?",
        answer:
            "Ideally, you have a clear idea of what you want to build and why. If you already have designs, great. If not, I can help you shape the UX and UI during the design phase.",
    },
    {
        question: "How do payments work?",
        answer:
            "I typically ask for a 50% deposit to lock in the start date, with the remaining 50% due when the project is completed and approved. All pricing is in Australian dollars (AUD).",
    },
];