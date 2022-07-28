import { noop, listen } from '../meta/index.js';

// This list originates from: https://stackoverflow.com/a/30753870
const FOCUSABLE = `
    a[href]:not([tabindex='-1']),
    area[href]:not([tabindex='-1']),
    input:not([disabled]):not([tabindex='-1']),
    select:not([disabled]):not([tabindex='-1']),
    textarea:not([disabled]):not([tabindex='-1']),
    button:not([disabled]):not([tabindex='-1']),
    iframe:not([tabindex='-1']),
    [tabindex]:not([tabindex='-1']),
    [contentEditable=true]:not([tabindex='-1'])
`;

/**
 * Traps focus within an element. Only works on focusable elements.
 * Usage: <element use:focustrap />
 */
export const focustrap = (node: HTMLElement) => {
	const focusable: HTMLElement[] = Array.from(node.querySelectorAll(FOCUSABLE));

	focusable[0].focus();

	const reFocus = (e: FocusEvent) => {
		!focusable.includes(e.relatedTarget as HTMLElement) && (e.target as HTMLElement).focus();
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Tab') {
			e.shiftKey
				? (e.preventDefault(),
				  focusable[
						(focusable.indexOf(e.target as HTMLElement) - 1 + focusable.length) % focusable.length
				  ].focus())
				: (e.preventDefault(),
				  focusable[(focusable.indexOf(e.target as HTMLElement) + 1) % focusable.length].focus());
		}
		if (e.key === 'Escape') {
			cancel();
		}
	};

	const unlistenFocusOut = listen(node, 'focusout', reFocus as EventListener);
	const unlistenKeyDown = listen(window, 'keydown', handleKeyDown as EventListener);

	const cancel = () => {
		unlistenFocusOut();
		unlistenKeyDown();
	};

	return {
		update: noop,
		destroy: cancel
	};
};
