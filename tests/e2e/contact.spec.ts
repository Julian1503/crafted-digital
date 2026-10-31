import { test, expect, type Page } from "@playwright/test";

async function fillForm(page: Page) {
    await page.getByLabel(/^Name/).fill("Test Person");
    await page.getByLabel(/^Email/).fill("e2e-test@example.com");
    await page.getByRole("checkbox", { name: "Website" }).click();
    await page.getByLabel(/^Message/).fill("This is an end-to-end test message with enough detail.");
}

test.describe("contact form", () => {
    test("shows the success state only when the API confirms", async ({ page }) => {
        await page.route("**/api/contact", (route) =>
            route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
        );
        await page.goto("/contact");
        await fillForm(page);
        await page.getByRole("button", { name: /send message/i }).click();
        await expect(page.getByRole("status")).toContainText(/reply within 24 hours/i);
    });

    test("a 500 from the API keeps the form and shows an error", async ({ page }) => {
        await page.route("**/api/contact", (route) =>
            route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: { code: "INTERNAL_ERROR", message: "boom" } }) })
        );
        await page.goto("/contact");
        await fillForm(page);
        await page.getByRole("button", { name: /send message/i }).click();
        await expect(page.getByText(/couldn't send your message/i).first()).toBeVisible();
        await expect(page.getByRole("status")).toHaveCount(0);
        await expect(page.getByLabel(/^Name/)).toHaveValue("Test Person");
    });

    test("a 429 from the API explains the wait", async ({ page }) => {
        await page.route("**/api/contact", (route) =>
            route.fulfill({ status: 429, contentType: "application/json", body: JSON.stringify({ error: { code: "RATE_LIMIT_EXCEEDED", message: "Rate limit exceeded", retryAfter: 1800 } }) })
        );
        await page.goto("/contact");
        await fillForm(page);
        await page.getByRole("button", { name: /send message/i }).click();
        await expect(page.getByText(/too many messages/i).first()).toBeVisible();
    });

    test("the contact page offers the booking calendar with a plain-link fallback", async ({ page }) => {
        await page.goto("/contact");
        await expect(page.getByRole("link", { name: /pick a time/i })).toHaveAttribute("href", "#book");
        await expect(page.locator("#book")).toBeVisible();
        const fallback = page.getByRole("link", { name: /open the booking page/i });
        await expect(fallback).toHaveAttribute("href", /^https:\/\/cal\.com\//);
    });

    test("client-side validation announces the missing fields", async ({ page }) => {
        await page.goto("/contact");
        await page.getByRole("button", { name: /send message/i }).click();
        const summary = page.getByRole("alert").first();
        await expect(summary).toContainText(/please check/i);
        await expect(page.getByLabel(/^Name/)).toHaveAttribute("aria-invalid", "true");
    });

    test("the form is visible near the top of the contact section on small screens", async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "mobile", "mobile layout only");
        await page.goto("/contact");
        const heading = page.getByRole("heading", { level: 1 });
        const nameField = page.getByLabel(/^Name/);
        const hTop = await heading.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
        const fTop = await nameField.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
        expect(fTop - hTop, "form starts too far below the heading").toBeLessThan(900);
        await expect(page.locator("#contact video")).toHaveCount(0);
    });
});

/**
 * These hit the real route. Only the honeypot path and validation failures are
 * exercised, so no email is ever sent and no RESEND_API_KEY is required.
 */
test.describe("contact API", () => {
    test("honeypot submissions return ok without sending", async ({ request }) => {
        const res = await request.post("/api/contact", {
            data: {
                name: "Bot", email: "bot@example.com", message: "I am definitely a human being here.",
                topics: ["Other"], hp: "filled by a bot",
            },
        });
        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body).toMatchObject({ ok: true, skipped: true });
    });

    test("invalid payloads are rejected with 400 and field errors", async ({ request }) => {
        const res = await request.post("/api/contact", { data: { name: "", email: "nope", message: "short", topics: [] } });
        expect(res.status()).toBe(400);
        const body = await res.json();
        expect(body.error.code).toBeTruthy();
    });

    test("malformed JSON is a 400, not a 500", async ({ request }) => {
        const res = await request.post("/api/contact", { headers: { "content-type": "application/json" }, data: "{not json" });
        expect(res.status()).toBe(400);
    });
});
