import {
	Array_,
	Number_,
	Object_entries,
	Object_keys,
	Promise_,
	Promise_resolve,
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
export const chunks_db_promise = indexedDB_
?	new Promise_(resolve => {
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
					const [world, coords] = key.slice(16).split(':', 2);
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
			resolve();
		};
	})
:	Promise_resolve();

/**
	@param {number} world
	@param {string} coords
	@return {Promise<string?>}
*/
export const chunk_get = indexedDB_
?	(world, coords) => new Promise_(resolve => {
		const request = chunks_db
			.transaction('chunks', 'readonly')
			.objectStore('chunks')
			.get([
				world,
				coords,
			]);
		request.onsuccess = () => resolve(request.result?.data);
	})
:	(world, coords) => Promise_resolve(
		localStorage_getItem(`minicraft.world.${world}:${coords}`)
	)

/**
	@param {number} world
	@param {string} coords
	@param {string} data
	@return {Promise<void>}
*/
export const chunk_set = indexedDB_
?	(world, coords, data) => new Promise_((resolve, reject) => {
		const request = chunks_db
			.transaction('chunks', 'readwrite')
			.objectStore('chunks')
			.put({
				world,
				coords,
				data,
			});
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	})
:	(world, coords, data) => (
		localStorage_setItem(`minicraft.world.${world}:${coords}`, data),
		Promise_resolve()
	)

/**
	@param {number} world
	@param {string} coords
	@return {Promise<void>}
*/
export const chunk_delete = indexedDB_
?	(world, coords) => new Promise_((resolve, reject) => {
		const request = chunks_db
			.transaction('chunks', 'readwrite')
			.objectStore('chunks')
			.delete([
				world,
				coords,
			]);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	})
:	(world, coords) => (
		localStorage_removeItem(`minicraft.world.${world}:${coords}`),
		Promise_resolve()
	)

/**
	@param {number} world
	@return {Promise<!Object<string, string>>}
*/
export const chunks_get = indexedDB_
?	world => new Promise_(resolve => {
		const meta_data = localStorage_getItem(`minicraft.world.${world}:meta`);
		if (!meta_data) return resolve({});
		const request = chunks_db
			.transaction('chunks', 'readonly')
			.objectStore('chunks')
			.openCursor();
		const chunks = {
			'meta': meta_data,
		};
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
	})
:	world => {
		const prefix = `minicraft.world.${world}:`;
		const prefix_length = prefix.length;
		const chunks = {};
		for (const key of Object_keys(localStorage_))
		if (key.startsWith(prefix)) {
			chunks[key.slice(prefix_length)] = localStorage_getItem(key);
		}
		return Promise_resolve(chunks);
	}

/**
	@param {number} world
	@param {!Object<string, string>} chunks
	@return {Promise<void>}
*/
export const chunks_set = indexedDB_
?	(world, chunks) => new Promise_((resolve, reject) => {
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
		transaction.oncomplete = () => resolve();
		transaction.onerror = () => reject(transaction.error);
	})
:	async (world, chunks) => {
		for (const [coords, data] of Object_entries(chunks)) {
			localStorage_setItem(`minicraft.world.${world}:${coords}`, data);
		}
		// assert margin for metadata
		localStorage_setItem('__margin', Array_(257).join('x'));
		localStorage_removeItem('__margin');
	}

/**
	@param {number} world
	@return {void}
*/
export const chunks_delete = indexedDB_
?	world => {
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
		localStorage_removeItem(`minicraft.world.${world}:meta`);
	}
:	world => {
		const prefix = `minicraft.world.${world}:`;
		for (const key of Object_keys(localStorage_))
		if (key.startsWith(prefix)) {
			localStorage_removeItem(key);
		}
	}

/**
	@param {number} world_old
	@param {number} world_new
	@return {Promise<void>}
*/
export const chunks_rename = indexedDB_
?	(world_old, world_new) => new Promise_(resolve => {
		const store = chunks_db
			.transaction('chunks', 'readwrite')
			.objectStore('chunks');
		const request = store.openCursor();
		request.onsuccess = () => {
			const cursor = request.result;
			if (cursor) {
				if (cursor.value.world === world_old) {
					cursor.delete();
					cursor.value.world = world_new;
					store.put(cursor.value);
				}
				cursor.continue();
			}
			else {
				resolve();
			}
		};
		localStorage_setItem(
			`minicraft.world.${world_new}:meta`,
			localStorage_getItem(`minicraft.world.${world_old}:meta`)
		);
		localStorage_removeItem(`minicraft.world.${world_old}:meta`);
	})
:	(world_old, world_new) => {
		const prefix_old = `minicraft.world.${world_old}:`;
		const prefix_old_length = prefix_old.length;
		for (const key of Object_keys(localStorage_)) {
			if (key.startsWith(prefix_old)) {
				const value = localStorage_getItem(key);
				localStorage_removeItem(key);
				localStorage_setItem(
					`minicraft.world.${world_new}:${key.slice(prefix_old_length)}`,
					value
				);
			}
		}
		return Promise_resolve();
	}
