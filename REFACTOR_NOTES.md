# Refactor Notes

## Summary

This PR applies SOLID/Clean Code principles across the codebase: eliminates duplicated code, splits large files by responsibility, and extracts shared utilities and hooks.

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
- 122 unit tests across 14 test files covering:
  - All 14 validation schemas (valid inputs, required fields, optional fields, edge cases)
  - `normalizeFolder` utility (sanitization, traversal prevention, edge cases)
  - `toValidationError` and `simpleError` HTTP helpers
  - `slugify` utility (special chars, whitespace, edge cases)
  - `makePseudoAssetFromUrl` (URL parsing, filename extraction)
  - `computeFractionalChanges` (reorder algorithm, swaps, edge cases)
  - Status badge constants (complete key coverage)

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
2. **Content page TypeScript error** — `enterReorderMode` was creating `SortableListItem` objects without the required `sortOrder` field. Fixed by including `b.sortOrder`.
3. **Case-studies error handling bug** — `err?.error != null ? err.error.messages` used loose equality and accessed a potentially non-existent `.messages` property. Fixed with optional chaining: `err?.error?.messages ?? "Request failed"`.
4. **Case-studies debug console.log** — Removed leftover `console.log(err.error)` from case-studies form submit handler.

## SOLID/Clean Code Refactoring

### Extracted Shared Components
- **`AdminDialog`** (`src/components/admin/AdminDialog.tsx`) — Replaced 13 identical `Dialog` function definitions across all admin pages and MediaPicker
- **`slugify`** (`src/lib/utils.ts`) — Shared slug generation, previously duplicated in blog and case-studies
- **`makePseudoAssetFromUrl`** (`src/lib/media/make-pseudo-asset.ts`) — Shared MediaAsset factory from URL, previously duplicated in blog and case-studies
- **Status badge constants** (`src/lib/constants.ts`) — `STATUS_BADGE`, `LEAD_STATUS_COLORS`, `BOOKING_STATUS_COLORS`, previously duplicated across 4 pages

### Extracted Shared Hook
- **`useReorder`** (`src/hooks/use-reorder.ts`) — Shared reorder mode state and save logic, supporting both "fractional indexing" (blog, case-studies) and "ids" (content) modes. Also exports `computeFractionalChanges` as a pure, testable function.

### Split Large Admin Pages
| Page | Before | After | Extracted |
|------|--------|-------|-----------|
| Blog | 1,032 | 501 | `BlogFormDialog` (290), `blog.types` (29) |
| Case Studies | 929 | 400 | `CaseStudyFormDialog` (280), `case-study.types` (30) |
| Leads | 842 | 391 | `LeadFormDialog` (150), `LeadDetailDrawer` (170), `lead.types` (25) |
| Bookings | 864 | 443 | `BookingFormDialog` (160), `BookingDetailDrawer` (180), `booking.types` (25) |
| Content | 567 | 479 | (used shared hook) |

## Decisions & Tradeoffs

1. **Schema design matches existing patterns** — Schemas were designed to match the TypeScript interfaces already used by service functions rather than introducing new types, to minimize disruption.
2. **Vitest over Jest** — Vitest was chosen for its native ESM support, speed, and compatibility with the Vite/Next.js ecosystem.
3. **Type check `continue-on-error`** — There are pre-existing TypeScript errors in UI components (blog page, contact form, admin content page) unrelated to this change. The CI type check is set to `continue-on-error` to avoid blocking on these pre-existing issues.
4. **Google Fonts build failure** — The `next build` command fails in environments without internet access (CI, sandboxes) due to Google Fonts fetching. This is a known Next.js limitation when using `next/font/google` and is not caused by code changes.

## Remaining Risks / Next Steps

1. **Pre-existing TypeScript errors** — 6 files still have type errors (blog slug page, case studies slug page, BlogCard, blog-data, ContactFormField, media upload route). These should be fixed in a follow-up.
2. **Integration/E2E tests** — Only unit tests are included. Integration tests for API routes and E2E tests for user journeys should be added.
3. **Console.log cleanup** — Some files may still use `console.log` in production code paths.
4. **Google Fonts** — Consider adding a fallback font strategy or using `next/font/local` for offline builds.
5. **Further page splitting** — Media (783 lines), coupons (724 lines), plans (604 lines) could benefit from the same form dialog extraction pattern.
