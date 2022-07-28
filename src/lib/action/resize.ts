import { noop } from '../meta/index.js';

/**
 * Dispatches an event or calls a handler if an element is resized.
 * Usage: <element use:resize={{ handler: () => console.log('hello') }} />
 * For tracking <window> size it's best to use the window store from svu/client.
 */
export const resize = (node: HTMLElement, options?: { handler?: (...params: any) => any }) => {
	let handler = options?.handler || noop;

	const handleResize = (entries: ResizeObserverEntry[]) => {
		entries.forEach((e) => {
			if (e.target !== node) return;
			handler();
			node.dispatchEvent(new CustomEvent('resize', { detail: e.target }));
		});
	};

	const observer = new ResizeObserver(handleResize);
	observer.observe(node);

	return {
		update: (options?: { handler?: (...params: any) => any }) => {
			handler = options?.handler || noop;
		},
		destroy: () => observer.disconnect()
	};
};
