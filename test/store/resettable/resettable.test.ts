import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { resettable } from '../../../src/lib/store/resettable';

describe('Resettable stores', () => {
	it('should have a reset function', () => {
		const store = resettable(['foo', 'bar']);
		expect(typeof store.reset).toBe('function');
	});

	it('should should reset to original value', () => {
		const store = resettable('bar');
		store.set('foo');
		expect(get(store)).toBe('foo');
		store.reset();
		expect(get(store)).toBe('bar');
	});
});
