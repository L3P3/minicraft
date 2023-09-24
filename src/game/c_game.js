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

import Bar from './c_bar.js';
import Inventory from './c_inventory.js';
import Messages from './c_messages.js';
import MenuStart from './c_menu_start.js';
import Settings from './c_settings.js';
import Terminal from './c_terminal.js';
import Touch from './c_touch.js';

import {
	GAMEMODE_SPECTATOR,
	KEY_MOUSE_DOWN,
	KEY_MOUSE_UP,
	MENU_INVENTORY,
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
	game_renderer_init,
	game_resolution_update,
	game_view_distance_update,
	game_world_close,
	game_world_open,
} from './m_game.js';

export default function Game({
	actions,
	config,
	ref,
}) {
	const model = hook_memo(game_create);
	const time_now = now();

	const frame = hook_dom(
		'div[className=game]',
		hook_memo(() => {
			const handler_mousebutton = event => (
				!model.world ||
				model.menu !== MENU_NONE || (
					model.flag_touch = false,
					document_.pointerLockElement === frame
					?	model.world.flag_paused || game_key(
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
					if (
						model.world &&
						!model.menu
					) {
						model.world.flag_paused = false;
						event.preventDefault();
					}
				},
				onwheel: event => {
					model.flag_touch = false;
					if (
						model.world &&
						!model.menu &&
						!model.world.flag_paused &&
						Math.abs(event.deltaY) > 5
					) {
						const key =
							event.deltaY > 0
							?	KEY_MOUSE_DOWN
							:	KEY_MOUSE_UP;
						game_key(model, key, true);
						game_key(model, key, false);
						event.preventDefault();
					}
				},
			};
		})
	);
	const pointer_locked = document_.pointerLockElement === frame;

	hook_effect(() => (
		model.actions = actions,
		model.config = config,
		model.frame_element = frame,
		ref.game = model,
		config.world_last !== -1 &&
			game_world_open(model),
		() => (
			model.world &&
				game_world_close(model),
			ref.game = null
		)
	));

	hook_effect(() => (
		model.config = config,
		model.renderer && (
			model.renderer.flag_dirty = true
		),
		model.world &&
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
		if (!model.world) return;
		// esc pressed ingame?
		if (
			!pointer_locked &&
			!model.world.flag_paused &&
			!model.menu
		)
			model.menu = MENU_SETTINGS;
		model.world.flag_paused = !pointer_locked;
	}, [pointer_locked]);

	hook_effect(shouldRelease => (
		pointer_locked &&
		shouldRelease &&
			document_.exitPointerLock()
	), [
		model.world && (
			model.world.flag_paused ||
			model.menu !== MENU_NONE
		)
	]);

	hook_effect(() => (
		game_render(model, time_now)
	), [time_now]);

	hook_rerender();

	return [
		model.world &&
		node_dom('canvas', {
			R: hook_static(canvas_element => (
				game_renderer_init(model, canvas_element)
			)),
		}),
		!model.world &&
		model.menu === MENU_NONE &&
		node(MenuStart, {
			actions,
			game: model,
		}),
		model.world &&
		model.flag_hud &&
		model.menu !== MENU_TERMINAL &&
		node(Messages, {
			messages: model.messages,
			time_now,
		}),
		model.world &&
		model.renderer &&
		model.flag_diagnostics &&
		node_dom('div[className=diagnostics]', {
			innerText: model.renderer.diagnostics,
		}),
		model.world &&
		model.flag_touch &&
		node(Touch, {
			game: model,
			keys_active_check: model.keys_active_check,
		}),
		model.world &&
		model.flag_hud &&
		model.menu !== MENU_INVENTORY &&
		model.player.gamemode !== GAMEMODE_SPECTATOR &&
		node(Bar, {
			player: model.player,
			time_now,
		}),
		model.menu === MENU_INVENTORY &&
		node(Inventory, {
			game: model,
			time_now,
		}),
		model.menu === MENU_SETTINGS &&
		node(Settings, {
			actions,
			config,
			game: model,
		}),
		model.menu === MENU_TERMINAL &&
		node(Terminal, {
			game: model,
			messages: model.messages,
		}),
	];
}
