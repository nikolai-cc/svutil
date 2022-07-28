import { listen } from '../meta/index.js';

/**
 * Allows positioning of an element by dragging it from the element or an optional handle.
 * Emits 'drag:start', 'drag:move', 'drag:end' events. Update the `pos` property to change programmatically.
 * Uses translate3d to improve performance.
 * Usage: <element use:draggable={ pos: { x: 0, y: 0 } } />
 */
export const draggable = (
	node: HTMLElement,
	options: { pos?: { x: number; y: number }; handle?: HTMLElement } = {}
) => {
	let { pos = { x: 0, y: 0 }, handle = node } = options;

	let origin = pos;

	const startDrag = (e: PointerEvent) => {
		e.preventDefault();
		e.stopPropagation();
		node.setPointerCapture(e.pointerId);

		origin = { x: e.clientX, y: e.clientY };

		node.dispatchEvent(new CustomEvent('drag:start'));

		const drag = (e: PointerEvent) => {
			e.preventDefault();
			e.stopPropagation();

			pos.x += e.clientX - origin.x;
			pos.y += e.clientY - origin.y;

			draw();

			origin = { x: e.clientX, y: e.clientY };

			node.dispatchEvent(new CustomEvent('drag:update', { detail: { pos } }));
		};

		const endDrag = (e: PointerEvent) => {
			e.preventDefault();
			e.stopPropagation();
			node.releasePointerCapture(e.pointerId);
			unlistenMove();
			unlistenUp();

			node.dispatchEvent(new CustomEvent('drag:end', { detail: { pos } }));
		};

		const unlistenMove = listen(document, 'pointermove', drag as EventListener);
		const unlistenUp = listen(document, 'pointerup', endDrag as EventListener);
	};

	const draw = () => {
		node.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
	};

	const unlisten = listen(handle, 'pointerdown', startDrag as EventListener);
	const unlistenTouchStart = listen(handle, 'touchstart', (e) => e.preventDefault());

	return {
		update: (options: { pos?: { x: number; y: number }; handle?: HTMLElement }) => {
			pos = options.pos ?? pos;
			draw();
		},
		destroy: () => {
			unlisten();
			unlistenTouchStart();
		}
	};
};
