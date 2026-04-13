import {
	defer,
	defer_end,
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
	Promise_resolve,
	fetch_,
	response_parse,
} from '../etc/helpers.js';
import {
	API_DATA,
	VERSION,
} from '../etc/env.js';
import {
	locale_back,
	locale_back_to_game,
	locale_disabled,
	locale_mouse_sensitivity,
	locale_pixel_grouping,
	locale_project_page,
	locale_resolution,
	locale_settings,
	locale_surface_add,
	locale_surface_plain,
	locale_surfaces,
	locale_version,
	locale_view_angle,
	locale_view_distance,
	locale_world_leave,
} from '../etc/locale.js';
import {
	actions,
} from '../etc/state.js';

import {
	game_menu_close,
	game_save,
} from './m_game.js';

function TextureItem({
	/** TYPE_TEXTURES_ITEM */ I,
	current,
	surface_loading,
}) {
	hook_dom('tr');
	return [
		node_dom('td', null, [
			node_dom('button', {
				disabled: (
					I.id === current ||
					surface_loading > 0
				),
				innerText: `${I.label} (${I.owner})`,
				onclick: () => {
					defer();
					actions.config_set({
						textures: I.id,
					});
					actions.state_patch({
						surface_loading: I.id,
					});
					defer_end();
				},
			}),
		]),
	];
}

export default function Settings({
	game,
	state: {
		config,
		surface_loading,
	},
	view_set,
}) {
	game && hook_effect(() => (
		game_save(game)
	));

	const [textures_opened, textures_opened_set] = hook_state(false);
	const textures = hook_async(() => (
		!textures_opened ? Promise_resolve(null) :
		fetch_(`${API_DATA}textures.json`)
		.then(response_parse)
		.catch(_error => null)
	), [textures_opened], null);

	hook_dom('div[className=menu]');

	return [
		node_dom('h1', {
			innerText: (
				textures_opened
				?	locale_surfaces
				:	locale_settings
			),
		}),
		node_dom('div[className=row]', null, [
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
		node_dom('table[className=settings]', null, [
			node_dom('tr', null, [
				node_dom('td', null, [
					node_dom(`button[innerText=${locale_surfaces}...]`, {
						onclick: () => {
							textures_opened_set(true);
						},
					}),
				]),
				node_dom('td', null, [
					node_dom(`label[htmlFor=setting-resolution]`, {
						innerText: `${locale_resolution}: 1:${config.resolution_scaling}\n`,
					}),
					node_dom('input[id=setting-resolution][type=range][min=1][max=20][step=1]', {
						value: 21 - config.resolution_scaling,
						onchange: event => (
							actions.config_set({
								resolution_scaling: 21 - Number(event.target.value),
							})
						),
					}),
				]),
			]),
			node_dom('tr', null, [
				node_dom('td', null, [
					node_dom('label[htmlFor=setting-view-angle]', {
						innerText: `${locale_view_angle}: ${config.view_angle}\n`,
					}),
					node_dom('input[id=setting-view-angle][type=range][min=1][max=180][step=1]', {
						value: config.view_angle,
						onchange: event => (
							actions.config_set({
								view_angle: Number(event.target.value),
							})
						),
					}),
				]),
				node_dom('td', null, [
					node_dom('label[htmlFor=setting-view-distance]', {
						innerText: `${locale_view_distance}: ${config.view_distance}\n`,
					}),
					node_dom('input[id=setting-view-distance][type=range][min=16][max=128][step=16]', {
						value: config.view_distance,
						onchange: event => (
							actions.config_set({
								view_distance: Number(event.target.value),
							})
						),
					}),
				]),
			]),
			node_dom('tr', null, [
				node_dom('td', null, [
					node_dom('label[htmlFor=setting-pixel-grouping]', {
						innerText: `${locale_pixel_grouping}: ${
							config.pixel_grouping === 1
							?	locale_disabled
							:	config.pixel_grouping
						}\n`,
					}),
					node_dom('input[id=setting-pixel-grouping][type=range][min=1][max=8][step=1]', {
						value: config.pixel_grouping,
						onchange: event => (
							actions.config_set({
								pixel_grouping: Number(event.target.value),
							})
						),
					}),
				]),
				node_dom('td', null, [
					node_dom('label[htmlFor=setting-mouse-sensitivity]', {
						innerText: `${locale_mouse_sensitivity}: ${config.mouse_sensitivity}\n`,
					}),
					node_dom('input[id=setting-mouse-sensitivity][type=range][min=1][max=15][step=1]', {
						value: config.mouse_sensitivity,
						onchange: event => (
							actions.config_set({
								mouse_sensitivity: Number(event.target.value),
							})
						),
					}),
				]),
			]),
			node_dom('tr', null, [
				node_dom('td', null, [
					node_dom(`button[innerText=${locale_version + VERSION}][title=${locale_project_page}]`, {
						onclick: () => {
							open('//github.com/L3P3/minicraft');
						},
					}),
				]),
			]),
		]),
		game &&
		!textures_opened &&
		node_dom('div[className=row]', null, [
			node_dom(`button[innerText=${locale_world_leave}]`, {
				onclick: () => {
					view_set(APP_VIEW_WORLDS);
				},
			}),
		]),

		textures_opened &&
		node_dom('table[className=settings]', null, [
			node_dom('tr', null, [
				node_dom('td', null, [
					node_dom(`button[innerText=${locale_surface_plain}]`, {
						disabled: config.textures === 0,
						onclick: () => {
							defer();
							actions.config_set({
								textures: 0,
							});
							actions.state_patch({
								surface_loading: 0,
							});
							defer_end();
						},
					}),
				]),
			]),
			textures &&
			node_map(TextureItem, textures, {
				current: config.textures,
				surface_loading,
			}),
		]),
		textures_opened &&
		node_dom('div[className=row]', null, [
			node_dom(`button[innerText=${locale_surface_add}]`, {
				onclick: () => {
					open('//l3p3.de/svr/minicraft/textures.html');
				},
			}),
		]),
	];
}
