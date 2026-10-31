import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PORT ?? "3000";
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: false,
    workers: 1,
    retries: process.env.CI ? 1 : 0,
    // The dev server renders every ISR page on request against a remote
    // database, so individual pages can take 5-15 s. Budget accordingly.
    timeout: 120_000,
    expect: { timeout: 15_000 },
    reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
    use: {
        baseURL,
        navigationTimeout: 60_000,
        actionTimeout: 30_000,
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
    },
    webServer: {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 180_000,
    },
    projects: [
        { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
        { name: "tablet",  use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } } },
        { name: "mobile",  use: { ...devices["Pixel 7"], viewport: { width: 320, height: 700 } } },
    ],
});
