import {
	hook_callback,
	hook_dom,
	hook_static,
	node_dom,
} from '../etc/lui.js';

import {
	ACTION_CONFIG_SET,
} from '../etc/state.js';
import {
	game_mouse_catch,
} from './m_game.js';

export default function Menu({
	config,
	dispatch,
	game,
}) {
	hook_dom('div[className=menu]');

	return [
		node_dom('h1[innerText=Menü]'),
		node_dom('div[className=settings]', null, [
			node_dom('button', {
				innerText: (
					'Oberflächen: ' +
					(config.flag_textures ? 'Texturiert' : 'Einfarbig')
				),
				onclick: hook_callback(current => {
					dispatch(ACTION_CONFIG_SET, {
						flag_textures: !current,
					});
				}, [config.flag_textures]),
			}),
			node_dom('label[innerText=Auflösung:]', null, [
				node_dom('input[type=range][min=1][max=100][step=1]', {
					value: 101 - config.resolution_scaling,
					onchange: hook_static(event => (
						dispatch(ACTION_CONFIG_SET, {
							resolution_scaling: 101 - Number(event.target.value),
						})
					)),
				}),
			]),
			node_dom('label[innerText=Blickwinkel:]', null, [
				node_dom('input[type=range][min=1][max=180][step=1]', {
					value: config.view_angle,
					onchange: hook_static(event => (
						dispatch(ACTION_CONFIG_SET, {
							view_angle: Number(event.target.value),
						})
					)),
				}),
			]),
			node_dom('label[innerText=Sichtweite:]', null, [
				node_dom('input[type=range][min=1][max=128][step=1]', {
					value: config.view_distance,
					onchange: hook_static(event => (
						dispatch(ACTION_CONFIG_SET, {
							view_distance: Number(event.target.value),
						})
					)),
				}),
			]),
			node_dom('label[innerText=Mausempfindlichkeit:]', null, [
				node_dom('input[type=range][min=1][max=15][step=1]', {
					value: config.mouse_sensitivity,
					onchange: hook_static(event => (
						dispatch(ACTION_CONFIG_SET, {
							mouse_sensitivity: Number(event.target.value),
						})
					)),
				}),
			]),
		]),
		node_dom('div', null, [
			node_dom('button[innerText=Zurück]', {
				onclick: hook_static(() => (
					game.flag_menu = false,
					game_mouse_catch(game)
				)),
			}),
		]),
	];
}
