import {
	VERSION,
} from './env.js';
import {
	JSON_,
	localStorage_,
} from './helpers.js';

export const ACTION_SAVE = 1;
export const ACTION_CONFIG_SET = 2;

export const actions = [
	// INITIAL
	() => {
		const config = {
			flag_textures: true,
			resolution_scaling: 10,
			view_angle: 80,
			view_distance: 64,
		};
		const config_raw = localStorage_.getItem('minicraft.config');
		if (config_raw) {
			let config_loaded = JSON_.parse(config_raw);
			let tmp = config_loaded['flag_textures'];
			if (tmp !== undefined)
				config.flag_textures = tmp;
			config.resolution_scaling = config_loaded['resolution_scaling'];
			config.view_angle = config_loaded['view_angle'];
			config.view_distance = config_loaded['view_distance'];
		}
		return {
			config,
		};
	},
	// SAVE
	state => {
		const {config} = state;
		localStorage_.setItem('minicraft.config', JSON_.stringify({
			'version': VERSION,
			'flag_textures': config.flag_textures,
			'resolution_scaling': config.resolution_scaling,
			'view_angle': config.view_angle,
			'view_distance': config.view_distance,
		}));
		return state;
	},
	// CONFIG_SET
	(state, patch) => ({
		...state,
		config: {
			...state.config,
			...patch,
		},
	}),
];
