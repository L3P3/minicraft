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
	Math_max,
} from '../etc/helpers.js';
import {
	game_create,
	game_render,
	game_resolution_update,
	game_start,
	game_umount,
} from './m_game.js';

export default function Game({
	config,
	dispatch,
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

	hook_effect(() => {
		model.config = config;
		model.renderer && (
			model.renderer.flag_dirty = true
		);
	}, [config]);

	hook_effect((width, height) => (
		model.resolution_raw_x = Math_max(1, width),
		model.resolution_raw_y = Math_max(1, height),
		game_resolution_update(model)
	), [
		frame.offsetWidth,
		frame.offsetHeight,
		config.resolution_scaling,
	]);

	hook_effect(now => (
		game_render(model, now)
	), [now()]);

	hook_rerender();

	return [
		node_dom('canvas', {
			R: hook_static(element => (
				game_start(model, element)
			)),
		}),
		model.renderer &&
		model.flag_diagnostics &&
		node_dom('div[className=diagnostics]', {
			innerText: model.renderer.diagnostics,
		}),
		model.flag_menu &&
		node(Menu, {
			config,
			dispatch,
			game: model,
		}),
	];
}
