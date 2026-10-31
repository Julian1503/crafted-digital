# Compliance Platform

A multi-tenant compliance platform for Australian Registered Training Organisations (RTOs). It keeps the official regulatory texts current without manual uploads, audits an organisation's policies against them, and turns the gaps it finds into risks that a person manages through to closure.

**Stack:** Python 3.12 · FastAPI · PostgreSQL 16 + pgvector · SQLAlchemy 2 · Redis + RQ · Next.js 16 · React 19 · Tailwind v4 · OpenAI · Perplexity · Docker Compose

> Status: in active development (Phase 0 of 6, foundations). This page describes the product as designed and which parts are already built. Nothing here uses real client data.

---

## The problem

An RTO has to show that its policies (trainer qualifications, complaints handling, assessment, privacy and so on) comply with a stack of regulatory documents: the Standards for RTOs, the Credential Policy, the Privacy Act and regulator guidance. These texts change, live on different sites, and some regulators' sites block automated access. Checking policies against them by hand is slow, easy to get wrong, and hard to keep up to date.

## What it does

### 1. Sourcing: the official text, kept current
The platform fetches regulatory documents from their official sources on a schedule (the Federal Register of Legislation API, OAIC, WA-TAC) with no manual upload. A new version is stored only when the wording actually changes, and every version is kept. Legal status (in force or not) is taken only from an authoritative signal such as an API field, never guessed by a model.

Some regulators block automated clients. The platform does not work around that: the block is recorded with evidence, and the document can only enter through an authorised upload by a person, clearly marked as such.

### 2. Obligation library
Each obligation is a specific clause of an instrument with a verbatim anchor quote, written guidance and, where relevant, a closed list (for example approved credential codes). Every entry is checked against the stored official text and is only used if the quote and the clause reference really match.

### 3. Auditor
A client uploads a policy and a person confirms its category. The platform then decides in code which obligations apply, builds a checklist with the official wording, and asks a language model to assess the policy against it with one structured call and no tools. The model never reads the web: it judges only against stored official text.

### 4. Verification layer: the model proposes, code verifies
Every claim the model makes is checked before anyone sees it as fact:
- the cited clause exists on the current version and the quote is a contiguous span of the real text;
- a finding that blames or credits a policy section quotes that section verbatim;
- credential lists are compared by set difference against the stored clause;
- the obligation the model names must agree with where its citations actually sit.

A claim that fails a check is downgraded to "requires human review" and goes to a person.

### 5. Risk Manager
Gaps become risks with a full lifecycle: candidate, under review, confirmed, in remediation, evidence accepted, closed (and reopened with a reason). There is one risk per policy and obligation, never duplicated across re-scans; ratings are set by a person; a risk cannot be closed without accepted evidence; every transition is written to an event history, with review deadlines, alerts and assignment to real users.

### 6. Propagation
When a regulatory text changes, only the policies affected by the changed obligations are flagged for re-evaluation. Re-scans run through a budgeted queue with the estimated LLM cost shown before anything is queued.

### 7. Writer agent
Drafts or improves a policy with locked sections, code-computed diffs and versioned acceptance. A clause is only labelled "mandatory" if it has a verified binding citation.

---

## Multi-tenant and white-label

- **Three levels:** platform administrators (the operator), client administrators, and client users.
- **One subdomain per client.** The tenant is resolved from the host name and checked against the session; the base domain is configuration.
- **Branding per client:** logo, dark-background logo, display and short name, a sign-in message and one brand colour from which shades and tints are derived. A colour is rejected if white text on it falls below 4.5:1 contrast.
- **Agents switched on per client:** Writer, Auditor and Risk Manager are enabled for the clients that contracted them, enforced in the API and hidden in the menu.
- **"View as client"** impersonation for support, with every action recorded in a platform audit log.
- **No plans, prices or billing in the product.** Usage and LLM cost are tracked per client for internal monitoring only.

## Engineering highlights

- **Own login, deliberately simple and secure.** Invitation-only accounts, Argon2id password hashing, server-side sessions in Postgres (only the SHA-256 of the token is stored), `HttpOnly`/`Secure`/`SameSite` cookies, Origin checks on state-changing requests, rate-limited sign-in, single-use password-reset tokens, and sessions ended on logout and password change. No JWTs and no external identity provider.
- **Tenant isolation in the database.** Postgres row-level security on every tenant-owned table as a second line behind service-layer checks; an automated test per route proves a user in one tenant cannot read or write another's data. The Phase 0 security review's findings were resolved and regression-tested.
- **Honest crawling.** A single policy-enforcing HTTP client is the only outbound path: https only, operator allowlist, SSRF protection on every redirect hop, robots.txt respected including `Crawl-delay`, per-host delays and size and time caps, and a contactable User-Agent. It never imitates a browser.
- **Swappable, pinned model providers.** One `LLMProvider` contract for OpenAI and Perplexity, a pinned model snapshot per task, prompt files whose hash is recorded on every call, per-model prices from configuration, and the model identifier actually returned, so a silent model change is visible. The Perplexity adapter rejects any reply that carries web results.
- **Hybrid retrieval.** Full-text search, pgvector HNSW semantic search and exact legal-reference matching, fused by reciprocal rank fusion and reranked by a local cross-encoder. Embeddings run locally so tenant policy text stays on the Sydney server. The proof of concept measured hit@1 0.87 and hit@5 0.94 on a hand-labelled query set.
- **Evidence-led design.** The product follows a closed proof of concept that measured detection, citation validity and cost across two providers; the decisions it carried over are recorded as architecture decision records.
- **Quality gates.** TDD, an 80% coverage gate in CI, tests against a real Postgres with pgvector (no SQLite stand-in), a full migration downgrade/upgrade cycle, Playwright end-to-end tests, secret scanning, and Mailpit to capture emails locally.
- **Privacy by configuration.** Data retention and what policy text is sent to the model are settings per tenant, and data is hosted in Australia.

## Where it stands

| Phase | Scope | State |
|---|---|---|
| 0. Foundations | Repository layout, CI, own login, tenancy with row-level security, provider layer, branded sign-in, platform console, account pages | In progress |
| 1. Sourcing | Scheduled ingestion, versioning, extraction, hybrid retrieval, knowledge base | Planned |
| 2. Auditor | Obligation library, verification layer, evaluation harness | Planned |
| 3. Risk Manager | Risk lifecycle, alerts, targeted propagation | Planned |
| 4. Breadth | 19+ obligations across 9 areas, larger evaluation set, Writer | Planned |
| 5. Parity and operations | Templates, reports, quarterly reviews, activity trail, "Ask Compliance" | Planned |

Each phase has measurable exit criteria that must be met in a staging environment, not only locally.
