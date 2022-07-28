import type { PlaywrightTestConfig } from '@playwright/experimental-ct-svelte';
import { devices } from '@playwright/experimental-ct-svelte';
import { resolve } from 'node:path';

/**
 * See https://playwright.dev/docs/test-components
 */
const config: PlaywrightTestConfig = {
	testDir: 'test',
	snapshotDir: '__snapshots__',
	fullyParallel: true,
	testMatch: '**/*.spec.ts',
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	reporter: [['html', { outputFolder: 'test/playwright-report' }]],
	use: {
		trace: 'on-first-retry',
		ctPort: 3100,
		ctViteConfig: {
			resolve: {
				alias: {
					// Setup the built-in $lib alias in SvelteKit
					'$lib': resolve('src/lib')
				}
			}
		},
		
		ctTemplateDir: 'test/playwright-template',
		ctCacheDir: 'test/playwright-template/.cache',
	},

	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome']
			}
		},
		{
			name: 'firefox',
			use: {
				...devices['Desktop Firefox']
			}
		},
		{
			name: 'webkit',
			use: {
				...devices['Desktop Safari']
			}
		}
	]
};

export default config;
