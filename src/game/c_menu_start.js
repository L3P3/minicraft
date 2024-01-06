import {
	defer,
	defer_end,
	hook_async,
	hook_dom,
	hook_effect,
	hook_memo,
	hook_state,
	hook_static,
	node_dom,
	node_map,
} from '../etc/lui.js';

import {
	APP_VIEW_GAME,
} from '../etc/constants.js';
import {
	API,
	API_DOWNLOAD,
	VERSION,
} from '../etc/env.js';
import {
	JSON_stringify,
	Object_entries,
	Object_keys,
	datify,
	localStorage_,
	localStorage_getItem,
	localStorage_removeItem,
	localStorage_setItem,
} from '../etc/helpers.js';

function WorldItem({
	I,
	world_busy_id,
	world_selected,
	world_selected_id_set,
}) {
	hook_dom('div', {
		F: {
			selected: I === world_selected,
		},
		onclick: () => {
			world_selected_id_set(I.id);
		},
	});

	let flags = `${
		I.local ? 'L' : '_'
	}${
		I.local && I.remote
		?	(
			I.local > I.remote
			?	'>'
			: I.local < I.remote
			?	'<'
			:	'='
		)
		:	'_'
	}${
		I.remote ? 'R' : '_'
	}`;
	if (world_busy_id === I.id) {
		flags = `[${flags}]`;
	}

	return [
		node_dom('span', {
			innerText: `${flags} ${I.label}`,
			title: I.account_name ? 'Nutzer: ' + I.account_name : 'Nur lokale Welt',
		}),
		node_dom('span', {
			innerText: datify(Math.max(I.local, I.remote)),
		}),
	];
}

