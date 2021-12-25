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
			node_dom('button', {
				innerText: `Bildskalierung: ${
					game.flag_autoscaling
					?	'Dynamisch'
					:	'Statisch'
				}`,
				onclick: hook_static(() => {
					game.flag_autoscaling = !game.flag_autoscaling;
				}),
			}),
			node_dom('label[innerText=Skalierung:]', null, [
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
