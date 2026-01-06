import {
	defer,
} from '../etc/lui.js';

import {
	WORLD_STORED_NOT,
	WORLD_STORED_SHOULD,
} from '../etc/constants.js';
import {
	API,
	API_DATA,
	VERSION,
} from '../etc/env.js';
import {
	alert_,
	clearTimeout_,
	confirm_,
	datify,
	Error_,
	fetch_,
	headers_json_post,
	JSON_stringify,
	Math_max,
	response_parse,
	setTimeout_,
} from '../etc/helpers.js';
import {
	locale_error_conflict_1,
	locale_error_conflict_2,
	locale_error_conflict_3,
	locale_error_conflict_4,
	locale_error_download_world,
	locale_error_loading_worldlist,
	locale_error_storage,
	locale_error_upload_world,
	locale_warn_world_remote_missing_1,
	locale_warn_world_remote_missing_2,
} from '../etc/locale.js';
import {
	actions,
	app_state,
} from '../etc/state.js';
import {
	chunks_delete,
	chunks_get,
	chunks_rename,
	chunks_set,
} from '../etc/storage.js';

/**
	@type {?Array<TYPE_WORLD_LISTING_REMOTE>}
*/
export let world_list_remote = null;
let world_list_merged = null;

let reload_cooldown_timeout = 0;
let syncing = false;

export let world_renamed_id_old = null;
export let world_renamed_id_new = 0;

export const world_store_init = () => world_list_remote_load(true);

export const world_store_remote_reload = () => {
	if (app_state.world_list_loading) return;
	clearTimeout_(reload_cooldown_timeout);
	actions.state_patch({
		world_list_cooldown: true,
		world_list_loading: true,
	});
	world_list_remote_load(false);
}

const world_list_remote_load = async initial => {
	reload_cooldown_timeout = setTimeout_(actions.state_patch, 5e3, {
		world_list_cooldown: false,
	});

	try {
		const response = await fetch_(`${API}world?what=${initial ? 'initia' : 'meta_al'}l`);
		const result = await response_parse(response);
		if (!initial) {
			world_list_remote = /** @type {!Array<TYPE_WORLD_LISTING_REMOTE>} */ (result);
			actions.state_patch({
				world_list_loading: false,
				worlds_merged: world_store_lists_merge(app_state.config),
			});
		}
		else {
			const json_initial = /** @type {TYPE_RESPONSE_INITIAL} */ (result);
			if (
				VERSION !== 'dev' &&
				json_initial.version_latest !== VERSION
			) {
				location.reload(true);
			}
			else {
				world_list_remote = json_initial.worlds;
				actions.state_patch({
					account: json_initial.account,
					world_list_loading: false,
					worlds_merged: world_store_lists_merge(app_state.config),
				});
			}
		}
	}
	catch (error) {
		actions.state_patch({
			connection_error: locale_error_loading_worldlist + error.message,
			world_list_loading: false,
		});
	}
}

const world_list_sort = (a, b) => Math_max(b.local, b.remote) - Math_max(a.local, a.remote);

/**
	generate worlds_merged from local and remote world lists
	save to call actions since in init, there is no remote data yet
*/
export const world_store_lists_merge = config => {
	const world_list = (
		world_list_remote
		?	world_list_remote
			.map(world => ({
				account_name: world.account_name,
				hash: world.hash,
				id: world.id,
				label: world.label,
				local: WORLD_STORED_NOT,
				public: world.public,
				remote: world.modified,
				writable: world.writable,
			}))
		:	[]
	);

	for (const world_local of /** @type {!Array<TYPE_WORLD_LISTING_LOCAL>} */ (config.worlds)) {
		const world_list_item = world_list.find(world => world.id === world_local.id);
		// present on remote?
		if (world_list_item) {
			const last_change_here = world_list_item.local = world_local.mod_l;
			const last_change_there = world_list_item.remote;
			const last_sync = world_local.mod_r;

			if (
				last_change_here > last_sync &&
				last_change_there > last_sync
			) {
				if (confirm_(
					locale_error_conflict_1 +
					world_local.label +
					locale_error_conflict_2 +
					datify(last_change_there, false) +
					locale_error_conflict_3 +
					datify(last_change_here, false) +
					locale_error_conflict_4
				)) {
					defer();
					actions.world_prop(world_local.id, {
						mod_l: world_list_item.local = last_sync,
					});
				}
				else {
					world_list_item.remote = last_sync;
				}
			}
		}
		// not present on remote?
		else {
			if (
				world_local.mod_r > WORLD_STORED_SHOULD &&
				world_list_remote
			) {
				alert_(
					locale_warn_world_remote_missing_1 +
					world_local.label +
					locale_warn_world_remote_missing_2
				);
				defer();
				actions.world_prop(world_local.id, {
					mod_r: WORLD_STORED_NOT,
				});
			}

			world_list.push({
				account_name: '',
				hash: 0,
				id: world_local.id,
				label: world_local.label,
				local: world_local.mod_l,
				public: false,
				remote: (
					world_local.mod_r === WORLD_STORED_SHOULD
					?	WORLD_STORED_SHOULD
					:	WORLD_STORED_NOT
				),
				writable: true,
			});
		}
	}

	return (
		world_list_merged = world_list.sort(world_list_sort)
	);
}

