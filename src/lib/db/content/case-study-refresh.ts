/**
 * @fileoverview Content refresh for the published case studies (2026-11-01).
 *
 * Shorter display titles, categories that describe the kind of work instead
 * of the client's sector, related photos as covers (product screenshots stay
 * inside each study), results rewritten as outcomes with clearly labelled
 * estimates, and buyer-facing language instead of implementation jargon.
 *
 * Used twice: the seed applies it when creating rows, and
 * `apply-case-study-refresh.ts` applies it to an existing database.
 */

type Json = Record<string, unknown>;

export interface CaseStudyRow {
    slug: string;
    title: string;
    summary: string | null;
    coverImage: string | null;
    body: string;
    status: string;
}

interface Refresh {
    title?: string;
    summary?: string;
    coverImage?: string;
    status?: "published" | "draft";
    /** Top-level body keys replaced wholesale. */
    set?: Json;
    /** Exact substring replacements applied to string values anywhere in the body. */
    replace?: [string, string][];
}

const ESTIMATE = true;

export const CASE_STUDY_REFRESH: Record<string, Refresh> = {
    "wrcc-social-media-content-studio": {
        title: "A content studio for course marketing",
        summary:
            "Built with Rapid Ai4 Learning for a regional community college: an internal tool that drafts Facebook, Instagram and LinkedIn posts from real course data, routes them through approval and publishes from one screen.",
        coverImage: "/img/covers/wrcc-content-studio.webp",
        set: {
            category: "Internal tool",
            results: [
                { type: "metric", metric: "4–6 h", label: "a week the marketing team no longer spends writing course posts by hand", estimate: ESTIMATE },
                { type: "text", body: "Facebook, Instagram and LinkedIn posts are drafted from live course data and published from one screen." },
                { type: "text", body: "Catalogue changes are reviewed as a before-and-after list and approved by a person, so the website stays the single source of truth." },
                { type: "text", body: "Every status change is written to an audit log, which is what a registered training organisation needs when someone asks who approved what." },
            ],
        },
        replace: [
            ["Login uses argon2 password hashing and a JWT in an httpOnly cookie. ", "Accounts and sessions follow current security practice. "],
            [
                "The test suite covers 500 backend tests, 160 frontend tests and Playwright end-to-end runs, with accessibility and visual-regression guards so the branded UI does not drift.",
                "More than 650 automated tests check it on every change, including accessibility and visual checks so the branded screens stay consistent.",
            ],
            ["A polite scraper crawls", "A scheduled job reads"],
            ["stages a diff instead of writing", "prepares a list of changes instead of writing"],
        ],
    },

    "ai4l-crm-consent-safe-campaigns": {
        title: "A CRM that never sends without approval",
        coverImage: "/img/covers/ai4l-crm.webp",
        set: {
            category: "CRM & automation",
            results: [
                { type: "metric", metric: "~3 h", label: "a week saved on exporting lists, checking unsubscribes and preparing campaigns", estimate: ESTIMATE },
                { type: "text", body: "Newsletters and course offers have separate consent, so a campaign cannot reach someone who did not agree to it." },
                { type: "text", body: "Unsubscribes are honoured immediately and synced with the email provider in both directions." },
                { type: "text", body: "AI writes the first draft of campaigns and social posts; a person approves every version before it goes anywhere." },
            ],
            solution: {
                headline: "Consent-first by design, tested end to end.",
                body: "Staff only see what their role allows, and the approval rules live in the database itself, so even a faulty screen cannot send an unapproved campaign. Automated tests cover the database rules, the app and real browsers (Chrome, Firefox and Safari), including accessibility checks to WCAG 2.1 AA. Integrations retry safely, and a missing key shows a clear message instead of an error.",
            },
        },
        replace: [["Approval enforced by Postgres, not by the UI", "Approval enforced by the database, not the screen"]],
    },

    "social-media-scout-ai-agent-human-review": {
        title: "An AI agent with a human in the loop",
        coverImage: "/img/covers/social-media-scout.webp",
        set: {
            category: "AI agent",
            results: [
                { type: "metric", metric: "~5 h", label: "a week of reading community groups replaced by a short review queue", estimate: ESTIMATE },
                { type: "text", body: "Seven days of dry-run before any group goes live, and every comment needs a person's approval unless a group is explicitly set otherwise." },
                { type: "text", body: "Every skipped post carries its reason, so the team can check the agent's judgement instead of trusting a black box." },
                { type: "text", body: "The same engine can be pointed at a different business by changing its settings, not its code." },
            ],
            solution: {
                headline: "Built to work for any business, and to be switched off.",
                body: "Everything the system knows about the organisation and each group lives in plain settings with an editor and version history, so the same engine can serve a training provider, a local shop or a non-profit. The core logic does not depend on Facebook: the reader, the poster and the notifications can each be swapped. It was built test-first, checks AI output against rules rather than exact wording, and the admin screens are protected against the usual web attacks.",
            },
        },
        replace: [["Playwright scrapes the configured groups", "The system reads the configured groups"]],
    },

    "ai4l-automation-and-web-platform": {
        title: "A website the team now runs itself",
        summary:
            "Helped Rapid Ai4 Learning, a small AI training business, take back control of its website, automate enrolment emails and reminders, and add an AI assistant for common questions.",
        set: {
            client: "Rapid Ai4 Learning",
            category: "Website & automation",
            results: [
                { type: "text", body: "The team owns its website again and updates it without outside help." },
                { type: "metric", metric: "~4 h", label: "a week of enrolment emails, event reminders and follow-ups now sent automatically", estimate: ESTIMATE },
                { type: "text", body: "An AI assistant answers common course questions around the clock, so the founder is not the help desk." },
            ],
        },
        replace: [
            ["AI4L was a growing education startup teaching", "AI4L was a growing training business teaching"],
            ["couldn't easily reach � leaving them", "couldn't easily reach, leaving them"],
            ["unblock the team immediately � restoring", "unblock the team immediately; restoring"],
            ["differentiated the platform � a newsletter", "differentiated the platform: a newsletter"],
            ["couldn't easily reach — leaving them", "couldn't easily reach, leaving them"],
            ["unblock the team immediately — restoring", "unblock the team immediately; restoring"],
            ["differentiated the platform — a newsletter", "differentiated the platform: a newsletter"],
            ["enrollments", "enrolments"],
        ],
    },

    "ai4l-lead-gen-tools-and-checkout": {
        title: "Lead-gen tools and a group-booking checkout",
        coverImage: "/img/covers/ai4l-lead-gen-checkout.webp",
        set: {
            category: "Lead-gen & checkout",
            results: [
                { type: "metric", metric: "~15 min", label: "less preparation per sales call: the team starts from the visitor's scored report, not a blank form", estimate: ESTIMATE },
                { type: "text", body: "Group bookings of several courses and seats are paid in one checkout, with the volume discount shown live." },
                { type: "text", body: "Both lead-gen tools send the visitor's answers to the sales team, so follow-up starts from a report rather than a cold enquiry." },
            ],
        },
    },

    // Sold as a product, not offered as a pilot (2026-11-02).
    "supportlegend-ndis-support-worker-app": {
        replace: [[
            "Ready for a first pilot. I am looking for one NDIS provider to try it with a small team and shape it around how they already work.",
            "Available now for NDIS providers. I set it up with your organisation's branding, roles and templates, and you can see a demo in a 30-minute call.",
        ]],
    },

    // Unpublished on 2026-11-02 at Julian's request; kept as a draft, not deleted.
    "the-better-day-support-platform": {
        title: "A calmer website for an NDIS provider",
        status: "draft",
        set: { client: "The Better Day", category: "Website" },
    },

    "architect-portfolio-website": {
        title: "An editorial portfolio for an architect",
        set: { client: "Lourdes Ynigo", category: "Portfolio website" },
    },
};

