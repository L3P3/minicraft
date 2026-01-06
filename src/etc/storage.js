import {
	Number_,
	Object_entries,
	Object_keys,
	Promise_,
	indexedDB_,
	localStorage_,
	localStorage_getItem,
	localStorage_removeItem,
	localStorage_setItem,
	navigator_,
} from './helpers.js';

// to assert chunk deletion fix is done before this
import './state.js';

let chunks_db = null;
if (indexedDB_) {
	navigator_.storage?.persist?.();
	const request = indexedDB_.open('minicraft', 1);
	request.onupgradeneeded = event => {
		// migrate from localStorage to indexedDB
		// if (event.oldVersion < 1) {
		const store = event.target.result.createObjectStore('chunks', {
			keyPath: ['world', 'coords'],
		});
		for (const key of Object_keys(localStorage_)) {
			if (key.startsWith('minicraft.world.')) {
				const [world, coords] = key.substr(16).split(':');
				if (coords === 'meta') continue;
				store.add({
					world: Number_(world),
					coords,
					data: localStorage_getItem(key),
				});
				localStorage_removeItem(key);
			}
		}
	};
	request.onsuccess = event => {
		chunks_db = event.target.result;
	};
}

/**
	@param {number} world
	@param {string} coords
	@return {Promise<string?>}
*/
export const chunk_get = async (world, coords) => {
	if (!chunks_db) return localStorage_getItem(`minicraft.world.${world}:${coords}`);

	const request = chunks_db
		.transaction('chunks', 'readonly')
		.objectStore('chunks')
		.get([
			world,
			coords,
		]);

	return new Promise_(resolve => {
		request.onsuccess = () => {
			resolve(request.result?.data);
		};
	});
}

/**
	@param {number} world
	@param {string} coords
	@param {string} data
	@return {Promise<void>}
*/
export const chunk_set = async (world, coords, data) => {
	if (!chunks_db) return localStorage_setItem(`minicraft.world.${world}:${coords}`, data);

	const request = chunks_db
		.transaction('chunks', 'readwrite')
		.objectStore('chunks')
		.put({
			world,
			coords,
			data,
		});

	return new Promise_((resolve, reject) => {
		request.onsuccess = () => {
			resolve();
		};
		request.onerror = () => {
			reject(request.error);
		};
	});
}

/**
	@param {number} world
	@param {string} coords
	@return {Promise<void>}
*/
export const chunk_delete = async (world, coords) => {
	if (!chunks_db) return localStorage_removeItem(`minicraft.world.${world}:${coords}`);

	const request = chunks_db
		.transaction('chunks', 'readwrite')
		.objectStore('chunks')
		.delete([
			world,
			coords,
		]);

	return new Promise_(resolve => {
		request.onsuccess = () => {
			resolve();
		};
	});
}

/**
	@param {number} world
	@return {Promise<!Object<string, string>>}
*/
export const chunks_get = async world => {
	const prefix = `minicraft.world.${world}:`;
	if (!chunks_db) {
		const chunks = {};
		const prefix_length = prefix.length;
		for (const key of Object_keys(localStorage_)) {
			if (key.startsWith(prefix)) {
				chunks[key.substr(prefix_length)] = localStorage_getItem(key);
			}
		}
		return chunks;
	}

	const request = chunks_db
		.transaction('chunks', 'readonly')
		.objectStore('chunks')
		.openCursor();
	const chunks = {
		'meta': localStorage_getItem(prefix + 'meta'),
	};

	return new Promise_(resolve => {
		request.onsuccess = () => {
			const cursor = request.result;
			if (cursor) {
				if (cursor.value.world === world) {
					chunks[cursor.value.coords] = cursor.value.data;
				}
				cursor.continue();
			}
			else {
				resolve(chunks);
			}
		};
	});
}

/**
	@param {number} world
	@param {!Object<string, string>} chunks
	@return {Promise<void>}
*/
export const chunks_set = async (world, chunks) => {
	if (!chunks_db) {
		for (const [coords, data] of Object_entries(chunks)) {
			localStorage_setItem(`minicraft.world.${world}:${coords}`, data);
		}
		// assert margin for metadata
		localStorage_setItem('__margin', new Array(257).join('x'));
		localStorage_removeItem('__margin');
		return;
	}

	const transaction = chunks_db.transaction('chunks', 'readwrite');
	const store = transaction.objectStore('chunks');
	for (const [coords, data] of Object_entries(chunks)) {
		if (coords !== 'meta') {
			store.put({
				world,
				coords,
				data,
			});
		}
		else {
			localStorage_setItem(`minicraft.world.${world}:meta`, data);
		}
	}

	return new Promise_((resolve, reject) => {
		transaction.oncomplete = () => {
			resolve();
		};
		transaction.onerror = () => {
			reject(transaction.error);
		};
	});
}

/**
	@param {number} world
*/
export const chunks_delete = world => {
	if (!chunks_db) {
		const prefix = `minicraft.world.${world}:`;
		for (const key of Object_keys(localStorage_)) {
			if (key.startsWith(prefix)) {
				localStorage_removeItem(key);
			}
		}
		return;
	}

	localStorage_removeItem(`minicraft.world.${world}:meta`);

	const request = chunks_db
		.transaction('chunks', 'readwrite')
		.objectStore('chunks')
		.openCursor();

	request.onsuccess = () => {
		const cursor = request.result;
		if (cursor) {
			if (cursor.value.world === world) {
				cursor.delete();
			}
			cursor.continue();
		}
	}
}

/**
	@param {number} world_old
	@param {number} world_new
*/
export const chunks_rename = async (world_old, world_new) => {
	if (!chunks_db) {
		const prefix_old = `minicraft.world.${world_old}:`;
		const prefix_old_length = prefix_old.length;
		const prefix_new = `minicraft.world.${world_new}:`;
		for (const key of Object_keys(localStorage_)) {
			if (key.startsWith(prefix_old)) {
				const value = localStorage_getItem(key);
				localStorage_removeItem(key);
				localStorage_setItem(
					prefix_new + key.substr(prefix_old_length),
					value
				);
			}
		}
		return;
	}

	localStorage_setItem(
		`minicraft.world.${world_new}:meta`,
		localStorage_getItem(`minicraft.world.${world_old}:meta`)
	);
	localStorage_removeItem(`minicraft.world.${world_old}:meta`);

	const store = chunks_db
		.transaction('chunks', 'readwrite')
		.objectStore('chunks');
	const request = store.openCursor();

	return new Promise_(resolve => {
		request.onsuccess = () => {
			const cursor = request.result;
			if (cursor) {
				if (cursor.value.world === world_old) {
					cursor.value.world = world_new;
					store.put(cursor.value);
				}
				cursor.continue();
			}
			else {
				resolve();
			}
		};
	});
}
