import {
	defer,
	defer_end,
	hook_dom,
	hook_effect,
	hook_memo,
	hook_state,
	node,
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
	LEGACY,
	SSR,
} from '../etc/env.js';
import {
	alert_,
	Date_now,
	JSON_stringify,
	Math_max,
	Math_min,
	confirm_,
	datify,
	fetch_,
	prompt_,
	response_parse,
	headers_json_post,
	setTimeout_,
	scrollIntoView_settings,
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
	locale_error_delete_world,
	locale_error_edit_world,
	locale_error_list_is_loading,
	locale_error_name_too_long,
	locale_error_no_permission,
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
	locale_open,
	locale_owner,
	locale_public,
	locale_publish_world,
	locale_refresh,
	locale_reload_list,
	locale_rename,
	locale_settings,
	locale_transfer,
	locale_unpublish_world,
	locale_upload_world_to_server,
	locale_upload,
	locale_worlds,
	locale_yes,
	locale_only_local,
} from '../etc/locale.js';
import {
	chunks_delete,
} from '../etc/storage.js';
import {
	actions,
} from '../etc/state.js';

import {
	world_list_remote,
	world_rename,
	world_store_remote_reload,
} from './m_world_store.js';

const WorldButtons = ({
	account,
	busy,
	busy_set,
	opened,
	view_set,
	world,
	world_selected_id_set,
}) => (hook_dom('div'), [
	node_dom(`button[innerText=${locale_open}]`, {
		disabled: (
			busy ||
			opened ||
			world.local < 2 ||
			world.remote > world.local
		),
		onclick: () => {
			defer();
			actions.config_set({
				world_last: world.id,
			});
			view_set(APP_VIEW_GAME);
			defer_end();
		},
		title: (
			opened
			?	locale_error_world_is_opened
			: world.local < 2
			?	locale_error_world_not_downloaded
			: world.local < world.remote
			?	locale_error_world_is_loading
			:	locale_join_selected_world
		),
	}),
	node_dom('button', {
		disabled: (
			busy ||
			!world_list_remote ||
			opened ||
			world.local > 0 && world.remote > 0 ||
			!world.remote && !account.rank
		),
		innerText: (
			!world.local
			?	locale_download
			: world_list_remote && world && !world.remote
			?	locale_upload
			:	locale_transfer
		),
		onclick: () => {
			if (!world.local) {
				actions.world_add({
					id: world.id,
					label: world.label,
					mod_l: WORLD_STORED_SHOULD,
					mod_r: world.remote,
				});
			}
			else if (!world.remote) {
				actions.world_prop(world.id, {
					mod_r: WORLD_STORED_SHOULD,
				});
			}
		},
		title: (
			!world_list_remote
			?	locale_error_list_is_loading
			: !world.local
			?	locale_download_world_from_server
			: world.remote
			?	locale_error_world_is_present_both_sides
			: opened
			?	locale_error_world_is_opened
			: account.rank
			?	locale_upload_world_to_server
			:	locale_error_not_logged_in
		),
	}),
	node_dom(`button[innerText=${locale_rename}]`, {
		disabled: (
			busy ||
			opened ||
			!world.writable
		),
		onclick: () => {
			const name = prompt_(locale_name_existing_world, world.label);
			if (
				!name ||
				name === world.label ||
				name.length > 16
			) return;
			if (world.local) {
				actions.world_prop(world.id, {
					label: name,
				});
			}
			if (world.remote) {
				busy_set(true);
				fetch_(API + 'world', {
					...headers_json_post,
					body: JSON_stringify({
						what: 'meta',
						world: world.id,
						label: name,
					}),
				})
				.then(response_parse)
				.catch(error => {
					alert_(locale_error_edit_world + error.message);
				})
				.then(() => {
					busy_set(false);
				});
			}
		},
		title: (
			!world.writable
			?	locale_error_no_permission
			: opened
			?	locale_error_world_is_opened
			:	locale_change_world_name
		),
	}),
	node_dom('button', {
		disabled: (
			busy ||
			!world.remote ||
			!world.writable
		),
		innerText: `${locale_public}: ${
			world.public
			?	locale_yes
			:	locale_no
		}`,
		onclick: () => {
			busy_set(true);
			fetch_(API + 'world', {
				...headers_json_post,
				body: JSON_stringify({
					what: 'meta',
					world: world.id,
					public: !world.public,
				}),
			})
			.then(response => (
				response = response_parse(response),
				defer(),
				world_store_remote_reload(),
				busy_set(false),
				defer_end(),
				response
			))
			.catch(error => {
				alert_(locale_error_edit_world + error.message);
				busy_set(false);
			});
		},
		title: (
			!world.remote
			?	locale_error_world_not_uploaded
			: !world.writable
			?	locale_error_no_permission
			: world.public
			?	locale_unpublish_world
			:	locale_publish_world
		),
	}),
	node_dom('button', {
		disabled: (
			busy ||
			opened ||
			!world.local &&
			!world.writable
		),
		innerText: (
			world.local
			?	locale_delete_local
			:	locale_delete
		),
		onclick: () => {
			if (!confirm_(
				locale_ask_world_delete_1 + world.label + locale_ask_world_delete_2
			)) return;
			if (world.local) {
				chunks_delete(world.id);
				actions.world_remove(world.id);
			}
			else {
				busy_set(true);
				fetch_(API + 'world', {
					method: 'DELETE',
					headers: {'Content-Type': 'application/json'},
					body: JSON_stringify({
						what: 'world',
						world: world.id,
					}),
				})
				.then(response => (
					response_parse(response),
					defer(),
					world_selected_id_set(null),
					world_store_remote_reload(),
					busy_set(false),
					defer_end()
				))
				.catch(error => {
					alert_(locale_error_delete_world + error.message);
					busy_set(false);
				});
			}
		},
		title: (
			opened
			?	locale_error_world_is_opened
			: !world.local &&
				!world.writable
			?	locale_error_no_permission
			:	locale_delete_world
		),
	}),
])

