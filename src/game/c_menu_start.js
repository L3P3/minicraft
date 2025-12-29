import {
	defer,
	defer_end,
	hook_dom,
	hook_memo,
	hook_state,
	node_dom,
	node_map,
} from '../etc/lui.js';

import {
	APP_VIEW_GAME,
	APP_VIEW_SETTINGS,
	WORLD_STORED_NOT,
	WORLD_STORED_SHOULD,
} from '../etc/constants.js';
import {
	API,
	VERSION,
} from '../etc/env.js';
import {
	alert_,
	Date_now,
	Error_,
	JSON_stringify,
	Math_max,
	Math_min,
	confirm_,
	datify,
	fetch_,
	prompt_,
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
	locale_error_connection,
	locale_error_delete_world,
	locale_error_edit_world,
	locale_error_list_is_loading,
	locale_error_name_too_long,
	locale_error_no_permission,
	locale_error_no_permission_logged_in,
	locale_error_no_world_selected,
	locale_error_not_logged_in,
	locale_error_world_is_loading,
	locale_error_world_is_opened,
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
	locale_world_etc,
	locale_worlds,
	locale_yes,
} from '../etc/locale.js';
import {
	chunks_delete,
} from '../etc/storage.js';
import {
	actions,
} from '../etc/state.js';

import {
	world_list_remote,
	world_renamed_id_new,
	world_renamed_id_old,
	world_store_remote_reload,
} from './m_world_store.js';

function WorldItem({
	I,
	world_selected,
	world_selected_id_set,
	world_syncing,
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
	if (world_syncing === I.id) {
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

export default function MenuStart({
	state: {
		account,
		config,
		connection_error,
		world_list_cooldown,
		world_list_loading,
		world_syncing,
		worlds_merged,
		worlds_opened,
	},
	view_set,
}) {
	hook_dom('div[className=menu]');

	const [world_selected_id_state, world_selected_id_set] = hook_state(config.world_last);
	// if the world was renamed, update the selected id
	const world_selected_id = (
		world_selected_id_state !== world_renamed_id_old
		?	world_selected_id_state
		:	(
			world_selected_id_set(world_renamed_id_new),
			world_renamed_id_new
		)
	);
	const world_selected = hook_memo(() => (
		worlds_merged.find(world => world.id === world_selected_id) || null
	), [
		world_selected_id,
		worlds_merged,
	]);

	const [menu_opened, menu_opened_set] = hook_state(false);
	if (!world_selected) menu_opened_set(false);
	const [busy, busy_set] = hook_state(false);
	const world_selected_opened = !!world_selected && worlds_opened.includes(world_selected_id);

	return [
		node_dom(`h1[innerText=${locale_worlds}]`),
		node_dom(`button[innerText=${locale_refresh}][style=position:absolute;left:0;top:0;height:2rem][title=${locale_reload_list}]`, {
			disabled: (
				world_list_cooldown ||
				world_list_loading ||
				connection_error !== null
			),
			onclick: world_store_remote_reload,
		}),
		node_dom('button[style=position:absolute;right:0;top:0;height:2rem]', {
			disabled: account.rank > 0,
			innerText: account.rank ? account.label : locale_login,
			onclick: () => {
				location.href = '/account?redir=minicraft';
			},
		}),
		node_dom('div[className=worlds]', null, [
			node_map(WorldItem, worlds_merged, {
				_: Date_now(), // refresh dates as well
				world_selected,
				world_selected_id_set,
				world_syncing,
			}),
		]),
		node_dom('center', null, [
			node_dom(`button[innerText=${locale_open}]`, {
				disabled: (
					!world_selected ||
					world_selected_opened ||
					world_selected.local < 2 ||
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
					: world_selected_opened
					?	locale_error_world_is_opened
					: world_selected.local < 2
					?	locale_error_world_not_downloaded
					: world_selected.local < world_selected.remote
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
					!world_selected
					?	locale_error_no_world_selected
					: world_selected_opened
					?	locale_error_world_is_opened
					:	locale_show_world_settings
				),
			}),
		]),
		node_dom('hr'),
		node_dom('center', null, [
			node_dom(`button[innerText=${locale_new_world}]`, {
				onclick: () => {
					const name = prompt_(locale_name_new_world, locale_new_world);
					if (!name) return;
					if (name.length > 16) {
						alert_(locale_error_name_too_long);
						return;
					}
					actions.world_add({
						id: Math_min(0, ...config.worlds.map(world => world.id)) - 1,
						label: name,
						mod_l: Date_now(),
						mod_r: WORLD_STORED_NOT,
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
							world_selected_opened ||
							!world_selected.writable
						),
						onclick: () => {
							const name = prompt_(locale_name_existing_world, world_selected.label);
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
									alert_(locale_error_edit_world + error.message);
								})
								.then(() => {
									busy_set(false);
								});
							}
						},
						title: (
							!world_selected.writable
							?	locale_error_no_permission
							: world_selected_opened
							?	locale_error_world_is_opened
							:	locale_change_world_name
						),
					}),
					node_dom('button', {
						disabled: (
							busy ||
							world_selected_opened ||
							!world_selected.local &&
							!world_selected.writable
						),
						innerText: (
							world_selected.local
							?	locale_delete_local
							:	locale_delete
						),
						onclick: () => {
							if (!confirm_(
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
									world_store_remote_reload();
									busy_set(false);
									defer_end();
									return response.json();
								})
								.catch(error => {
									alert_(locale_error_delete_world + error.message);
									busy_set(false);
								});
							}
						},
						title: (
							world_selected_opened
							?	locale_error_world_is_opened
							: !world_selected.local &&
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
								world_store_remote_reload();
								busy_set(false);
								defer_end();
								return response.json();
							})
							.catch(error => {
								alert_(locale_error_edit_world + error.message);
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
							world_selected_opened ||
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
									mod_l: WORLD_STORED_SHOULD,
									mod_r: world_selected.remote,
								});
							}
							else if (!world_selected.remote) {
								actions.world_prop(world_selected.id, {
									mod_r: WORLD_STORED_SHOULD,
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
							: world_selected_opened
							?	locale_error_world_is_opened
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
