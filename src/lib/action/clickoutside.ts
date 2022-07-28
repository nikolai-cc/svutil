import { listen, noop } from '../meta/index.js';

/**
 * Executes a function when clicking anywhere but on the target node.
 * Also dispatches the `clickoutside` event on the target node.
 * Usage: <element use:clickoutside={ handler } />
 */
export const clickoutside = (node: HTMLElement, handler?: (...params: any) => any) => {
	const handleClick = (event: PointerEvent) => {
		if (node.contains(event.target as HTMLElement)) return;
		handler && handler();
		node.dispatchEvent(new CustomEvent('clickoutside'));
	};
	const unlisten = listen(document, 'click', handleClick as EventListenerOrEventListenerObject);

	return {
		update: noop,
		destroy: unlisten
	};
};
