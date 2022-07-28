import { listen } from '../meta/index.js';

/**
 * Copies the textContent of the element (or a specified target) to clipboard on click.
 * Usage: <element use:copy={ target } />
 */
export const copy = (node: HTMLElement, target?: HTMLElement | string) => {
	let object = (typeof target === 'string' ? document.querySelector(target) : target) ?? node;

	const copyObject = () => {
		let text =
			object instanceof HTMLInputElement || object instanceof HTMLTextAreaElement
				? object.value
				: object.textContent || '';
		navigator.clipboard.writeText(text);
	};

	const unlisten = listen(node, 'click', copyObject);

	return {
		update: (target: HTMLElement | string) => {
			object = (typeof target === 'string' ? document.querySelector(target) : target) ?? node;
		},
		destroy: unlisten
	};
};

/**
 * Pastes the textContent of the clipboard into the textContent of the element (or a specified target)  on click.
 * Usage: <element use:paste={ target } />
 */
export const paste = (node: HTMLElement, target?: HTMLElement | string) => {
	let object = (typeof target === 'string' ? document.querySelector(target) : target) ?? node;

	const pasteObject = async () => {
		const text = await navigator.clipboard.readText();
		if (object instanceof HTMLInputElement || object instanceof HTMLTextAreaElement)
			object.value = text;
		else object.textContent = text;
	};

	const unlisten = listen(node, 'click', pasteObject);

	return {
		update: (target: HTMLElement | string) => {
			object = (typeof target === 'string' ? document.querySelector(target) : target) ?? node;
		},
		destroy: unlisten
	};
};
