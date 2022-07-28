import { noop } from '../meta/index.js';

/**
 * Focuses element when it mounts. Only works on focusable elements.
 * Usage: <element use:focus />
 */
export const focus = (node: HTMLElement) => {
	if (typeof node.focus === 'function') node.focus();

	return {
		update: noop,
		destroy: noop
	};
};