const element_focus = element => {
	if (!LEGACY || element.scrollIntoView) {
		element.scrollIntoView(scrollIntoView_settings);
	}
	else {
		const scroller = element.parentElement.parentElement;
		scroller.scrollTop = (
			element.offsetTop - (scroller.offsetHeight / 2) + 35
		);
	}
}
const effect_focus = (selected, element) => {
	if (selected) {
		setTimeout_(element_focus, 0, element);
	}
}

function WorldItem({
	I,
	account,
	busy,
	busy_set,
	view_set,
	world_selected,
	world_selected_id_set,
	world_syncing,
	worlds_opened,
}) {
	const selected = I === world_selected;

	const element = hook_dom('tr', {
		F: {
			selected,
		},
		onclick: () => {
			world_selected_id_set(I.id);
		},
	});

	hook_effect(effect_focus, [selected, element]);

	return [
		node_dom('td[style=width:0]', {
			innerText: `${
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
			}`,
			S: {
				color: (
					world_syncing === I.id
					?	'yellow'
					: I.local !== I.remote && I.local && I.remote
					?	'red'
					:	''
				),
			},
		}),
		node_dom('td', {
			innerText: I.label,
			title: I.id,
		}, [
			selected &&
			node(WorldButtons, {
				account,
				busy,
				busy_set,
				opened: worlds_opened.includes(I.id),
				view_set,
				world: I,
				world_selected_id_set,
			}),
		]),
		node_dom('td[style=width:0]', null, [
			node_dom(`div[title=${locale_modification}]`, {
				innerText: datify(Math_max(I.local, I.remote), true),
			}),
			selected &&
			node_dom(`div`, {
				innerText: (
					I.account_name
					?	I.account_name
					:	'-'
				),
				title: (
					I.account_name
					?	locale_owner
					:	locale_only_local
				),
			}),
		]),
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
	viewport_height,
	viewport_width,
}) {
	const [world_selected_id, world_selected_id_set] = hook_state(config.world_last);
	// if the world was renamed, update the selected id
	hook_effect(() => {
		if (world_rename && world_selected_id === world_rename[0]) {
			world_selected_id_set(world_rename[1]);
		}
	}, [world_rename]);	
	const world_selected = hook_memo(() => (
		worlds_merged.find(world => world.id === world_selected_id) || null
	), [
		world_selected_id,
		worlds_merged,
	]);
	const [busy, busy_set] = hook_state(false);

	hook_dom(`div[className=menu]${SSR ? '' : '[style=overflow-y:hidden]'}`);

	return [
		node_dom(`button[innerText=${locale_settings}][style=position:absolute]`, {
			onclick: () => {
				view_set(APP_VIEW_SETTINGS);
			},
		}),
		node_dom('button[style=position:absolute;right:0]', {
			disabled: account.rank > 0,
			innerText: account.rank ? account.label : locale_login,
			onclick: () => {
				location.href = '/account?redir=minicraft';
			},
		}),
		node_dom(`h1[innerText=${locale_worlds}]`),
		node_dom('div[className=row]', null, [
			node_dom(`button[innerText=${locale_refresh}][title=${locale_reload_list}]`, {
				disabled: (
					world_list_cooldown ||
					world_list_loading ||
					connection_error !== null
				),
				onclick: world_store_remote_reload,
			}),
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
		]),
		node_dom('div[className=worlds]', {
			S: {
				height: (
					SSR
					?	'300px;height:calc(100%-140px)'
					:	`${Math_max(100, viewport_height - 140)}px`
				),
				width: `${Math_min(480, viewport_width - 16)}px`,
			},
		}, [
			!SSR &&
			node_dom('table[cellSpacing=0]', null, [
				node_map(WorldItem, worlds_merged, {
					_: Date_now(), // refresh dates as well
					account,
					busy,
					busy_set,
					view_set,
					world_selected,
					world_selected_id_set,
					world_syncing,
					worlds_opened,
				}),
			]),
		]),
	];
}
