import {
	VERSION,
} from './env.js';
import {
	JSON_parse,
	JSON_stringify,
	localStorage_getItem,
	localStorage_setItem,
} from './helpers.js';

export const reducers = {
	init: () => {
		let needs_save = false;
		const config = {
			flag_textures: true,
			mouse_sensitivity: 3,
			resolution_scaling: 4,
			view_angle: 120,
			view_distance: 64,
			world_last: 0,
			/** @type {!Array<TYPE_WORLD_LISTING_LOCAL>} */
			worlds: [],
		};
		const config_raw = localStorage_getItem('minicraft.config');
		if (config_raw) {
			let config_loaded = JSON_parse(config_raw);
			let tmp = config_loaded['flag_textures'];
			if (tmp != null)
				config.flag_textures = tmp;
			if ((
				tmp = config_loaded['mouse_sensitivity']
			) != null)
				config.mouse_sensitivity = tmp;
			config.resolution_scaling = config_loaded['resolution_scaling'];
			config.view_angle = config_loaded['view_angle'];
			config.view_distance = config_loaded['view_distance'];
			if ((
				tmp = config_loaded['world_last']
			) != null)
				config.world_last = tmp;
			if ((
				tmp = config_loaded['worlds']
			) != null)
				config.worlds = tmp;
			else if (
				localStorage_getItem('minicraft.world.0:meta')
			) {
				config.worlds[0] = {
					id: 0,
					label: (
						prompt('Es wurde eine namenlose lokale Welt gefunden. Wie soll sie heißen?', '') || 'Unbekannte Welt'
					).substring(0, 16),
					mod_l: Date.now(),
					mod_r: 0,
				};
				needs_save = true;
			}
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
