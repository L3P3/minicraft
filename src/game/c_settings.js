import {
	hook_async,
	hook_dom,
	hook_effect,
	hook_state,
	node_dom,
	node_map,
} from '../etc/lui.js';

import {
	APP_VIEW_WORLDS,
} from '../etc/constants.js';
import {
	Promise_,
	fetch_,
} from '../etc/helpers.js';
import {
	API_DATA,
} from '../etc/env.js';
import {
	locale_back,
	locale_back_to_game,
	locale_mouse_sensitivity,
	locale_pixel_grouping,
	locale_project_page,
	locale_resolution,
	locale_settings,
	locale_surfaces_colored,
	locale_surfaces,
	locale_view_angle,
	locale_view_distance,
	locale_world_leave,
} from '../etc/locale.js';

import {
	game_menu_close,
	game_save,
} from './m_game.js';

function TextureItem({
	/** TYPE_TEXTURES_ITEM */ I,
	config_set,
	current,
}) {
	hook_dom('button', {
		disabled: I.id === current,
		innerText: `${I.label} (${I.owner})`,
		onclick: () => {
			config_set({
				textures: I.id,
			});
		},
	});
	return null;
}

export default function Settings({
	actions: {
		config_set,
	},
	config,
	game,
	view_set,
}) {
	game && hook_effect(() => (
		game_save(game)
	));
	
	const [textures_opened, textures_opened_set] = hook_state(false);
	const textures = hook_async(() => (
		!textures_opened ? Promise_.resolve(null) :
		fetch_(`${API_DATA}textures.json`)
		.then(response => (
			response.ok
			?	response.json()
			:	null
		))
		.catch(e => null)
	), [textures_opened], null);

	hook_dom('div[className=menu overlay]');

	return [
		node_dom('h1', {
			innerText: (
				textures_opened
				?	locale_surfaces
				:	locale_settings
			),
		}),
		node_dom('center', null, [
			node_dom('button', {
				innerText: (
					game && !textures_opened
					?	locale_back_to_game
					:	locale_back
				),
				onclick: () => {
					if (textures_opened) textures_opened_set(false);
					else if (game) game_menu_close(game);
					else view_set(APP_VIEW_WORLDS);
				},
			}),
		]),
		!textures_opened &&
		node_dom('div[className=settings]', null, [
			node_dom(`button[innerText=${locale_surfaces}...]`, {
				onclick: () => {
					textures_opened_set(true);
				},
			}),
			node_dom(`label[innerText=${locale_resolution}:]`, null, [
				node_dom('input[type=range][min=1][max=100][step=1]', {
					value: 101 - config.resolution_scaling,
					onchange: event => (
						config_set({
							resolution_scaling: 101 - Number(event.target.value),
						})
					),
				}),
			]),
			node_dom(`label[innerText=${locale_view_angle}:]`, null, [
				node_dom('input[type=range][min=1][max=180][step=1]', {
					value: config.view_angle,
					onchange: event => (
						config_set({
							view_angle: Number(event.target.value),
						})
					),
				}),
			]),
			node_dom(`label[innerText=${locale_view_distance}:]`, null, [
				node_dom('input[type=range][min=1][max=128][step=1]', {
					value: config.view_distance,
					onchange: event => (
						config_set({
							view_distance: Number(event.target.value),
						})
					),
				}),
			]),
			node_dom(`label[innerText=${locale_pixel_grouping}:]`, null, [
				node_dom('input[type=range][min=1][max=8][step=1]', {
					value: config.pixel_grouping,
					onchange: event => (
						config_set({
							pixel_grouping: Number(event.target.value),
						})
					),
				}),
			]),
			node_dom(`label[innerText=${locale_mouse_sensitivity}:]`, null, [
				node_dom('input[type=range][min=1][max=15][step=1]', {
					value: config.mouse_sensitivity,
					onchange: event => (
						config_set({
							mouse_sensitivity: Number(event.target.value),
						})
					),
				}),
			]),
			node_dom(`button[innerText=${locale_project_page}]`, {
				onclick: () => {
					open('//github.com/L3P3/minicraft');
				},
			}),
		]),
		game &&
		!textures_opened &&
		node_dom('center', null, [
			node_dom(`button[innerText=${locale_world_leave}]`, {
				onclick: () => {
					view_set(APP_VIEW_WORLDS);
				},
			}),
		]),

		textures_opened &&
		node_dom('div[className=settings]', null, [
			node_dom(`button[innerText=${locale_surfaces_colored}]`, {
				disabled: config.textures === 0,
				onclick: () => {
					config_set({
						textures: 0,
					});
				},
			}),
			textures &&
			node_map(TextureItem, textures, {
				config_set,
				current: config.textures,
			}),
		]),
	];
}
