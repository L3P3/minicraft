import {
	hook_effect,
	hook_memo,
	hook_rerender,
	hook_static,
	node,
	node_dom,
	now,
} from '../etc/lui.js';

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
	flag_chromium,
	Math_max,
	window_,
} from '../etc/helpers.js';

import {
	game_create,
	game_destroy,
	game_key,
	game_mouse_catch,
	game_mouse_move_menu,
	game_mouse_move_player,
	game_render,
	game_renderer_init,
	game_resolution_update,
	game_view_distance_update,
} from './m_game.js';
import {
	player_rotate,
} from './m_player.js';

import Bar from './c_bar.js';
import Inventory from './c_inventory.js';
import Messages from './c_messages.js';
import Settings from './c_settings.js';
import Terminal from './c_terminal.js';
import Touch from './c_touch.js';

export default function Game({
	account,
	actions,
	config,
	frame,
	ref,
	view_set,
}) {
	const time_now = now();
	const pointer_locked = document_.pointerLockElement === frame;

	const model = hook_memo(() => (
		ref.game = game_create(actions, frame, config, account)
	));

	hook_effect(() => {
		const handler_mousebutton = event => {
			if (model.menu !== MENU_NONE) return true;

			if (document_.pointerLockElement === frame) {
				game_key(
					model,
					-1 - event.button,
					event.type === 'mousedown'
				);
			}
			else {
				game_mouse_catch(model);
			}

			return false;
		};
		const handler_mousemove = event => (
			document_.pointerLockElement === frame
			?	game_mouse_move_player(model, event)
			:	game_mouse_move_menu(model, event)
		);
		const handler_mousewheel = event => {
			actions.config_touch_set(false);

			if (
				model.menu === MENU_NONE &&
				!model.world.flag_paused &&
				Math.abs(event.deltaY) > 5
			) {
				const key =
					event.deltaY > 0
					?	KEY_MOUSE_DOWN
					:	KEY_MOUSE_UP;
				game_key(model, key, true);
				game_key(model, key, false);
				return false;
			}
		};

		const passive_true = {passive: true};

		frame.addEventListener('mousedown', handler_mousebutton);
		frame.addEventListener('mouseup', handler_mousebutton);
		frame.addEventListener('mousemove', handler_mousemove, passive_true);
		frame.addEventListener('wheel', handler_mousewheel, passive_true);

		return () => {
			frame.removeEventListener('mousedown', handler_mousebutton);
			frame.removeEventListener('mouseup', handler_mousebutton);
			frame.removeEventListener('mousemove', handler_mousemove, passive_true);
			frame.removeEventListener('wheel', handler_mousewheel, passive_true);
			game_destroy(model);
			ref.game = null;
		};
	});

	hook_effect(() => (
		model.config = config,
		model.renderer && (
			model.renderer.flag_dirty = true
		),
		game_view_distance_update(model)
	), [config]);

	hook_effect((width, height, ratio) => (
		model.resolution_css_ratio = ratio,
		model.resolution_raw_x = Math_max(1, width),
		model.resolution_raw_y = Math_max(1, height),
		game_resolution_update(model)
	), [
		frame.offsetWidth,
		frame.offsetHeight,
		window_.devicePixelRatio || 1,
		config.resolution_scaling,
	]);

	// two-way binding for lock and pause
	hook_effect(ingame => {
		// esc pressed ingame or focus lost
		if (
			!ingame &&
			!model.world.flag_paused &&
			model.menu === MENU_NONE
		) {
			model.menu = MENU_SETTINGS;
			// #46 move camera back after accidental jump
			if (
				flag_chromium &&
				(model.rotate_last_h | model.rotate_last_v) &&
				model.rotate_last_time > time_now - 100
			) {
				//game_message_print(model, `move back ${Math.round(model.rotate_last_h*100)}% ${Math.round(model.rotate_last_v*100)}%`);
				player_rotate(
					model.player,
					-model.rotate_last_h,
					-model.rotate_last_v
				);
				model.rotate_last_h = model.rotate_last_v = 0;
				model.renderer.flag_dirty = true;
			}
		}

		model.world.flag_paused = !ingame;
	}, [
		config.flag_touch &&
		model.menu === MENU_NONE ||
		pointer_locked,
	]);

	hook_effect(shouldRelease => (
		pointer_locked &&
		shouldRelease &&
			document_.exitPointerLock()
	), [
		model.world.flag_paused ||
		model.menu !== MENU_NONE,
	]);

	hook_effect(() => (
		game_render(model, time_now)
	), [time_now]);

	hook_rerender();

	const textures_id_ref = hook_static({val: 1});
	if (config.textures) textures_id_ref.val = config.textures;

	return [
		node_dom('canvas', {
			R: hook_static(canvas_element => (
				game_renderer_init(model, canvas_element)
			)),
		}),
		model.flag_hud &&
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
		config.flag_touch &&
		node(Touch, {
			game: model,
			keys_active_check: model.keys_active_check,
		}),
		model.flag_hud &&
		model.menu !== MENU_INVENTORY &&
		model.player.gamemode !== GAMEMODE_SPECTATOR &&
		node(Bar, {
			player: model.player,
			textures_id: textures_id_ref.val,
			time_now,
		}),
		model.menu === MENU_INVENTORY &&
		node(Inventory, {
			game: model,
			textures_id: textures_id_ref.val,
			time_now,
		}),
		model.menu === MENU_SETTINGS &&
		node(Settings, {
			actions,
			config,
			game: model,
			view_set,
		}),
		model.menu === MENU_TERMINAL &&
		node(Terminal, {
			game: model,
			messages: model.messages,
		}),
	];
}
