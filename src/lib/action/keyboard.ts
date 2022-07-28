import { listen, noop, capitalise } from '../meta/index.js';

export type keyMap = { [key: string]: Function };

/**
 * Takes an `keyboard shortcut` string: e.g. `'shift+cmd+a'` and returns a string that normalises `meta`/`cmd`/`win` to `'Super'`,
 * returns modifiers capitalised and in alphabetical order, and returns the key in capitalised form.
 * Keys and modifiers should be separated by a `+`, and the key to test for comes last.
 * Invalid modifer keys will be ignored.
 */
const sanitise = (keyString: string): string => {
	const keys = keyString.split('+').map((k) => capitalise(k));
	const key = keys.pop();
	const alt = keys.includes('Alt') ? 'Alt+' : '';
	const ctrl = keys.includes('Control') || keys.includes('Ctrl') ? 'Control+' : '';
	const meta =
		keys.includes('Meta') ||
		keys.includes('Super') ||
		keys.includes('Command') ||
		keys.includes('Cmd') ||
		keys.includes('Win')
			? 'Meta+'
			: '';
	const shift = keys.includes('Shift') ? 'Shift+' : '';
	return alt + ctrl + meta + shift + key;
};

/**
 * Takes a keyMap and returns it with its key strings sanitised.
 */
function sanitizeKeyMap(keyMap: keyMap) {
	const shortcuts: keyMap = {};
	for (const [key, fn] of Object.entries(keyMap)) {
		shortcuts[sanitise(key)] = fn;
	}
	return shortcuts;
}

/**
 * Takes a sanitised key string and returns an object that matches the key and modifiers of the keyboardEvent.
 */
const decode = (keyString: string) => {
	const keys = keyString.split('+');
	return {
		key: keys.pop(),
		altKey: keys.includes('Alt'),
		ctrlKey: keys.includes('Ctrl'),
		metaKey: keys.includes('Meta'),
		shiftKey: keys.includes('Shift')
	};
};

/**
 * Takes a KeyboardEvent and returns a key string that matches a `keyboard shortcut` string after sanitisation.
 */
const encode = (e: KeyboardEvent): string => {
	const alt = e.key !== 'Alt' && e.altKey ? 'Alt+' : '';
	const ctrl = e.key !== 'Control' && e.ctrlKey ? 'Control+' : '';
	const meta = e.key !== 'Meta' && e.metaKey ? 'Meta+' : '';
	const shift = e.key !== 'Shift' && e.shiftKey ? 'Shift+' : '';
	return alt + ctrl + meta + shift + capitalise(e.key);
};

/**
 * Executes functions on keydown. Pass in a map of shortcuts to functions.
 * You can pass in modifier keys with the + symbol. The key to test for always comes last.
 * We sanitise modifiers (e.g. change `cmd` to `Meta`), if we are unable to match an invalid modifier, it is ignored.
 * Usage: <element use:keydown={{ 'Shift+Enter': handler() }} />
 * The action is fully reactive, so feel free to pass in a variable as the shortcut or handler.
 */
export const keydown = (node: HTMLElement, keys: keyMap) => {
	let shortcuts: keyMap = sanitizeKeyMap(keys);

	const execute = (e: KeyboardEvent) => {
		shortcuts[encode(e)]?.(e);
	};

	const unlisten = listen(node, 'keydown', execute as EventListener);

	return {
		update: (keys: keyMap) => {
			shortcuts = sanitizeKeyMap(keys);
		},
		destroy: unlisten
	};
};

/**
 * Executes functions on keyup. Pass in a map of key names to functions.
 * You can pass in modifier keys with the + symbol. The key to test for always comes last.
 * We sanitise modifiers (e.g. change `cmd` to `Meta`), if we are unable to match an invalid modifier, it is ignored.
 * Usage: <element use:keydown={{ 'Shift+Enter': handler() }} />
 * The action is fully reactive, so feel free to pass in a variable as the shortcut or handler.
 */
export const keyup = (node: HTMLElement, keys: keyMap) => {
	let shortcuts = sanitizeKeyMap(keys);
	const execute = (e: KeyboardEvent) => {
		shortcuts[encode(e)]?.(e);
	};

	const unlisten = listen(node, 'keyup', execute as EventListener);

	return {
		update: (keys: keyMap) => {
			shortcuts = sanitizeKeyMap(keys);
		},
		destroy: unlisten
	};
};
