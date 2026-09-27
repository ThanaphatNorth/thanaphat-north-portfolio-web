import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT || 3200);
const MOCK_PORT = 54329;
const env = {
  NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${MOCK_PORT}`,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "e2e-anon-key",
  // Contact notifications go to the mock's fake Discord webhook, never the real one.
  DISCORD_CONTACT_WEBHOOK_URL: `http://127.0.0.1:${MOCK_PORT}/api/webhooks/1/e2e-token`,
  DISCORD_WEBHOOK_ALLOW_LOCAL: "1",
};

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/.results",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { outputFolder: "e2e/.report", open: "never" }]],
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
  },
  projects: [
    { name: "unit", testMatch: /\.unit\.spec\.ts/ },
    { name: "desktop", testMatch: /home\.spec\.ts/, use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", testMatch: /mobile\.spec\.ts/, use: { ...devices["Pixel 7"] } },
    { name: "reduced-motion", testMatch: /reduced-motion\.spec\.ts/, use: { ...devices["Desktop Chrome"], reducedMotion: "reduce" } },
    {
      // Long cinematic walkthrough recorded to video with a visible cursor (npm run e2e:video).
      name: "showcase",
      testMatch: /showcase\.spec\.ts/,
      timeout: 240_000,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        video: { mode: "on", size: { width: 1440, height: 900 } },
      },
    },
  ],
  webServer: [
    {
      command: `node e2e/mock-supabase.mjs`,
      url: `http://127.0.0.1:${MOCK_PORT}/rest/v1/site_settings`,
      reuseExistingServer: !process.env.CI,
      env: { MOCK_SUPABASE_PORT: String(MOCK_PORT) },
    },
    {
      command: `npx next build && npx next start -p ${PORT}`,
      url: `http://localhost:${PORT}`,
      timeout: 300_000,
      reuseExistingServer: !process.env.CI,
      env,
    },
  ],
});
