import { test, expect } from "@playwright/test";

/**
 * Precondition: the dev server points at a database with at least the seeded
 * published case studies; the sitemap test walks every listed URL.
 */
const PAGES = ["/", "/services", "/services/websites", "/services/custom-software", "/pricing", "/about-me", "/case-studies", "/contact", "/privacy", "/terms"];

test.describe("seo basics", () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== "desktop", "run once");
    });

    for (const path of PAGES) {
        test(`${path} has exactly one exposed h1 and its own canonical`, async ({ page }) => {
            await page.goto(path);
            const h1s = await page.evaluate(() =>
                Array.from(document.querySelectorAll("h1")).filter((h) => {
                    const cs = getComputedStyle(h);
                    const hidden = cs.visibility === "hidden" || cs.display === "none" || h.closest("[aria-hidden='true']");
                    return !hidden;
                }).length
            );
            expect(h1s, `${path} exposed h1 count`).toBe(1);
            const canonical = (await page.locator("link[rel=canonical]").getAttribute("href")) ?? "";
            expect(canonical.replace(/\/$/, "")).toBe(`https://juliandelgado.com.au${path === "/" ? "" : path}`);
        });
    }

    test("home h1 states the offer, not just the name", async ({ page }) => {
        await page.goto("/");
        const h1 = page.getByRole("heading", { level: 1 });
        await expect(h1).toHaveCount(1);
        await expect(h1).toContainText(/software|websites|automation/i);
    });

    test("an unknown case study is a real 404, not a 200 with a sorry page", async ({ request }) => {
        const res = await request.get("/case-studies/this-slug-does-not-exist");
        expect(res.status()).toBe(404);
    });

    test("llms.txt and pricing.md are served as text", async ({ request }) => {
        const llms = await request.get("/llms.txt");
        expect(llms.status()).toBe(200);
        expect(llms.headers()["content-type"]).toContain("text/plain");
        expect(await llms.text()).toContain("# Julian Delgado");
        const pricing = await request.get("/pricing.md");
        expect(pricing.status()).toBe(200);
        expect(pricing.headers()["content-type"]).toContain("text/markdown");
    });

    test("login is not indexable", async ({ page }) => {
        await page.goto("/login");
        const robots = await page.locator("meta[name=robots]").getAttribute("content");
        expect(robots).toMatch(/noindex/);
    });

    test("sitemap only lists URLs that exist", async ({ request }) => {
        const res = await request.get("/sitemap.xml");
        expect(res.ok()).toBeTruthy();
        const xml = await res.text();
        const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].replace("https://juliandelgado.com.au", ""));
        expect(locs.length).toBeGreaterThan(3);
        for (const loc of locs) {
            const r = await request.get(loc || "/");
            expect(r.status(), `${loc} in sitemap`).toBeLessThan(400);
        }
    });

    test("robots blocks admin but leaves login crawlable for its noindex tag", async ({ request }) => {
        const txt = await (await request.get("/robots.txt")).text();
        expect(txt).toContain("Disallow: /admin/");
        expect(txt).not.toContain("Disallow: /login");
    });

    test("security headers are present", async ({ request }) => {
        const res = await request.get("/");
        const h = res.headers();
        expect(h["x-content-type-options"]).toBe("nosniff");
        expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
        expect(h["x-powered-by"]).toBeUndefined();
    });
});
