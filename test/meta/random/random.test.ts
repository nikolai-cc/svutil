import { describe, expect, it } from 'vitest';
import { random } from '../../../src/lib/meta';

describe('Random meta utility', () => {
	it('should give a random number from 0 to number if only one parameter is provided', () => {
		const numbers: number[] = [];
		for (let i = 0; i < 10_000; i++) {
			numbers.push(random(100));
		}
		expect(numbers.some((n) => n < 0)).toBeFalsy();
		expect(numbers.some((n) => n > 100)).toBeFalsy();
	});
});
