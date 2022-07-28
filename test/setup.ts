import fs from 'node:fs';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

/**
 * This script sets up tests for vitest and playwright
 */

// Making sure .svelte-kit/tsconfig is present (needed for vitest test runner to work)
if (!(fs.existsSync('./.svelte-kit/tsconfig.json'))) {
	console.log('No tsconfig found, running svelte-kit build.')
	const run = promisify(exec);
	await run('npm run build');
}
// Making sure .svelte-kit/output is present (needed for playwright test runner to work)
else if (!(fs.existsSync('./.svelte-kit/output'))) {
	console.log('No output directory found, running svelte-kit build.')
	const run = promisify(exec);
	await run('npm run build');
} else {
	console.log('Output directory found, running test suite.')
}