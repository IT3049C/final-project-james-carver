import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    viewport: { width: 1200, height: 800 },
  },
  webServer: {
    // Only start the preview server; assume build is already done
    command: "npm run preview",
    url: "http://localhost:5173",
    timeout: 180_000,           // give extra time for Vite preview to start
    reuseExistingServer: true,  // reuse server if already running
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
