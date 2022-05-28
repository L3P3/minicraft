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

import Messages from './c_messages.js';
import Settings from './c_settings.js';
import Terminal from './c_terminal.js';
import Touch from './c_touch.js';

import {
	MENU_NONE,
	MENU_SETTINGS,
	MENU_TERMINAL,
} from '../etc/constants.js';
import {
	document_,
	Math_max,
	window_,
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
	game_view_distance_update,
} from './m_game.js';

export default function Game({
	config,
	dispatch,
	ref,
}) {
	const model = hook_memo(game_create);
	const time_now = now();

	const frame = hook_dom(
		'div[className=game]',
		hook_memo(() => {
			const handler_mousebutton = event => (
				model.menu !== MENU_NONE || (
					model.flag_touch = false,
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
				ontouchstart: event => {
					model.flag_touch = true;
					if (!model.menu) {
						model.flag_paused = false;
						event.preventDefault();
					}
				},
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

	hook_effect(() => (
		model.config = config,
		model.renderer && (
			model.renderer.flag_dirty = true
		),
		game_view_distance_update(model)
	), [config]);

	hook_effect((width, height, ratio) => (
		model.resolution_raw_x = Math_max(1, width * ratio),
		model.resolution_raw_y = Math_max(1, height * ratio),
		game_resolution_update(model)
	), [
		frame.offsetWidth,
		frame.offsetHeight,
		window_.devicePixelRatio || 1,
		config.resolution_scaling,
	]);

	// two-way binding for lock and pause
	hook_effect(() => {
		// esc pressed ingame?
		if (
			!pointer_locked &&
			!model.flag_paused &&
			!model.menu
		)
			model.menu = MENU_SETTINGS;
		model.flag_paused = !pointer_locked;
	}, [pointer_locked]);

	hook_effect(shouldRelease => (
		pointer_locked &&
		shouldRelease &&
			document_.exitPointerLock()
	), [model.flag_paused || model.menu]);

	hook_effect(now => (
		game_render(model, now)
	), [time_now]);

	hook_rerender();

	return [
		node_dom('canvas', {
			R: hook_static(canvas_element => (
				game_start(model, canvas_element)
			)),
		}),
		model.menu !== MENU_TERMINAL &&
		node(Messages, {
			messages: model.messages,
			time_now,
		}),
		model.renderer &&
		model.flag_diagnostics &&
		node_dom('div[className=diagnostics]', {
			innerText: model.renderer.diagnostics,
		}),
		model.flag_touch &&
		node(Touch, {
			game: model,
			keys_active_check: model.keys_active_check,
		}),
		model.menu === MENU_SETTINGS &&
		node(Settings, {
			config,
			dispatch,
			game: model,
		}),
		model.menu === MENU_TERMINAL &&
		node(Terminal, {
			game: model,
			messages: model.messages,
		}),
	];
}
