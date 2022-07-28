import { listen, noop } from '../meta/index.js';

/**
 * Theme Toggler.
 * Sets the 'data-theme' attribute on the html to a theme or the next of a list of themes on click.
 * Usage: <element use:theme={['dark', 'light']} /> toggles between dark and light
 * Usage: <element use:theme={'dark'} /> sets theme to dark
 */
export const themetoggle = (node: HTMLElement, themes?: string | string[]) => {
	themes = themes ?? ['light', 'dark'];
	const target = document.documentElement;
	let theme = 0;

	const toggle = (themes: string[]) => {
		theme = (theme + 1) % themes.length;
		target.setAttribute('data-theme', themes[theme]);
	};

	const set = (themes: string) => {
		target.setAttribute('data-theme', themes);
	};

	const unlisten = listen(
		node,
		'click',
		typeof themes === 'string' ? () => set(<string>themes) : () => toggle(<string[]>themes)
	);

	return {
		update: noop,
		destroy: unlisten
	};
};
