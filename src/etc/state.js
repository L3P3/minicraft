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
		const config = {
			flag_textures: true,
			mouse_sensitivity: 3,
			resolution_scaling: 4,
			view_angle: 120,
			view_distance: 64,
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
		}
		return {
			config,
			config_saved: config,
		};
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
};
