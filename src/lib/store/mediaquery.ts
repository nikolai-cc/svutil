import { listen } from '../meta/index.js';
import { browser } from '$app/env';
import { writable, type Readable } from 'svelte/store';

/**
 * This is a readable store that syncs to the state of a media query.
 * It uses window.MatchMedia under the hood.
 * Initialise the query with `let query = mediaquery(media, value)`,
 * then track the state of the query by subscribing to the store using `$query`.
 * Usage: `let darkMode = mediaquery('prefers-color-scheme', 'dark');` `$darkMode`
 * There are many built-in stores available in `svu/store`!
 */
export const mediaquery = (media: string, value?: string) => {
	media = value ? `(${media}: ${value})` : media;

	const { subscribe, set } = writable();

	if (!browser) return { subscribe };

	const update = (e: MediaQueryListEvent) => {
		set(e.matches);
	};
	const query = window.matchMedia(media);
	const unlisten = listen(query, 'change', update as EventListener);

	set(query.matches);
	const unsubscribe = () => unlisten();

	return { subscribe, unsubscribe };
};
