import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/services", "/services/websites", "/services/custom-software", "/pricing", "/about-me", "/case-studies", "/contact", "/privacy", "/terms"];

/** Serious and critical axe violations fail the build. */
for (const path of PAGES) {
    test(`${path} has no serious or critical accessibility violations`, async ({ page }) => {
        test.slow(); // axe over a fully rendered page
        await page.goto(path);
        await page.waitForLoadState("networkidle").catch(() => {});
        // Sections fade in over ~900 ms; axe must sample the settled colours.
        await page.waitForTimeout(1200);
        const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze();
        const blocking = results.violations.filter(
            (v) => v.impact === "serious" || v.impact === "critical"
        );
        const summary = blocking.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target.join(" ")}`).join("\n");
        expect(blocking, summary).toEqual([]);
    });
}

test("reduced motion disables autoplaying media", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto("/contact");
    await expect(page.locator("#contact video")).toHaveCount(0);
    await context.close();
});
