import { browser } from '$app/env';
import { derived, writable } from 'svelte/store';
import { listen } from '../meta/index.js';

const createSize = (prop: 'innerWidth' | 'innerHeight') => {
	const { subscribe, set } = writable(0);
	if (!browser) return { subscribe };
	set(window[prop]);
	listen(window, 'resize', () => set(window[prop]));
	return { subscribe };
};

/**
 * Svelte store that tracks the window width.
 */
export const ww = createSize('innerWidth');

/**
 * Svelte store that tracks the window height.
 */
export const wh = createSize('innerHeight');

/**
 * Svelte store that tracks the window size.
 */
export const windowSize = derived([ww, wh], ([$ww, $wh]) => ({ w: $ww, h: $wh }));

const createScroll = (prop: 'scrollX' | 'scrollY') => {
	const { subscribe, set } = writable(0);
	if (!browser) return { subscribe };
	set(window[prop]);
	listen(window, 'scroll', () => set(window[prop]));
	return { subscribe };
};

/**
 * Svelte store that tracks the scroll x position.
 */
export const sx = createScroll('scrollX');

/**
 * Svelte store that tracks the scroll y position.
 */
export const sy = createScroll('scrollY');

/**
 * Svelte store that tracks the scroll position.
 */
export const scroll = derived([sx, sy], ([$sx, $sy]) => ({ x: $sx, y: $sy }));
