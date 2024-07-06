import {
	VERSION,
} from './env.js';
import {
	JSON_parse,
	JSON_stringify,
	Object_keys,
	localStorage_,
	localStorage_getItem,
	localStorage_removeItem,
	localStorage_setItem,
} from './helpers.js';
import {
	locale_unknown_world,
	locale_unknown_world_found,
} from './locale.js';

let config_loaded = localStorage_getItem('minicraft.config');
config_loaded = config_loaded && JSON_parse(config_loaded);

// HACK remove deleted worlds' chunks (i am so sorry)
if (
	config_loaded &&
	config_loaded['worlds'] &&
	config_loaded['version'].startsWith('0.9.')
) {
	const prefixes_keep = new Set(
		config_loaded['worlds']
		.map(world => 'minicraft.world.' + world.id)
	);
	for (const key of Object_keys(localStorage_))
	if (
		key.startsWith('minicraft.world.') &&
		!prefixes_keep.has(key.split(':')[0])
	) {
		localStorage_removeItem(key);
	}
}

export const reducers = {
	init: () => {
		let needs_save = false;
		const config = {
			flag_textures: true,
			flag_touch: false, // not saved
			pixel_grouping: 1,
			mouse_sensitivity: 3,
			resolution_scaling: 4,
			view_angle: 120,
			view_distance: 64,
			world_last: 0,
			/** @type {!Array<TYPE_WORLD_LISTING_LOCAL>} */
			worlds: [],
		};
		if (config_loaded) {
			let tmp = config_loaded['flag_textures'];
			if (tmp != null) {
				config.flag_textures = tmp;
			}
			if ((
				tmp = config_loaded['pixel_grouping']
			) != null) {
				config.pixel_grouping = tmp;
			}
			if ((
				tmp = config_loaded['mouse_sensitivity']
			) != null) {
				config.mouse_sensitivity = tmp;
			}
			config.resolution_scaling = config_loaded['resolution_scaling'];
			config.view_angle = config_loaded['view_angle'];
			config.view_distance = config_loaded['view_distance'];
			if ((
				tmp = config_loaded['world_last']
			) != null) {
				config.world_last = tmp;
			}
			if ((
				tmp = config_loaded['worlds']
			) != null) {
				config.worlds = tmp;
			}
			else if (
				localStorage_getItem('minicraft.world.0:meta')
			) {
				config.worlds[0] = {
					id: 0,
					label: (
						prompt(locale_unknown_world_found, '') || locale_unknown_world
					).substring(0, 16),
					mod_l: Date.now(),
					mod_r: 0,
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
			'flag_textures': config.flag_textures,
			'pixel_grouping': config.pixel_grouping,
			'mouse_sensitivity': config.mouse_sensitivity,
			'resolution_scaling': config.resolution_scaling,
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
	account_set: (state, account) => ({
		...state,
		account,
	}),
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
	world_add: (state, world) => ({
		...state,
		config: {
			...state.config,
			worlds: [
				...state.config.worlds,
				world,
			],
		},
	}),
	world_remove: (state, id) => ({
		...state,
		config: {
			...state.config,
			worlds: state.config.worlds.filter(world => world.id !== id),
		},
	}),
	world_prop: (state, id, patch) => ({
		...state,
		config: {
			...state.config,
			worlds: state.config.worlds.map(world => (
				world.id === id
				?	{
						...world,
						...patch,
					}
				:	world
			)),
		},
	}),
};
