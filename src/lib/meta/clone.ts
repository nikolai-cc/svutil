/**
 * Function that deep clones any object up to a maximum recursion depth.
 */
 export const clone = (obj: any, depth: number = Infinity) => {
    let parents: any[] = [];
    let children: any[] = [];

    const _clone = (obj: any, depth: number) => {
		if (typeof obj !== 'object') {
			return obj;
		}

		let child: any;
		if (Array.isArray(obj)) {
			child = [];
		} else if (obj instanceof Map) {
			child = new Map();
		} else if (obj instanceof Set) {
			child = new Set();
		} else if (obj instanceof Date) {
			child = new Date(obj.getTime());
		} else if (obj instanceof Error) {
			child = Object.create(obj);
		} else if (obj instanceof RegExp) {
			child = new RegExp(obj.source, obj.flags);
		} else if (obj instanceof Promise) {
			child = new Promise((res, rej) =>
				obj.then(
					(v) => res(_clone(v, depth - 1)),
					(e) => rej(_clone(e, depth - 1))
				)
			);
		} else {
			child = Object.create(Object.getPrototypeOf(obj));
		}

		if (parents.includes(obj)) {
			return children[parents.indexOf(obj)];
		}
		parents.push(obj);
		children.push(child);

		if (obj instanceof Map) {
			for (let [k, v] of obj) {
				child.set(k, _clone(v, depth - 1));
			}
		} else if (obj instanceof Set) {
			for (let v of obj) {
				child.add(_clone(v, depth - 1));
			}
		} else {
			for (let key in obj) {
				child[key] = _clone(obj[key], depth - 1);
			}
		}
		return child;
	};

	return _clone(obj, depth);
};