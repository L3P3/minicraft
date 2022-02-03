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
	game_resolution_raw_set,
	game_start,
	game_umount,
} from './m_game.js';
import {
	renderer_render,
} from './m_renderer.js';

export default function Game({
	ref,
}) {
	const frame = hook_dom('div[className=game]');
	const model = hook_memo(game_create);

	hook_effect(() => {
		ref.game = model;
		onmousemove = event => {
			if (model.flag_paused) return;
			model.player.angle_h = (event.clientX / model.resolution_raw_x - .5) * 2 * Math_PI;
			model.player.angle_v = (.5 - event.clientY / model.resolution_raw_y) * Math_PI;
		};
		return () => {
			game_umount(model);
			onmousemove = null;
			ref.game = null;
		};
	});

	hook_effect((width, height) => {
		game_resolution_raw_set(model, width, height);
	}, [frame.offsetWidth, frame.offsetHeight]);

	hook_effect(now => {
		model.renderer &&
			renderer_render(model.renderer, now);
	}, [now()]);

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
			_1: model.flag_autoscaling,
			_2: model.resolution_scaling,
		}),
	];
}
