import { test, expect } from "@playwright/test";

const PUBLIC_PAGES = ["/", "/services", "/services/websites", "/services/custom-software", "/pricing", "/about-me", "/case-studies", "/contact", "/privacy", "/terms"];

test.describe("navigation", () => {
    test("every internal link on the home page resolves without a 404", async ({ page, request }) => {
        test.slow(); // crawls every internal URL; each one is a full server render
        await page.goto("/");
        const hrefs = await page.$$eval("a[href]", (as) =>
            Array.from(new Set(as.map((a) => a.getAttribute("href") ?? "")))
                .filter((h) => h.startsWith("/") && !h.startsWith("/#"))
        );
        expect(hrefs.length).toBeGreaterThan(0);
        const results = await Promise.all(
            hrefs.map(async (href) => ({ href, status: (await request.get(href.split("#")[0], { timeout: 90_000 })).status() }))
        );
        for (const { href, status } of results) {
            expect(status, `${href} should not 404`).toBeLessThan(400);
        }
    });

    test("header logo links to the home page", async ({ page }) => {
        await page.goto("/case-studies");
        const logo = page.locator('a[aria-label="Julian Delgado — Home"]');
        await expect(logo).toHaveAttribute("href", "/");
    });

    test("primary call to action leads to a live page", async ({ page }, testInfo) => {
        if (testInfo.project.name !== "desktop") {
            // Below 1024 px the header CTA lives inside the menu; the hero CTA is always on the page.
            await page.goto("/");
            await page.waitForLoadState("networkidle").catch(() => {});
            await page.getByRole("link", { name: /book a (30-minute )?call/i }).first().click();
        } else {
            await page.goto("/case-studies");
            const cta = page.getByRole("link", { name: /30-minute call/i }).first();
            await expect(cta).toBeVisible();
            await cta.click();
        }
        await expect(page).toHaveURL(/\/contact$/);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    for (const path of PUBLIC_PAGES) {
        test(`${path} renders without horizontal overflow`, async ({ page }) => {
            await page.goto(path);
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
            expect(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(0);
        });
    }
});
