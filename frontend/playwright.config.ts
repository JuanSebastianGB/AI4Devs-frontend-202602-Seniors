import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const backendDir = path.resolve(__dirname, '..', 'backend');
const frontendUrl = 'http://localhost:3000';
const apiReadyUrl = 'http://localhost:3010/';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: frontendUrl,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'pnpm run dev',
      cwd: backendDir,
      url: apiReadyUrl,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'pnpm run start',
      cwd: __dirname,
      url: frontendUrl,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        BROWSER: 'none',
        PORT: '3000',
      },
    },
  ],
});
