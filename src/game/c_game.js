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
	document_,
	Math_max,
} from '../etc/helpers.js';
import {
	game_create,
	game_key,
	game_mouse_catch,
	game_mouse_move,
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
	const model = hook_memo(game_create);

	const frame = hook_dom(
		'div[className=game]',
		hook_memo(() => {
			const handler_mousebutton = event => (
				model.flag_menu || (
					document_.pointerLockElement === frame
					?	model.flag_paused || game_key(
							model,
							-1 - event.button,
							event.type === 'mousedown'
						)
					:	game_mouse_catch(model),
					event.preventDefault(),
					false
				)
			);
			return {
				onmousedown: handler_mousebutton,
				onmousemove: event => game_mouse_move(model, event),
				onmouseup: handler_mousebutton,
			};
		})
	);
	const pointer_locked = document_.pointerLockElement === frame;

	hook_effect(() => (
		model.frame_element = frame,
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

	// two-way binding for lock and pause
	hook_effect(() => {
		// esc pressed ingame?
		if (!pointer_locked && !model.flag_paused)
			model.flag_menu = true;
		model.flag_paused = !pointer_locked;
	}, [pointer_locked]);

	hook_effect(flag_paused => (
		flag_paused && pointer_locked &&
			document_.exitPointerLock()
	), [model.flag_paused]);

	hook_effect(now => (
		game_render(model, now)
	), [now()]);

	hook_rerender();

	return [
		node_dom('canvas', {
			R: hook_static(canvas_element => (
				game_start(model, canvas_element)
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