function normalizeBody(raw: string): string {
    const t = raw.trim().replace(/^﻿/, "");
    if (t.startsWith("`") && t.endsWith("`")) return t.slice(1, -1).trim();
    return t;
}

function replaceDeep(value: unknown, pairs: [string, string][]): unknown {
    if (typeof value === "string") return pairs.reduce((s, [a, b]) => s.split(a).join(b), value);
    if (Array.isArray(value)) return value.map((v) => replaceDeep(v, pairs));
    if (value && typeof value === "object") {
        return Object.fromEntries(Object.entries(value as Json).map(([k, v]) => [k, replaceDeep(v, pairs)]));
    }
    return value;
}

/** Returns the row with the refresh applied, or the same row when the slug has no refresh. */
export function applyCaseStudyRefresh<T extends CaseStudyRow>(row: T): T {
    const r = CASE_STUDY_REFRESH[row.slug];
    if (!r) return row;

    let body = JSON.parse(normalizeBody(row.body)) as Json;
    if (r.set) body = { ...body, ...r.set };
    if (r.replace) body = replaceDeep(body, r.replace) as Json;

    const summary = r.summary ?? (row.summary ? (replaceDeep(row.summary, [["�", ","], ...(r.replace ?? [])]) as string) : row.summary);

    return {
        ...row,
        title: r.title ?? row.title,
        summary,
        coverImage: r.coverImage ?? row.coverImage,
        status: r.status ?? row.status,
        body: JSON.stringify(body, null, 2),
    };
}
