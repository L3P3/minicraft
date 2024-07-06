import {
	hook_dom,
	hook_effect,
	hook_static,
	node_dom,
} from '../etc/lui.js';

import {
	APP_VIEW_WORLDS,
} from '../etc/constants.js';
import {
	locale_back_to_game,
	locale_mouse_sensitivity,
	locale_pixel_grouping,
	locale_resolution,
	locale_settings,
	locale_surfaces_colored,
	locale_surfaces_textured,
	locale_surfaces,
	locale_view_angle,
	locale_view_distance,
	locale_world_leave,
} from '../etc/locale.js';

import {
	game_menu_close,
	game_save,
} from './m_game.js';

export default function Settings({
	actions: {
		config_reduce,
		config_set,
	},
	config,
	game,
	view_set,
}) {
	hook_effect(() => (
		game_save(game)
	));

	hook_dom('div[className=menu overlay]');

	return [
		node_dom(`h1[innerText=${locale_settings}]`),
		hook_static(node_dom('center', null, [
			node_dom(`button[innerText=${locale_back_to_game}]`, {
				onclick: () => {
					game_menu_close(game);
				},
			}),
		])),
		node_dom('div[className=settings]', null, [
			node_dom('button', {
				innerText: (
					locale_surfaces + ':\n' +
					(
						config.flag_textures
						?	locale_surfaces_textured
						:	locale_surfaces_colored
					)
				),
				onclick: hook_static(() => (
					config_reduce(config => ({
						flag_textures: !config.flag_textures,
					}))
				)),
			}),
			node_dom(`label[innerText=${locale_resolution}:]`, null, [
				node_dom('input[type=range][min=1][max=100][step=1]', {
					value: 101 - config.resolution_scaling,
					onchange: hook_static(event => (
						config_set({
							resolution_scaling: 101 - Number(event.target.value),
						})
					)),
				}),
			]),
			node_dom(`label[innerText=${locale_view_angle}:]`, null, [
				node_dom('input[type=range][min=1][max=180][step=1]', {
					value: config.view_angle,
					onchange: hook_static(event => (
						config_set({
							view_angle: Number(event.target.value),
						})
					)),
				}),
			]),
			node_dom(`label[innerText=${locale_view_distance}:]`, null, [
				node_dom('input[type=range][min=1][max=128][step=1]', {
					value: config.view_distance,
					onchange: hook_static(event => (
						config_set({
							view_distance: Number(event.target.value),
						})
					)),
				}),
			]),
			node_dom(`label[innerText=${locale_pixel_grouping}:]`, null, [
				node_dom('input[type=range][min=1][max=6][step=1]', {
					value: config.pixel_grouping,
					onchange: hook_static(event => (
						config_set({
							pixel_grouping: Number(event.target.value),
						})
					)),
				}),
			]),
			node_dom(`label[innerText=${locale_mouse_sensitivity}:]`, null, [
				node_dom('input[type=range][min=1][max=15][step=1]', {
					value: config.mouse_sensitivity,
					onchange: hook_static(event => (
						config_set({
							mouse_sensitivity: Number(event.target.value),
						})
					)),
				}),
			]),
		]),
		hook_static(node_dom('center', null, [
			node_dom(`button[innerText=${locale_world_leave}]`, {
				onclick: () => {
					view_set(APP_VIEW_WORLDS);
				},
			}),
		])),
	];
}
