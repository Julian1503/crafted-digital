import { test, expect } from "@playwright/test";

test.describe("mobile menu", () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== "mobile", "mobile layout only");
    });

    test("opens, navigates and closes with Escape returning focus", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle").catch(() => {});
        const toggle = page.getByRole("button", { name: /open navigation menu/i });
        await toggle.click();
        const menu = page.locator("#mobile-menu");
        await expect(menu).toBeVisible();
        await expect(menu.getByRole("link", { name: "About" })).toBeVisible();

        await page.keyboard.press("Escape");
        await expect(menu).toHaveCount(0);
        await expect(page.getByRole("button", { name: /open navigation menu/i })).toBeFocused();
    });

    test("menu links reach their pages", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle").catch(() => {});
        await page.getByRole("button", { name: /open navigation menu/i }).click();
        await page.locator("#mobile-menu").getByRole("link", { name: "Case Studies" }).click();
        await expect(page).toHaveURL(/\/case-studies$/);
    });
});
