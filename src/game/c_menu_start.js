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
	APP_VIEW_SETTINGS,
} from '../etc/constants.js';
import {
	API,
	API_DATA,
	VERSION,
} from '../etc/env.js';
import {
	Date_now,
	Error_,
	JSON_stringify,
	Math_max,
	Math_min,
	Promise_,
	datify,
	fetch_,
} from '../etc/helpers.js';
import {
	locale_ask_world_delete_1,
	locale_ask_world_delete_2,
	locale_change_world_name,
	locale_delete,
	locale_delete_local,
	locale_delete_world,
	locale_download_world_from_server,
	locale_download,
	locale_error_conflict_1,
	locale_error_conflict_2,
	locale_error_conflict_3,
	locale_error_conflict_4,
	locale_error_connection,
	locale_error_delete_world,
	locale_error_download_world,
	locale_error_edit_world,
	locale_error_list_is_loading,
	locale_error_loading_worldlist,
	locale_error_name_too_long,
	locale_error_no_permission,
	locale_error_no_permission_logged_in,
	locale_error_no_world_selected,
	locale_error_not_logged_in,
	locale_error_storage,
	locale_error_upload_world,
	locale_error_world_is_loading,
	locale_error_world_is_present_both_sides,
	locale_error_world_not_downloaded,
	locale_error_world_not_uploaded,
	locale_join_selected_world,
	locale_login,
	locale_modification,
	locale_name_existing_world,
	locale_name_new_world,
	locale_new_world,
	locale_no,
	locale_only_local,
	locale_open,
	locale_owner,
	locale_public,
	locale_publish_world,
	locale_refresh,
	locale_reload_list,
	locale_rename,
	locale_settings,
	locale_show_world_settings,
	locale_transfer,
	locale_unpublish_world,
	locale_upload_world_to_server,
	locale_upload,
	locale_version_1,
	locale_version_2,
	locale_warn_world_remote_missing_1,
	locale_warn_world_remote_missing_2,
	locale_world_etc,
	locale_worlds,
	locale_yes,
} from '../etc/locale.js';
import {
	chunks_delete,
	chunks_get,
	chunks_rename,
	chunks_set,
} from '../etc/storage.js';

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
		!I.remote
		?	'_'
		: I.public
		?	'R'
		:	'r'
	}`;
	if (world_busy_id === I.id) {
		flags = `[${flags}]`;
	}

	return [
		node_dom('span', {
			innerText: `${flags} ${I.label}`,
			title: (
				I.account_name
				?	locale_owner + ': ' + I.account_name
				:	locale_only_local
			),
		}),
		node_dom('span', {
			innerText: datify(Math_max(I.local, I.remote), true),
		}),
	];
}

const headers_json_post = {
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
};

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
				const response = await fetch_(`${API}world?what=${initial ? 'initial' : 'meta_all'}`);
				if (!response.ok) throw Error_(locale_error_connection);
				const json = await response.json();
				if (!initial) return /** @type {!Array<TYPE_WORLD_LISTING_REMOTE>} */ (json);
				const json_initial = /** @type {TYPE_RESPONSE_INITIAL} */ (json);
				if (
					VERSION !== 'dev' &&
					json_initial.version_latest !== VERSION
				) {
					location.reload(true);
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
					public: world.public,
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
						datify(last_change_there, false) + locale_error_conflict_3 +
						datify(last_change_here, false) +
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
					public: false,
					remote: world_local.mod_r === 1 ? 1 : 0,
					writable: true,
				});
			}
		}

		return world_list.sort((a, b) => Math_max(b.local, b.remote) - Math_max(a.local, a.remote));
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

		if (world_busy.local < world_busy.remote) {
			// download
			fetch_(`${API_DATA}worlds/${world_busy.hash}.json`)
			.then(response => response.json())
			.then(json => {
				if (cancelled) return;
				return (
					chunks_set(world_busy_id, json)
					.then(() => {
						actions.world_prop(world_busy_id, {
							mod_l: world_busy.remote,
							mod_r: world_busy.remote,
						});
					})
				);
			})
			.catch(error => {
				if (cancelled) return;
				if (error.name === 'QuotaExceededError') {
					alert(locale_error_storage);
					actions.world_remove(world_busy_id);
					chunks_delete(world_busy_id);
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
			let id_new = world_busy_id;
			(
				// register new world?
				world_busy.remote === 1
				?	fetch_(API + 'world', {
						...headers_json_post,
						body: JSON_stringify({
							what: 'meta',
							label: world_busy.label,
						}),
					})
					.then(response => {
						if (!response.ok) throw Error_(
							response.status === 403
							?	locale_error_no_permission_logged_in
							:	locale_error_connection
						);
						return response.json();
					})
					.then(json => {
						id_new = json.id;
					})
				:	Promise_.resolve()
			)
			.then(() => {
				if (cancelled) throw null;
				return chunks_get(world_busy_id);
			})
			.then(json => {
				if (cancelled) throw null;
				return fetch_(API + 'world', {
					...headers_json_post,
					body: JSON_stringify({
						what: 'data',
						world: id_new,
						data: json,
					}),
				});
			})
			.then(response => {
				if (!response.ok) throw Error_(
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
					chunks_rename(world_busy_id, id_new);
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

	const [menu_opened, menu_opened_set] = hook_state(false);
	if (!world_selected) menu_opened_set(false);
	const [busy, busy_set] = hook_state(false);

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
			node_dom(`button[innerText=${locale_world_etc}]`, {
				disabled: (
					!world_selected ||
					menu_opened
				),
				onclick: () => {
					menu_opened_set(true);
				},
				title: (
					world_selected
					?	locale_show_world_settings
					:	locale_error_no_world_selected
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
						id: Math_min(0, ...config.worlds.map(world => world.id)) - 1,
						label: name,
						mod_l: Date_now(),
						mod_r: 0,
					});
				}
			}),
			node_dom(`button[innerText=${locale_settings}]`, {
				onclick: () => {
					view_set(APP_VIEW_SETTINGS);
				},
			}),
		]),
		node_dom('center', null, [
			node_dom(`small[innerText=${locale_version_1 + VERSION + locale_version_2}]`),
		]),
		menu_opened &&
		world_selected &&
		node_dom('div', {
			F: {
				'menu overlay advanced': true,
				busy,
			},
			onclick: event => {
				if (event.target.className === 'menu overlay advanced') {
					menu_opened_set(false);
				}
			},
		}, [
			node_dom('div[className=window]', null, [
				node_dom('h2', {
					innerText: `"${world_selected.label}"`,
					title: world_selected.id,
				}),
				node_dom('table', null, [
					!!world_selected.account_name &&
					node_dom('tr', null, [
						node_dom(`td[innerText=${locale_owner}:]`),
						node_dom('td', {
							innerText: world_selected.account_name,
						}),
					]),
					node_dom('tr', null, [
						node_dom(`td[innerText=${locale_modification}:]`),
						node_dom('td', {
							innerText: datify(Math_max(
								world_selected.local,
								world_selected.remote
							), false),
						}),
					]),
				]),
				node_dom('center', null, [
					node_dom(`button[innerText=${locale_rename}]`, {
						disabled: (
							busy ||
							!world_selected.writable
						),
						onclick: () => {
							const name = prompt(locale_name_existing_world, world_selected.label);
							if (
								!name ||
								name === world_selected.label ||
								name.length > 16
							) return;
							if (world_selected.local) {
								actions.world_prop(world_selected.id, {
									label: name,
								});
							}
							if (world_selected.remote) {
								busy_set(true);
								fetch_(API + 'world', {
									method: 'POST',
									headers: {'Content-Type': 'application/json'},
									body: JSON_stringify({
										what: 'meta',
										world: world_selected.id,
										label: name,
									}),
								})
								.then(response => {
									if (!response.ok) throw Error_(
										response.status === 403
										?	locale_error_no_permission_logged_in
										:	locale_error_connection
									);
									return response.json();
								})
								.catch(error => {
									alert(locale_error_edit_world + error.message);
								})
								.then(() => {
									busy_set(false);
								});
							}
						},
						title: (
							world_selected.writable
							?	locale_change_world_name
							:	locale_error_no_permission
						),
					}),
					node_dom('button', {
						disabled: (
							busy ||
							!world_selected.local &&
							!world_selected.writable
						),
						innerText: (
							world_selected.local
							?	locale_delete_local
							:	locale_delete
						),
						onclick: () => {
							if (!confirm(
								locale_ask_world_delete_1 + world_selected.label + locale_ask_world_delete_2
							)) return;
							if (world_selected.local) {
								actions.world_remove(world_selected.id);
								chunks_delete(world_selected.id);
							}
							else {
								busy_set(true);
								fetch_(API + 'world', {
									method: 'DELETE',
									headers: {'Content-Type': 'application/json'},
									body: JSON_stringify({
										what: 'world',
										world: world_selected.id,
									}),
								})
								.then(response => {
									if (!response.ok) throw Error_(
										response.status === 403
										?	locale_error_no_permission_logged_in
										:	locale_error_connection
									);
									defer();
									world_selected_id_set(null);
									menu_opened_set(false);
									refresh();
									busy_set(false);
									defer_end();
									return response.json();
								})
								.catch(error => {
									alert(locale_error_delete_world + error.message);
									busy_set(false);
								});
							}
						},
						title: (
							!world_selected.local &&
							!world_selected.writable
							?	locale_error_no_permission
							:	locale_delete_world
						),
					}),
				]),
				node_dom('center', null, [
					node_dom('button', {
						disabled: (
							busy ||
							!world_selected.remote ||
							!world_selected.writable
						),
						innerText: `${locale_public}: ${
							world_selected.public
							?	locale_yes
							:	locale_no
						}`,
						onclick: () => {
							busy_set(true);
							fetch_(API + 'world', {
								method: 'POST',
								headers: {'Content-Type': 'application/json'},
								body: JSON_stringify({
									what: 'meta',
									world: world_selected.id,
									public: !world_selected.public,
								}),
							})
							.then(response => {
								if (!response.ok) throw Error_(
									response.status === 403
									?	locale_error_no_permission_logged_in
									:	locale_error_connection
								);
								defer();
								refresh();
								busy_set(false);
								defer_end();
								return response.json();
							})
							.catch(error => {
								alert(locale_error_edit_world + error.message);
								busy_set(false);
							});
						},
						title: (
							!world_selected.remote
							?	locale_error_world_not_uploaded
							: !world_selected.writable
							?	locale_error_no_permission
							: world_selected.public
							?	locale_unpublish_world
							:	locale_publish_world
						),
					}),
					node_dom('button', {
						disabled: (
							busy ||
							!world_list_remote ||
							world_selected.local > 0 && world_selected.remote > 0 ||
							!world_selected.remote && !account.rank
						),
						innerText: (
							!world_selected.local
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
			]),
		]),
	];
}
