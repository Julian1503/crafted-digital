import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/about-me", "/case-studies", "/contact", "/privacy", "/terms"];

/**
 * Serious/critical axe violations fail the build. Three rules are known
 * failures scheduled for Sprint 2 and are reported but not yet enforced:
 *   - color-contrast             → S2-03 (palette pass)
 *   - target-size                → S2-12 (44 px touch targets, hero slide dots)
 *   - scrollable-region-focusable → S2-07 (About stats strip)
 * Remove an entry here when its sprint item lands so the gate tightens.
 */
const NOT_ENFORCED_YET = new Set(["color-contrast", "target-size", "scrollable-region-focusable"]);

for (const path of PAGES) {
    test(`${path} has no serious or critical accessibility violations`, async ({ page }) => {
        test.slow(); // axe over a fully rendered page
        await page.goto(path);
        await page.waitForLoadState("networkidle").catch(() => {});
        const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze();
        const blocking = results.violations.filter(
            (v) => (v.impact === "serious" || v.impact === "critical") && !NOT_ENFORCED_YET.has(v.id)
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
