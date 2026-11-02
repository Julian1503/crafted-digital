/**
 * @fileoverview SupportLegend case study (added 2026-11-02).
 *
 * Julian's own product, not client work: no client name, no testimonial and
 * no usage figures, because nobody uses it yet. Screenshots are demo data and
 * avoid any screen carrying an organisation's branding.
 */

const body = {
    version: 2,
    client: "Own product",
    category: "Mobile app",
    problem: {
        headline: "Support workers write the same shift twice, and the important parts still go missing.",
        detail:
            "In disability support the paperwork is wide and uneven. A worker on shift tracks meals, medication and sleep, keeps official registers, writes formal reports when something happens and follows each participant's approved plans. Notes end up on paper or a phone and get typed up again at the end of the day. They often say what was cleaned but not how the person presented, what staff did and what happened next. And the wrong form gets used: a refused medication logged as a note instead of a medication incident. Managers then spend their week chasing missing reports instead of supporting their team.",
    },
    approach: [
        {
            title: "The right paperwork, made obvious",
            body: "Real support paperwork falls into five kinds: trackers, registers, reports, assessments and care plans. The app keeps them separate instead of collapsing everything into a generic note, and it steers the worker to the right one. A medication refusal leads to a medication incident, and a behaviour event uses the structure a behaviour report needs.",
        },
        {
            title: "Built for the middle of a shift",
            body: "Workers use it on their phone, often one-handed, in bright light, between supporting someone and writing down what happened. The common action is one tap away, touch targets are large and text is readable at a glance. Everything a worker needs about the person they support, including plans, risks and approved strategies, sits on the same screen as the buttons to record care.",
        },
        {
            title: "AI that drafts, people who decide",
            body: "At the end of a shift the AI turns the shift's own logs into a draft report in three lengths: detailed, short and handover. Names, addresses, NDIS numbers and phone numbers are removed before anything leaves the server. Nothing is submitted automatically. Every draft is stored with its version, so there is a record of what the AI wrote and what the worker changed, and drafts nobody used are deleted on a schedule.",
        },
        {
            title: "From first report to closed incident",
            body: "A worker raises an incident (Part A) in four short steps. A manager investigates (Part B), records who was notified outside the organisation, decides corrective actions and closes it into the incident register. Managers see which shifts ended without a report and can remind the worker or send a report back with a note for correction. Submitted records are never silently edited; changes live in their history.",
        },
    ],
    solution: {
        headline: "One app for the whole team, with privacy built into every screen.",
        body: "Support workers, team leaders, managers and office staff use the same app, and each person sees only what their role and their assigned participants allow, in the interface as well as on the server. Admins set the organisation's branding, users, roles, templates and how long records are kept. It runs on Android, iOS and the web from one codebase, with a Spring Boot and PostgreSQL backend, more than a hundred versioned database migrations and a large automated test suite across the server and the app.",
    },
    results: [
        { type: "metric", metric: "5", label: "kinds of support paperwork, each with its own workflow instead of one generic note" },
        { type: "metric", metric: "0", label: "reports submitted by the AI on its own: a person reviews every draft" },
        { type: "metric", metric: "4", label: "kinds of personal details removed before a draft is generated: names, addresses, NDIS numbers and phone numbers" },
        { type: "text", body: "Ready for a first pilot. I am looking for one NDIS provider to try it with a small team and shape it around how they already work." },
    ],
    stack: [
        "React Native",
        "Expo",
        "TypeScript",
        "Java",
        "Spring Boot",
        "Spring AI",
        "Anthropic Claude API",
        "PostgreSQL",
        "Flyway",
    ],
};

const IMG = "/img/projects/supportlegend";

export const SUPPORTLEGEND_CASE_STUDY = {
    id: "cmok1supportlegend0000001",
    title: "A shift app for NDIS support workers",
    slug: "supportlegend-ndis-support-worker-app",
    summary:
        "My own product: a mobile app where support workers record shifts, medication and incidents against each participant's plan, and AI drafts the shift report for a person to review.",
    body: JSON.stringify(body, null, 2),
    coverImage: "/img/covers/supportlegend.webp",
    gallery: [
        `${IMG}/01-logging-medication-and-drafting-the-shift-report.webp`,
        `${IMG}/02-an-incident-from-part-a-to-manager-review.webp`,
        `${IMG}/03-manager-review-and-corrections.webp`,
    ].join(", "),
    status: "published",
    publishedAt: new Date("2026-11-02T00:00:00.000+00:00"),
    featured: false,
    sortOrder: 1350,
    metaTitle: null,
    metaDesc: null,
    ogImage: null,
    authorId: "cmlsxd2f800131svj2wcrlk3r",
    deleted: false,
    createdAt: new Date("2026-11-02T00:00:00.000+00:00"),
    updatedAt: new Date("2026-11-02T00:00:00.000+00:00"),
};
