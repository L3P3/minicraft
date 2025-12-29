import {
	hook_model,
} from './lui.js';

import {
	WINDOW_MODE_FLOATING,
	WINDOW_MODE_FULL,
	WINDOW_TYPE_EMPTY,
	WINDOW_TYPE_GAME,
	WORLD_STORED_NOT,
} from './constants.js';
import {
	VERSION,
} from './env.js';
import {
	Date_now,
	JSON_parse,
	JSON_stringify,
	Math_max,
	Object_keys,
	Set_,
	document_,
	localStorage_,
	localStorage_getItem,
	localStorage_removeItem,
	localStorage_setItem,
	prompt_,
	window_,
} from './helpers.js';
import {
	locale_unknown_world,
	locale_unknown_world_found,
} from './locale.js';

import {
	world_store_lists_merge,
} from '../game/m_world_store.js';

let config_loaded = JSON_parse(
	localStorage_getItem('minicraft.config') || null
);

// HACK remove deleted worlds' chunks (i am so sorry)
if (
	config_loaded &&
	config_loaded['worlds'] &&
	config_loaded['version'].startsWith('0.9.')
) {
	const prefixes_keep = new Set_(
		config_loaded['worlds']
		.map(world => 'minicraft.world.' + world.id)
	);
	for (const key of Object_keys(localStorage_))
	if (
		key.startsWith('minicraft.world.') &&
		!prefixes_keep.has(key.split(':', 1)[0])
	) {
		localStorage_removeItem(key);
	}
}

const reducers = {
	init: () => {
		let needs_save = false;
		const config = {
			flag_touch: false, // not saved
			pixel_grouping: 1,
			mouse_sensitivity: 3,
			resolution_scaling: 4,
			textures: 1,
			view_angle: 120,
			view_distance: 64,
			world_last: 0,
			/** @type {!Array<TYPE_WORLD_LISTING_LOCAL>} */
			worlds: [],
		};
		if (config_loaded) {
			let tmp = config_loaded['pixel_grouping'];
			if (tmp != null) {
				config.pixel_grouping = tmp;
			}
			if ((
				tmp = config_loaded['mouse_sensitivity']
			) != null) {
				config.mouse_sensitivity = tmp;
			}
			config.resolution_scaling = config_loaded['resolution_scaling'];
			if ((
				tmp = config_loaded['textures']
			) != null) {
				config.textures = tmp;
			}
			else {
				config.textures = (
					config_loaded['flag_textures']
					?	1
					:	0
				);
			}
			config.view_angle = config_loaded['view_angle'];
			config.view_distance = config_loaded['view_distance'];
			if ((
				tmp = config_loaded['world_last']
			) != null) {
				config.world_last = tmp;
			}
			if (
				tmp = config_loaded['worlds']
			) {
				config.worlds = tmp;
			}
			else if (
				localStorage_getItem('minicraft.world.0:meta')
			) {
				config.worlds[0] = {
					id: 0,
					label: (
						prompt_(locale_unknown_world_found, '') || locale_unknown_world
					).substring(0, 16),
					mod_l: Date_now(),
					mod_r: WORLD_STORED_NOT,
				};
				needs_save = true;
			}
			config_loaded = null;
		}
		const state = {
			account: {
				label: '',
				rank: 0,
			},
			config,
			config_saved: config,
			connection_error: null,
			cursor: null,
			screen_height: window_.innerHeight,
			screen_width: window_.innerWidth,
			windows: [
				{
					id: 0,
					mode_initial: WINDOW_MODE_FULL,
					type: WINDOW_TYPE_GAME,
				},
			],
			world_list_cooldown: true,
			world_list_loading: true,
			world_syncing: null,
			worlds_merged: world_store_lists_merge(config),
			worlds_opened: [],
		};
		if (needs_save) {
			state.config_saved = null;
			return reducers.config_save(state);
		}
		return state;
	},
	config_save: state => {
		const {
			config,
		} = state;
		if (config === state.config_saved) return state;
		localStorage_setItem('minicraft.config', JSON_stringify({
			'version': VERSION,
			'pixel_grouping': config.pixel_grouping,
			'mouse_sensitivity': config.mouse_sensitivity,
			'resolution_scaling': config.resolution_scaling,
			'textures': config.textures,
			'view_angle': config.view_angle,
			'view_distance': config.view_distance,
			'world_last': config.world_last,
			'worlds': config.worlds,
		}));
		return {
			...state,
			config_saved: config,
		};
	},
	config_reduce: (state, reducer) => (
		reducers.config_set(
			state,
			reducer(state.config)
		)
	),
	config_set: (state, patch) => ({
		...state,
		config: {
			...state.config,
			...patch,
		},
	}),
	config_touch_set: (state, flag_touch) => (
		state.config.flag_touch === flag_touch
		?	state
		:	reducers.config_set(state, {
				flag_touch,
			})
	),
	state_patch: (state, patch) => ({
		...state,
		...patch,
	}),
	window_add: (state, window) => (
		document_.activeElement.blur(),
		{
			...state,
			windows: [
				...state.windows,
				{
					id: Math_max(-1, ...state.windows.map(w => w.id)) + 1,
					mode_initial: WINDOW_MODE_FLOATING,
					type: WINDOW_TYPE_EMPTY,
					...window,
				},
			],
		}
	),
	window_remove: (state, id) => ({
		...state,
		windows: state.windows.filter(
			w => w.id !== id
		),
	}),
	window_focus: (state, id) => (
		state.windows[state.windows.length - 1].id === id
		?	state
		:	{
			...state,
			windows: [
				...state.windows.filter(
					w => w.id !== id
				),
				state.windows.find(
					w => w.id === id
				),
			],
		}
	),
	world_add: (state, world) => {
		const config = {
			...state.config,
			worlds: [
				...state.config.worlds,
				world,
			],
		};
		return {
			...state,
			config,
			worlds_merged: world_store_lists_merge(config),
		};
	},
	world_remove: (state, id) => {
		const config = {
			...state.config,
			worlds: state.config.worlds.filter(
				world => world.id !== id
			),
		};
		return {
			...state,
			config,
			worlds_merged: world_store_lists_merge(config),
		};
	},
	world_prop: (state, id, patch) => {
		const config = {
			...state.config,
			worlds: state.config.worlds.map(world => (
				world.id === id
				?	{
						...world,
						...patch,
					}
				:	world
			)),
		};
		return {
			...state,
			config,
			worlds_merged: world_store_lists_merge(config),
		};
	},
};

export let app_state;
export let actions;

export const hook_app_state = () => {
	[app_state, actions] = hook_model(reducers);
}
