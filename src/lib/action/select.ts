import { listen } from '../meta/index.js';

/**
 * Selects the content of the element (or a specified target) on click.
 * If the element is an input element, it selects the value, otherwise it selects all child nodes.
 * Usage: <element use:select={ target } />
 */
export const select = (node: HTMLElement, target?: HTMLElement) => {
	let object = target ?? node;

	const selectObject = () => {
		// Check if the element is an input element
		if (object instanceof HTMLInputElement) return object.select();

		// Otherwise select all child nodes if they exist.
		if (!window.getSelection()) return;
		if (!object.hasChildNodes()) return;

		const range = document.createRange();
		const selection = window.getSelection() as Selection;
		const firstChild = object.firstChild as Node;
		const lastChild = object.lastChild as Node;

		range.setStart(firstChild, 0);
		range.setEndAfter(lastChild);
		selection.removeAllRanges();
		selection.addRange(range);
		object.focus();
	};

	const unlisten = listen(node, 'click', selectObject);

	return {
		update: (target: HTMLElement) => (object = target ?? node),
		destroy: unlisten
	};
};