export default function MenuStart({
	account,
	actions,
	config,
	view_set,
}) {
	hook_dom('div[className=menu]');

	// counter to force list refresh
	const [refreshes, refreshes_set, refreshes_get] = hook_state(0);
	const refresh = hook_static(() => {
		refreshes_set(refreshes_get() + 1);
	});

	/**
		last fetched world list
		@type {{
			value: ?Array<TYPE_WORLD_LISTING_REMOTE>,
		}}
	*/
	const world_list_remote_ref = hook_static({
		value: null,
	});
	const world_list_remote = hook_async(
		async () => {
			try {
				const initial = !world_list_remote_ref.value && !refreshes;
				const response = await fetch(API + `world?what=${initial ? 'initial' : 'meta_all'}`);
				if (!response.ok) throw new Error('Verbindungsfehler.');
				const json = await response.json();
				if (!initial) return /** @type {!Array<TYPE_WORLD_LISTING_REMOTE>} */ (json);
				const json_initial = /** @type {TYPE_RESPONSE_INITIAL} */ (json);
				defer();
				actions.account_set(json_initial.account);
				return json_initial.worlds;
			}
			catch (error) {
				alert('Fehler beim Laden der Weltenliste: ' + error.message);
				return [];
			}
		},
		[refreshes],
		null
	);
	// merged local and remote world list
	const world_list = hook_memo(() => {
		if (world_list_remote) {
			world_list_remote_ref.value = world_list_remote;
		}

		const world_list = [];

		if (world_list_remote_ref.value) {
			world_list.push(
				...world_list_remote_ref.value
				.map(world => ({
					account_name: world.account_name,
					hash: world.hash,
					id: world.id,
					label: world.label,
					local: 0,
					remote: world.modified,
					writable: world.writable,
				}))
			);
		}

		for (const world_local of /** @type {!Array<TYPE_WORLD_LISTING_LOCAL>} */ (config.worlds)) {
			const world_list_item = world_list.find(world => world.id === world_local.id);
			if (world_list_item) {
				const last_change_here = world_list_item.local = world_local.mod_l;
				const last_change_there = world_list_item.remote;
				const last_sync = world_local.mod_r;

				if (
					last_change_here > last_sync &&
					last_change_there > last_sync
				) {
					if (confirm(`Konflikt! Die Welt "${world_local.label}" wurde sowohl hier als auch woanders geändert.\nOK: Die vom Server übernehmen (${datify(last_change_there)}) | Abbrechen: Die hier hochladen (${datify(last_change_here)})`)) {
						actions.world_prop(world_local.id, {
							mod_l: world_list_item.local = last_sync,
						});
					}
					else {
						actions.world_prop(world_local.id, {
							mod_r: world_list_item.remote = last_sync,
						});
					}
				}
			}
			else {
				if (
					world_local.mod_r > 1 &&
					world_list_remote &&
					world_list_remote.length
				) {
					alert(`Die Welt "${world_local.label}" wurde auf dem Server nicht gefunden, ist also jetzt eine lokale!`);
					actions.world_prop(world_local.id, {
						mod_r: 0,
					});
				}

				world_list.push({
					account_name: '',
					hash: 0,
					id: world_local.id,
					label: world_local.label,
					local: world_local.mod_l,
					remote: world_local.mod_r === 1 ? 1 : 0,
					writable: true,
				});
			}
		}

		return world_list.sort((a, b) => Math.max(b.local, b.remote) - Math.max(a.local, a.remote));
	}, [
		world_list_remote,
		config.worlds,
	]);

	const [world_selected_id, world_selected_id_set, world_selected_id_get] = hook_state(config.world_last);
	const world_selected = hook_memo(() => (
		world_list.find(world => world.id === world_selected_id) || null
	), [
		world_selected_id,
		world_list,
	]);

	const world_busy_id = hook_memo(() => (
		world_list?.find(world =>
			world.local > 0 &&
			world.remote > 0 &&
			world.local !== world.remote
		)?.id ?? null
	), [world_list]);
	hook_effect(() => {
		if (world_busy_id === null) return;

		let cancelled = false;
		const world_busy = world_list.find(world => world.id === world_busy_id);

		const prefix = `minicraft.world.${world_busy_id}:`;
		if (world_busy.local < world_busy.remote) {
			// download
			fetch(API_DOWNLOAD + `${world_busy.hash}.json`)
			.then(response => response.json())
			.then(json => {
				if (cancelled) return;
				for (const [key, value] of Object_entries(json)) {
					localStorage_setItem(prefix + key, value);
				}
				// assert margin for metadata
				localStorage_setItem('__margin', new Array(4097).join('x'));
				localStorage_removeItem('__margin');
				// when everything went fine
				actions.world_prop(world_busy_id, {
					mod_l: world_busy.remote,
					mod_r: world_busy.remote,
				});
			})
			.catch(error => {
				if (cancelled) return;
				if (error.name === 'QuotaExceededError') {
					alert('Der Speicherplatz reicht nicht!');
					for (const key of Object_keys(localStorage_)) {
						if (key.startsWith(prefix)) {
							localStorage_removeItem(key);
						}
					}
					actions.world_remove(world_busy_id);
				}
				else alert('Fehler beim Herunterladen der Welt: ' + error.message);
			});
		}
		else {
			// upload
			if (!world_busy.writable) {
				actions.world_prop(world_busy_id, {
					mod_l: config.worlds.find(world => world.id === world_busy_id).mod_r,
				});
				return;
			}
			const prefix_length = prefix.length;
			let id_new = world_busy_id;
			(
				// register new world?
				world_busy.remote === 1
				?	fetch(API + 'world', {
						method: 'POST',
						headers: {'Content-Type': 'application/json'},
						body: JSON_stringify({
							what: 'meta',
							label: world_busy.label,
						}),
					})
					.then(response => {
						if (!response.ok) throw new Error(
							response.status === 403
							?	'Keine Berechtigung. Angemeldet?'
							:	'Verbindungsfehler.'
						);
						return response.json();
					})
					.then(json => {
						id_new = json.id;
					})
				:	Promise.resolve()
			)
			.then(() => {
				if (cancelled) throw null;
				const json = {};
				for (const key of Object_keys(localStorage_)) {
					if (key.startsWith(prefix)) {
						json[key.substr(prefix_length)] = localStorage_getItem(key);
					}
				}
				return fetch(API + 'world', {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON_stringify({
						what: 'data',
						world: id_new,
						data: json,
					}),
				});
			})
			.then(response => {
				if (!response.ok) throw new Error(
					response.status === 403
					?	'Keine Berechtigung. Angemeldet?'
					:	'Verbindungsfehler.'
				);
				return response.json();
			})
			.then(result => {
				defer();
				if (id_new === world_busy_id) {
					actions.world_prop(world_busy_id, {
						mod_l: result.modified,
						mod_r: result.modified,
					});
				}
				else {
					// replace the id
					const prefix_new = `minicraft.world.${id_new}:`;
					for (const key of Object_keys(localStorage_)) {
						if (key.startsWith(prefix)) {
							const value = localStorage_getItem(key);
							localStorage_removeItem(key);
							localStorage_setItem(
								prefix_new + key.substr(prefix_length),
								value
							);
						}
					}
					actions.world_remove(world_busy_id);
					actions.world_add({
						id: id_new,
						label: world_busy.label,
						mod_l: result.modified,
						mod_r: result.modified,
					});
					if (
						!cancelled &&
						world_selected_id_get() === world_busy_id
					) {
						world_selected_id_set(id_new);
					}
				}
				if (!cancelled) refresh();
				defer_end();
			})
			.catch(error => {
				if (cancelled) return;
				alert('Fehler beim Hochladen der Welt: ' + error.message);
				defer();
				actions.world_prop(world_busy_id, {
					mod_r: 0,
				});
				defer_end();
			});
		}

		return () => {
			cancelled = true;
		};
	}, [world_busy_id]);

	return [
		node_dom('h1[innerText=Welten]'),
		node_dom('button[innerText=Aktualisieren][style=position:absolute;left:0;top:0;height:2rem][title=Liste neu laden]', {
			disabled: !world_list_remote,
			onclick: refresh,
		}),
		node_dom('button[style=position:absolute;right:0;top:0;height:2rem]', {
			disabled: account.rank > 0,
			innerText: account.rank ? account.label : 'Anmelden',
			onclick: () => {
				location.href = '/account?redir=minicraft';
			},
		}),
		node_dom('div[className=worlds]', null, [
			node_map(WorldItem, world_list, {
				refreshes, // refresh dates as well
				world_busy_id,
				world_selected,
				world_selected_id_set,
			}),
		]),
		node_dom('center', null, [
			node_dom('button[innerText=Öffnen]', {
				disabled: (
					!world_selected ||
					!world_selected.local ||
					world_selected.remote > world_selected.local
				),
				onclick: () => {
					defer();
					actions.config_set({
						world_last: world_selected.id,
					});
					view_set(APP_VIEW_GAME);
					defer_end();
				},
				title: (
					!world_selected
					?	'Keine Welt ausgewählt!'
					: !world_selected.local
					?	'Die Welt ist noch nicht heruntergeladen!'
					: world_selected.remote > world_selected.local
					?	'Die Welt wird noch geladen!'
					:	'Ausgewählte Welt betreten'
				),
			}),
			node_dom('button', {
				disabled: (
					!world_list_remote ||
					!world_selected ||
					world_selected.local > 0 && world_selected.remote > 0 ||
					!world_selected.remote && !account.rank
				),
				innerText: (
					world_selected && !world_selected.local
					?	'Herunterladen'
					: world_list_remote && world_selected && !world_selected.remote
					?	'Hochladen'
					:	'Übertragen'
				),
				onclick: () => {
					if (!world_selected.local) {
						actions.world_add({
							id: world_selected.id,
							label: world_selected.label,
							mod_l: 1,
							mod_r: world_selected.remote,
						});
					}
					else if (!world_selected.remote) {
						actions.world_prop(world_selected.id, {
							mod_r: 1,
						});
					}
				},
				title: (
					!world_list_remote
					?	'Liste wird noch geladen!'
					: !world_selected
					?	'Keine Welt ausgewählt!'
					: !world_selected.local
					?	'Welt von Server herunterladen'
					: world_selected.remote
					?	'Die Welt ist schon auf beiden Seiten vorhanden!'
					: account.rank
					?	'Welt auf den Server hochladen'
					:	'Nicht angemeldet!'
				),
			}),
		]),
		node_dom('hr'),
		node_dom('center', null, [
			node_dom('button[innerText=Neue Welt]', {
				onclick: () => {
					const name = prompt('Name der neuen Welt:\n(max. 16 Zeichen)', 'Neue Welt');
					if (!name) return;
					if (name.length > 16) {
						alert('Der Name ist zu lang!');
						return;
					}
					actions.world_add({
						id: Math.min(0, ...config.worlds.map(world => world.id)) - 1,
						label: name,
						mod_l: Date.now(),
						mod_r: 0,
					});
				}
			}),
			node_dom('button[innerText=Projektseite]', {
				onclick: () => {
					open('//github.com/L3P3/minicraft');
				},
			}),
		]),
		node_dom('center', null, [
			node_dom('small[innerText=Version ' + VERSION + ' von L3P3]'),
		]),
	];
}
