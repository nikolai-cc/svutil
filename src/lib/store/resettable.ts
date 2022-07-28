import { writable, type StartStopNotifier } from 'svelte/store';
import { clone } from '../meta/index.js';

/**
 * Resettable writable store. Allows any values (including objects).
 */
export const resettable = (value: any, start?: StartStopNotifier<any>) => {
	const { subscribe, update, set } = writable(clone(value), start);
	const reset = () => set(value);
	return { subscribe, update, set, reset };
};
