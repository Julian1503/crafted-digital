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
        question: "How long does a project take?",
        answer:
            "A Starter website ships in about 2 weeks and a Growth website in 4 to 6 weeks. Custom software and web apps take 6 to 12 weeks depending on scope, with a working demo every week along the way. I work with clients Australia-wide, so time zones are never a problem.",
    },
    {
        question: "Do you work with businesses across Australia?",
        answer:
            "Yes. I’m based in Toowoomba, Queensland, and work with clients across Australia, from Sydney and Melbourne to Brisbane, Perth, Adelaide and regional towns. Everything happens remotely with a weekly video call and written updates in between.",
    },
    {
        question: "I don’t know exactly what I need. Can I still get in touch?",
        answer:
            "That is the normal starting point. Send a few lines about the problem and we book a 20-minute call. Discovery is the first phase of every project: we map goals, constraints and a scope you can approve before anything is built.",
    },
    {
        question: "What happens if you get busy or disappear?",
        answer:
            "The code, hosting, domain and analytics accounts are set up in your name from day one, so nothing depends on me. You get weekly demos, 30 days of fixes after launch, and the Ongoing Tech Partner plan if you want guaranteed hours each month. Any other developer can pick the project up.",
    },
    {
        question: "What does custom software cost?",
        answer:
            "Internal tools, portals and automations start at AUD 8,000 and are quoted as a fixed price after a short discovery workshop. The quote lists what is included, what is not, and the delivery date, so there are no surprises mid-build.",
    },
    {
        question: "How do you use AI in projects?",
        answer:
            "Where it saves real time: drafting content, classifying enquiries, answering common questions, pulling data out of documents. Every AI feature I ship keeps a person in control, with an approval step, an audit trail and tests, so nothing goes out to a customer without someone saying yes.",
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
            "Yes. I enjoy working with founders and small business owners to build an MVP quickly, iterate fast, and keep the codebase clean enough to grow. Most of my clients are Australian service businesses: tradies, consultants, clinics, training providers and agencies.",
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