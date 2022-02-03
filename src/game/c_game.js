import {
	Math_PI,
} from '../etc/helpers.js';
import {
	hook_dom,
	hook_effect,
	hook_memo,
	hook_rerender,
	hook_static,
	node,
	node_dom,
	now,
} from '../etc/lui.js';

import Menu from './c_menu.js';

import {
	game_create,
	game_render,
	game_resolution_raw_set,
	game_start,
	game_umount,
} from './m_game.js';

export default function Game({
	ref,
}) {
	const frame = hook_dom('div[className=game]');
	const model = hook_memo(game_create);

	hook_effect(() => (
		ref.game = model,
		() => (
			game_umount(model),
			ref.game = null
		)
	));

	hook_effect((width, height) => (
		game_resolution_raw_set(model, width, height)
	), [frame.offsetWidth, frame.offsetHeight]);

	hook_effect(now => (
		game_render(model, now)
	), [now()]);

	hook_rerender();

	return [
		node_dom('canvas', {
			R: hook_static(element => {
				game_start(model, element);
			}),
		}),
		model.renderer &&
		model.flag_diagnostics &&
		node_dom('div[className=diagnostics]', {
			innerText: model.renderer.diagnostics,
		}),
		model.flag_menu &&
		node(Menu, {
			game: model,
			_1: model.resolution_scaling,
			_2: model.view_angle,
			_3: model.view_distance,
		}),
	];
}
