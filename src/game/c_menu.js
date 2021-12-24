import {
	hook_dom,
	hook_state,
	node_dom,
} from '../etc/lui.js';

import {
	game_scaling_set,
} from './m_game.js';

export default function Menu({
	game,
}) {
	const [autoscaling, autoscaling_set] = hook_state(game.flag_autoscaling);
	const [scaling, scaling_set] = hook_state(game.resolution_scaling);

	hook_dom('div[className=menu]');

	return [
		node_dom('h1[innerText=Menü]'),
		node_dom('div[className=settings]', null, [
			node_dom('button', {
				innerText: `Bildskalierung: ${
					autoscaling
					?	'Dynamisch'
					:	'Statisch'
				}`,
				onclick: () => {
					autoscaling_set(
						game.flag_autoscaling = !autoscaling
					);
				},
			}),
			node_dom('label[innerText=Skalierung:]', null, [
				node_dom('input[type=range][min=1][max=100][step=1]', {
					value: 101 - scaling,
					onchange: event => {
						const value = 101 - Number(event.target.value);
						game_scaling_set(game, value);
						scaling_set(value);
					},
				}),
			]),
		]),
		node_dom('div', null, [
			node_dom('button[innerText=Zurück]', {
				onclick: () => {
					game.flag_paused =
					game.flag_menu = false;
				},
			}),
		]),
	];
}
