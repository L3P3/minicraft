import {
	hook_dom,
	hook_static,
	node_dom,
} from '../etc/lui.js';

import {
	game_scaling_set,
} from './m_game.js';

export default function Menu({
	game,
}) {
	hook_dom('div[className=menu]');

	return [
		node_dom('h1[innerText=Menü]'),
		node_dom('div[className=settings]', null, [
			node_dom('label[innerText=Auflösung:]', null, [
				node_dom('input[type=range][min=1][max=100][step=1]', {
					value: 101 - game.resolution_scaling,
					onchange: hook_static(event => {
						game_scaling_set(
							game,
							101 - Number(event.target.value)
						);
					}),
				}),
			]),
			node_dom('label[innerText=Blickwinkel:]', null, [
				node_dom('input[type=range][min=1][max=180][step=1]', {
					value: game.view_angle,
					onchange: hook_static(event => {
						game.view_angle = Number(event.target.value);
						game.renderer.flag_dirty = true;
					}),
				}),
			]),
			node_dom('label[innerText=Sichtweite:]', null, [
				node_dom('input[type=range][min=1][max=128][step=1]', {
					value: game.view_distance,
					onchange: hook_static(event => {
						game.view_distance = Number(event.target.value);
						game.renderer.flag_dirty = true;
					}),
				}),
			]),
		]),
		node_dom('div', null, [
			node_dom('button[innerText=Zurück]', {
				onclick: hook_static(() => {
					game.flag_paused =
					game.flag_menu = false;
				}),
			}),
		]),
	];
}