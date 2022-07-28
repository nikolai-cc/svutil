import { listen } from '../meta/index.js';

/**
 * Downloads the textContent of the element (or a specified target) into a .txt file on click.
 * Usage: <element use:download={{ name: 'Document.txt' }} />
 */
export const download = (
	node: HTMLElement,
	options?: { target?: HTMLElement; name?: string } | HTMLElement
) => {
	let object = options instanceof HTMLElement ? options : options?.target ?? node;
	let name = options instanceof HTMLElement ? 'download.txt' : options?.name ?? 'download.txt';

	const downloadObject = () => {
		const text = object instanceof HTMLInputElement ? object.value : object.textContent || '';
		const blob = new Blob([text], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = name;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const unlisten = listen(node, 'click', downloadObject);

	return {
		update: (options?: { target?: HTMLElement; name?: string } | HTMLElement) => {
			object = options instanceof HTMLElement ? options : options?.target ?? node;
			name = options instanceof HTMLElement ? 'download.txt' : options?.name ?? 'download.txt';
		},
		destroy: unlisten
	};
};
