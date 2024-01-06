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
import {
	locale_download_world_from_server,
	locale_download,
	locale_error_conflict_1,
	locale_error_conflict_2,
	locale_error_conflict_3,
	locale_error_conflict_4,
	locale_error_connection,
	locale_error_download_world,
	locale_error_list_is_loading,
	locale_error_loading_worldlist,
	locale_error_name_too_long,
	locale_error_no_permission_logged_in,
	locale_error_no_world_selected,
	locale_error_not_logged_in,
	locale_error_storage,
	locale_error_upload_world,
	locale_error_world_is_loading,
	locale_error_world_is_present_both_sides,
	locale_error_world_not_downloaded,
	locale_join_selected_world,
	locale_login,
	locale_name_new_world,
	locale_new_world,
	locale_only_local,
	locale_open,
	locale_project_page,
	locale_refresh,
	locale_reload_list,
	locale_transfer,
	locale_upload_world_to_server,
	locale_upload,
	locale_user_colon,
	locale_version_1,
	locale_version_2,
	locale_warn_world_remote_missing_1,
	locale_warn_world_remote_missing_2,
	locale_worlds,
} from '../etc/locale.js';

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
			title: I.account_name ? locale_user_colon + I.account_name : locale_only_local,
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
				if (!response.ok) throw new Error(locale_error_connection);
				const json = await response.json();
				if (!initial) return /** @type {!Array<TYPE_WORLD_LISTING_REMOTE>} */ (json);
				const json_initial = /** @type {TYPE_RESPONSE_INITIAL} */ (json);
				if (
					VERSION !== 'dev' &&
					json_initial.version_latest !== VERSION
				) {
					location.reload();
					return null;
				}
				defer();
				actions.account_set(json_initial.account);
				return json_initial.worlds;
			}
			catch (error) {
				alert(locale_error_loading_worldlist + error.message);
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
					if (confirm(
						locale_error_conflict_1 +
						world_local.label +
						locale_error_conflict_2 +
						datify(last_change_there) + locale_error_conflict_3 +
						datify(last_change_here) +
						locale_error_conflict_4
					)) {
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
					alert(
						locale_warn_world_remote_missing_1 +
						world_local.label +
						locale_warn_world_remote_missing_2
					);
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
					alert(locale_error_storage);
					for (const key of Object_keys(localStorage_)) {
						if (key.startsWith(prefix)) {
							localStorage_removeItem(key);
						}
					}
					actions.world_remove(world_busy_id);
				}
				else alert(locale_error_download_world + error.message);
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
							?	locale_error_no_permission_logged_in
							:	locale_error_connection
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
					?	locale_error_no_permission_logged_in
					:	locale_error_connection
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
				alert(locale_error_upload_world + error.message);
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
		node_dom(`h1[innerText=${locale_worlds}]`),
		node_dom(`button[innerText=${locale_refresh}][style=position:absolute;left:0;top:0;height:2rem][title=${locale_reload_list}]`, {
			disabled: !world_list_remote,
			onclick: refresh,
		}),
		node_dom('button[style=position:absolute;right:0;top:0;height:2rem]', {
			disabled: account.rank > 0,
			innerText: account.rank ? account.label : locale_login,
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
			node_dom(`button[innerText=${locale_open}]`, {
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
					?	locale_error_no_world_selected
					: !world_selected.local
					?	locale_error_world_not_downloaded
					: world_selected.remote > world_selected.local
					?	locale_error_world_is_loading
					:	locale_join_selected_world
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
					?	locale_download
					: world_list_remote && world_selected && !world_selected.remote
					?	locale_upload
					:	locale_transfer
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
					?	locale_error_list_is_loading
					: !world_selected
					?	locale_error_no_world_selected
					: !world_selected.local
					?	locale_download_world_from_server
					: world_selected.remote
					?	locale_error_world_is_present_both_sides
					: account.rank
					?	locale_upload_world_to_server
					:	locale_error_not_logged_in
				),
			}),
		]),
		node_dom('hr'),
		node_dom('center', null, [
			node_dom(`button[innerText=${locale_new_world}]`, {
				onclick: () => {
					const name = prompt(locale_name_new_world, locale_new_world);
					if (!name) return;
					if (name.length > 16) {
						alert(locale_error_name_too_long);
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
			node_dom(`button[innerText=${locale_project_page}]`, {
				onclick: () => {
					open('//github.com/L3P3/minicraft');
				},
			}),
		]),
		node_dom('center', null, [
			node_dom(`small[innerText=${locale_version_1 + VERSION + locale_version_2}]`),
		]),
	];
}
