import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './checks', testMatch: '**/*.pw.ts',
  use: { baseURL: 'http://127.0.0.1:4195', browserName: 'chromium' },
  webServer: { command: 'npm run dev -- --port 4195 --strictPort',
    url: 'http://127.0.0.1:4195', reuseExistingServer: false },
});
