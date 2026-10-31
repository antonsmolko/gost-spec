import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './checks',
  testMatch: '**/*.pw.ts',
  use: { baseURL: 'http://127.0.0.1:4187', browserName: 'chromium' },
  webServer: {
    command: 'npm run dev -- --port 4187 --strictPort',
    url: 'http://127.0.0.1:4187',
    reuseExistingServer: false,
  },
});
