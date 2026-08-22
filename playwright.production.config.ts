import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",

  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: 0,

  workers: 1,

  reporter: [["list"]],

  use: {
    baseURL: "http://localhost:3001",

    trace: "retain-on-failure",

    screenshot: "only-on-failure",

    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  webServer: {
    command:
      'APP_URL="http://localhost:3001" NEXTAUTH_URL="http://localhost:3001" npm run start -- -p 3001',
    url: "http://localhost:3001/api/live",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
