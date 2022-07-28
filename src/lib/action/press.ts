import { listen, noop, timeout } from '../meta/index.js';

/**
 * Dispatches a press event or calls a handler if pressed down for duration milliseconds.
 * Usage: <element use:press={{ duration: 500 }} on:press={ () => console.log('hello') } />
 */
export const press = (
	node: HTMLElement,
	options: { duration: number; handler?: (...params: any) => any } | number
) => {
	let duration = typeof options === 'number' ? options : options.duration;
	let handler = typeof options === 'number' ? noop : options.handler || noop;

	const start = () => {
		const dispatch = () => {
			handler();
			node.dispatchEvent(new CustomEvent('press', { detail: duration }));

			unlistenUp();
			unlistenOut();
		};

		const clear = timeout(dispatch, duration);
		const unlistenUp = listen(node, 'pointerup', clear);
		const unlistenOut = listen(node, 'pointerout', clear);
	};

	const unlisten = listen(node, 'pointerdown', start);

	return {
		update: (options: { duration: number; handler?: (...params: any) => any } | number) => {
			duration = typeof options === 'number' ? options : options.duration;
			handler = typeof options === 'number' ? noop : options.handler || noop;
		},
		destroy: unlisten
	};
};
