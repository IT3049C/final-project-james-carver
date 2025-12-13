import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    viewport: { width: 1200, height: 800 },
  },
  webServer: {

    command: "npm run preview",
    url: "http://localhost:5173",
    timeout: 180_000,           
    reuseExistingServer: true,  
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
