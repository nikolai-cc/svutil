import { listen, noop, timeout } from '../meta/index.js';

/**
 * Dispatches an event or calls a handler if released within 'duration' milliseconds.
 * Starts checking after optional 'delay' milliseconds.
 * Usage: <element use:timedclick={{ duration: 500, delay: 100 }} on:timedclick={ () => console.log('hello') } />
 */
export const timedclick = (
	node: HTMLElement,
	options: { duration: number; delay: number; fn?: Function } | number
) => {
	let duration = typeof options === 'number' ? options : options.duration;
	let delay = typeof options === 'number' ? 0 : options.delay || 0;
	let fn = typeof options === 'number' ? noop : options.fn || noop;

	const start = () => {
		const dispatch = () => {
			fn();
			node.dispatchEvent(new CustomEvent('timedclick', { detail: { delay, duration } }));

			unlistenUp();
			unlistenOut();
			clearAbort();
		};

		const abort = () => {
			node.dispatchEvent(new CustomEvent('timedclick:aborted', { detail: { delay, duration } }));
			unlistenUp();
			unlistenOut();
			clearCheck();
			clearAbort();
		};

		const check = () => {
			node.dispatchEvent(new CustomEvent('timedclick:armed', { detail: { delay, duration } }));
			unlistenUp();
			unlistenOut();
			unlistenUp = listen(node, 'pointerup', dispatch);
		};

		const clearCheck = timeout(check, delay);
		const clearAbort = timeout(abort, delay + duration);

		let unlistenUp = listen(node, 'pointerup', abort);
		const unlistenOut = listen(node, 'pointerout', abort);
	};

	const unlisten = listen(node, 'pointerdown', start);

	return {
		update: (options: { duration: number; delay: number; fn?: Function } | number) => {
			duration = typeof options === 'number' ? options : options.duration;
			delay = typeof options === 'number' ? 0 : options.delay || 0;
			fn = typeof options === 'number' ? noop : options.fn || noop;
		},
		destroy: unlisten
	};
};
