import { browser } from '$app/env';
import { noop, stringify, parse } from '../meta/index.js';
import { writable } from 'svelte/store';

/**
 * A writable store that is synced with localstorage.
 * TODO: handle errors in localstorage.getItem and localstorage.setItem (e.g. the value has changed)
 * TODO: handle non-JSON-parseable values (e.g. Date objects)??
 */
export const localstore = (key: string, value: any) => {
	if (!browser || !window || !available()) {
		return {
			...writable(value),
			clear: noop
		};
	}

	value = parse(getItem(key)) ?? value;
	setItem(key, value);

	const { subscribe, set: setStore } = writable(value);

	window.addEventListener('storage', (e) => {
		e.key === key && getItem(key) && setStore(parse(getItem(key)));
	});

	const set = (newValue: any) => {
		setItem(key, newValue);
		setStore(newValue);
	};

	const clear = (v: any) => {
		removeItem(key);
		setStore(v ?? undefined);
	};

	return {
		subscribe,
		set,
		clear
	};
};

// takes in a key and value and stringifies the value before adding to localstorage
function setItem(key: string, value: any) {
	const stringified = stringify(value);
	localStorage.setItem(key, stringified);
}

function getItem(key: string) {
	return localStorage.getItem(key);
}

function removeItem(key: string) {
	return localStorage.removeItem(key);
}

function available() {
	const test = '__svu_test__';
	try {
		setItem(test, test);
		removeItem(test);
		return true;
	} catch (_) {
		return false;
	}
}
