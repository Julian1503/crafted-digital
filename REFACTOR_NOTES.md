# Refactor Notes

## Summary

This PR addresses a critical build failure and sets up the testing and CI infrastructure for the project.

## Major Changes

### 1. Fix Critical Build Failure — Missing Validation Schemas

**Problem:** The `src/lib/validations/index.ts` barrel file exported from 14 schema files that did not exist, causing 54 module-not-found errors and a completely broken build.

**Fix:** Created all 14 Zod validation schema files:
- `auth.schema.ts` — login validation
- `users.schema.ts` — user create/update
- `roles.schema.ts` — role create/update
- `blog.schema.ts` — blog post create/update
- `case-studies.schema.ts` — case study create/update
- `content-blocks.schema.ts` — content block validation
- `media-assets.schema.ts` — media asset validation
- `leads.schema.ts` — lead create/update + notes
- `bookings.schema.ts` — booking create/update + notes
- `plans.schema.ts` — plan create/update
- `coupons.schema.ts` — coupon create/update
- `integrations.schema.ts` — integration update
- `site-settings.schema.ts` — site setting upsert
- `utils.schema.ts` — shared pagination and reorder schemas

Each schema was designed to match the data shapes expected by the corresponding service functions and API route handlers.

### 2. Test Infrastructure

**Added:**
- Vitest as test runner with v8 coverage provider
- `vitest.config.ts` with path aliases matching tsconfig
- 98 unit tests across 10 test files covering:
  - All 14 validation schemas (valid inputs, required fields, optional fields, edge cases)
  - `normalizeFolder` utility (sanitization, traversal prevention, edge cases)
  - `toValidationError` and `simpleError` HTTP helpers

**New scripts:**
- `npm run test` — run all tests
- `npm run test:watch` — watch mode
- `npm run test:coverage` — coverage report
- `npm run typecheck` — TypeScript type checking

### 3. CI Pipeline

Created `.github/workflows/ci.yml` that runs on pushes/PRs to `main`:
- Installs dependencies
- Generates Prisma client
- Runs linting, type checking, and tests with coverage

## Bugs Fixed

1. **Build completely broken** — 54 module-not-found errors from missing validation schema files. All 14 files created.

## Decisions & Tradeoffs

1. **Schema design matches existing patterns** — Schemas were designed to match the TypeScript interfaces already used by service functions rather than introducing new types, to minimize disruption.
2. **Vitest over Jest** — Vitest was chosen for its native ESM support, speed, and compatibility with the Vite/Next.js ecosystem.
3. **Type check `continue-on-error`** — There are pre-existing TypeScript errors in UI components (blog page, contact form, admin content page) unrelated to this change. The CI type check is set to `continue-on-error` to avoid blocking on these pre-existing issues.
4. **Google Fonts build failure** — The `next build` command fails in environments without internet access (CI, sandboxes) due to Google Fonts fetching. This is a known Next.js limitation when using `next/font/google` and is not caused by code changes.

## Remaining Risks / Next Steps

1. **Pre-existing TypeScript errors** — 7 files have type errors (blog slug page, case studies page, BlogCard, blog-data, ContactFormField, admin content page, users API route). These should be fixed in a follow-up.
2. **Integration/E2E tests** — Only unit tests are included. Integration tests for API routes and E2E tests for user journeys should be added.
3. **Console.log cleanup** — 4 files still use `console.log` in production code paths.
4. **Google Fonts** — Consider adding a fallback font strategy or using `next/font/local` for offline builds.
