import { stringify } from './json.js';

/**
 * Function that caches the results of the passed function to prevent double (expensive) computations.
 */
export const memoize = (fn: (...params: any) => any) => {
	const cache = new Map();
	return ((...args: any[]) => {
		const key = stringify(args);
		if (cache.has(key)) {
			return cache.get(key);
		}
		cache.set(key, fn(...args));
	}) as any;
};