/**
	check for worlds to be synced and do it then
*/
export const world_store_sync_check = async () => {
	if (syncing) return;
	syncing = true;
	let world_syncable;
	try {
		while (
			world_syncable = world_list_merged.find(world =>
				world.local > WORLD_STORED_NOT &&
				world.remote > WORLD_STORED_NOT &&
				world.local !== world.remote
			)
		) {
			await world_store_sync(world_syncable);
			// Mark as synced in the current list to prevent re-syncing
			// before state updates propagate
			if (world_syncable.local < world_syncable.remote) {
				world_syncable.local = world_syncable.remote;
			}
			else {
				world_syncable.remote = world_syncable.local;
			}
			actions.state_patch({
				world_syncing: null,
			});
		}
	}
	catch (error) {
		actions.state_patch({
			connection_error: error.message,
			world_syncing: null,
		});
	}
	syncing = false;
}

/**
	download/upload world
	only call this when the modification time actually differs
*/
const world_store_sync = async world => {
	const {id} = world;
	actions.state_patch({
		world_syncing: id,
	});

	// download?
	if (world.local < world.remote) {
		try {
			const response = await fetch_(`${API_DATA}worlds/${world.hash}.json`);
			const result = await response.json();
			await chunks_set(id, /** @type {!Object<string, string>} */ (result));
			defer();
			actions.world_prop(id, {
				mod_l: world.remote,
				mod_r: world.remote,
			});
		}
		catch (error) {
			if (error.name === 'QuotaExceededError') {
				alert_(locale_error_storage);
				defer();
				actions.world_remove(id);
				chunks_delete(id);
			}
			else {
				throw Error_(locale_error_download_world + error.message);
			}
		}
	}
	// upload not allowed?
	else if (!world.writable) {
		defer();
		// set local modification time to remote to prevent further sync attempts
		actions.world_prop(id, {
			mod_l: app_state.config.worlds.find(world => world.id === id).mod_r,
		});
	}
	// upload?
	else {
		try {
			const data_promise = chunks_get(id);
			let id_new = id;

			// world must be registered first?
			if (world.remote === WORLD_STORED_SHOULD) {
				const response_register = await fetch_(API + 'world', {
					...headers_json_post,
					body: JSON_stringify({
						what: 'meta',
						label: world.label,
					}),
				});
				const result_register = await response_parse(response_register);
				// Await rename before upload to avoid inconsistent state if upload fails
				await chunks_rename(
					world_renamed_id_old = id,
					world_renamed_id_new = id_new = result_register.id
				);
			}

			const response_upload = await fetch_(API + 'world', {
				...headers_json_post,
				body: JSON_stringify({
					what: 'data',
					world: id_new,
					data: await data_promise,
				}),
			});
			const result_upload = await response_parse(response_upload);
			defer();
			if (world.remote === WORLD_STORED_SHOULD) {
				actions.world_prop(id, {
					id: id_new,
					mod_l: result_upload.modified,
					mod_r: result_upload.modified,
				});
			}
			else {
				actions.world_prop(id, {
					mod_l: result_upload.modified,
					mod_r: result_upload.modified,
				});
			}
		}
		catch (error) {
			defer();
			actions.world_prop(id, {
				mod_r: WORLD_STORED_NOT,
			});
			throw Error_(locale_error_upload_world + error.message);
		}
	}
}
