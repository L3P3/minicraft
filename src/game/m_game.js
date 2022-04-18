import {
	now,
} from '../etc/lui.js';

import {
	BLOCK_TYPE_AIR,
	BLOCK_TYPE_FACE_B,
	BLOCK_TYPE_FACE_E,
	BLOCK_TYPE_FACE_S,
	BLOCK_TYPE_FACE_T,
	BLOCK_TYPE_FACE_W,
	CHUNK_HEIGHT,
	CHUNK_WIDTH_L2,
	COORDINATE_OFFSET,
	KEY_MOUSE_LEFT,
	KEY_MOUSE_MIDDLE,
	KEY_MOUSE_RIGHT,
	KEY_MOVE_BACK,
	KEY_MOVE_DOWN,
	KEY_MOVE_LEFT,
	KEY_MOVE_FRONT,
	KEY_MOVE_RIGHT,
	KEY_MOVE_UP,
	MENU_NONE,
	MENU_SETTINGS,
	MENU_TERMINAL,
} from '../etc/constants.js';
import {
	DEBUG, VERSION,
} from '../etc/env.js';
import {
	Math_floor,
	Math_max,
	Math_min,
	Math_PI,
	Math_PI_h,
	Math_round,
} from '../etc/helpers.js';
import {
	player_create,
	player_tick,
} from './m_player.js';
import {
	renderer_canvas_init,
	renderer_create,
	renderer_destroy,
	renderer_render,
} from './m_renderer.js';
import {
	world_block_get,
	world_block_set,
	world_chunk_load,
	world_chunk_load_setup,
	world_create,
	world_data_init,
	world_save,
} from './m_world.js';

let message_id_counter = 0;

export const game_create = () => {
	const world = world_create();
	return {
		config: null,
		flag_diagnostics: DEBUG,
		flag_paused: true,
		flag_touch: DEBUG,
		frame_element: null,
		frame_last: 0,
		keys_active: new Set,
		keys_active_check: '',
		menu: MENU_NONE,
		messages: [],
		player: player_create(world),
		renderer: null,
		resolution_raw_x: 1,
		resolution_raw_y: 1,
		resolution_x: 0,
		resolution_y: 0,
		tick_interval: null,
		time: 0,
		time_f: 0.0,
		world,
	};
}

export const game_start = (model, canvas_element) => {
	model.renderer = renderer_create(model, canvas_element);
	model.tick_interval = setInterval(() => {
		game_tick(model);
	}, 50);
}

export const game_save = model => (
	world_save(model.world)
);

export const game_umount = model => (
	clearInterval(model.tick_interval),
	renderer_destroy(model.renderer)
);

export const game_resolution_update = model => {
	const {resolution_scaling} = model.config;
	const x = Math_max(1, Math_round(model.resolution_raw_x / resolution_scaling));
	const y = Math_max(1, Math_round(model.resolution_raw_y / resolution_scaling));

	if (
		x === model.resolution_x &&
		y === model.resolution_y
	) return;

	model.resolution_x = x;
	model.resolution_y = y;
	if (model.renderer) {
		model.renderer.flag_dirty = true;
		renderer_canvas_init(model.renderer);
	}
}

export const game_view_distance_update = model => {
	const {world} = model;
	const {view_distance} = model.config;
	// TODO proper formula would be less embarrassing
	const size_l2 = (
		view_distance < 17 ? 2
		: view_distance < 49 ? 3
		: view_distance < 113 ? 4
		: view_distance < 241 ? 5
		: view_distance < 497 ? 6
		: view_distance < 1009 ? 7
		: view_distance < 2033 ? 8
		: view_distance < 4081 ? 9
		: view_distance < 8177 ? 10
		: view_distance < 16369 ? 11
		: view_distance < 32753 ? 12
		: 13
	);
	/*Math_max(
		Math_ceil(
			Math_log2(
				model.config.view_distance
			) - CHUNK_WIDTH_L2 + 2
		),
		2
	);*/
	//console.log('size_l2', world.size_l2, size_l2, 1 << (CHUNK_WIDTH_L2 + size_l2));
	if (world.size_l2 !== size_l2)
		world_data_init(world, size_l2);
}

/**
	@noinline
*/
export const game_mouse_catch = model => (
	model.frame_element.requestPointerLock()
);

export const game_mouse_move = (model, event) => {
	if (!model.flag_paused) {
		const factor = model.config.mouse_sensitivity * Math_PI / Math_max(
			model.resolution_raw_x,
			model.resolution_raw_y
		);
		model.player.angle_h = (
			model.player.angle_h
			+ event.movementX * factor
			+ Math_PI * 100
		) % (Math_PI * 2);
		model.player.angle_v = (
			Math_max(
				-Math_PI_h,
				Math_min(
					Math_PI_h,
					model.player.angle_v
					- event.movementY * factor
				)
			)
		);
	}
}

/**
	@noinline
*/
const game_movement_calc = (neg, pos) => (
	neg === pos
	?	0
	:	.1 - neg * .2
);
/**
	@noinline
*/
const game_movement_x_update = model => (
	model.player.accel_x = game_movement_calc(
		(
			model = model.keys_active
		).has(KEY_MOVE_LEFT) ||
		model.has(65),
		model.has(KEY_MOVE_RIGHT) ||
		model.has(68)
	)
);
/**
	@noinline
*/
const game_movement_y_update = model => (
	model.player.accel_y = game_movement_calc(
		(
			model = model.keys_active
		).has(KEY_MOVE_DOWN) ||
		model.has(16),
		model.has(KEY_MOVE_UP) ||
		model.has(32)
	)
);
/**
	@noinline
*/
const game_movement_z_update = model => (
	model.player.accel_z = game_movement_calc(
		(
			model = model.keys_active
		).has(KEY_MOVE_BACK) ||
		model.has(83),
		model.has(KEY_MOVE_FRONT) ||
		model.has(87)
	)
);

/**
	@return {boolean} true if state changed
*/
export const game_key = (model, code, state) => {
	//console.log('KEY', code, state);
	const {keys_active} = model;
	if (state) {
		if (keys_active.has(code)) return false;
		keys_active.add(code);
		switch (code) {
			case KEY_MOUSE_LEFT:
				model.player.block_focus_y >= 0 &&
					world_block_set(
						model.world,
						model.player.block_focus_x,
						model.player.block_focus_y,
						model.player.block_focus_z,
						BLOCK_TYPE_AIR
					);
				break;
			case KEY_MOUSE_MIDDLE:
			case 71: // G
				if (model.player.block_focus_y >= 0)
						model.player.holds = world_block_get(
							model.world,
							model.player.block_focus_x,
							model.player.block_focus_y,
							model.player.block_focus_z
						);
				break;
			case KEY_MOUSE_RIGHT:
				if (model.player.block_focus_y >= 0) {
					let x = model.player.block_focus_x;
					let y = model.player.block_focus_y;
					let z = model.player.block_focus_z;
					switch (model.player.block_focus_face) {
						case BLOCK_TYPE_FACE_W: --x; break;
						case BLOCK_TYPE_FACE_E: ++x; break;
						case BLOCK_TYPE_FACE_B: --y; break;
						case BLOCK_TYPE_FACE_T: ++y; break;
						case BLOCK_TYPE_FACE_S: --z; break;
						default: ++z;
					}
					y >= 0 && y < CHUNK_HEIGHT &&
						world_block_set(
							model.world,
							x & ((1 << (CHUNK_WIDTH_L2 + model.world.size_l2)) - 1),
							y,
							z & ((1 << (CHUNK_WIDTH_L2 + model.world.size_l2)) - 1),
							model.player.holds
						);
				}
				break;
			case 27: // ESC
				if (model.menu) {
					model.flag_paused = false;
					model.menu = MENU_NONE;
				}
				else {
					model.flag_paused = true;
					model.menu = MENU_SETTINGS;
				}
				break;
			case KEY_MOVE_DOWN:
			case KEY_MOVE_UP:
			case 16: // SHIFT
			case 32: // SPACE
				game_movement_y_update(model);
				break;
			case KEY_MOVE_LEFT:
			case KEY_MOVE_RIGHT:
			case 65: // A
			case 68: // D
				game_movement_x_update(model);
				break;
			case 80: // P
				model.flag_paused = !model.flag_paused;
				break;
			case 82: // R
				model.player.position_x = model.world.spawn_x;
				model.player.position_y = model.world.spawn_y;
				model.player.position_z = model.world.spawn_z;
				break;
			case KEY_MOVE_BACK:
			case KEY_MOVE_FRONT:
			case 83: // S
			case 87: // W
				game_movement_z_update(model);
				break;
			case 84: // T
				if (!model.menu)
					model.menu = MENU_TERMINAL;
				break;
			case 114: // F3
				model.flag_diagnostics = !model.flag_diagnostics;
				break;
			case 116: // F5
				if (DEBUG)
					location.reload();
			default:
				return false;
		}
	}
	else {
		if (!keys_active.delete(code)) return false;
		switch (code) {
			case KEY_MOVE_DOWN:
			case KEY_MOVE_UP:
			case 16: // SHIFT
			case 32: // SPACE
				game_movement_y_update(model);
				break;
			case KEY_MOVE_LEFT:
			case KEY_MOVE_RIGHT:
			case 65: // A
			case 68: // D
				game_movement_x_update(model);
				break;
			case KEY_MOVE_BACK:
			case KEY_MOVE_FRONT:
			case 83: // S
			case 87: // W
				game_movement_z_update(model);
		}
	}
	model.keys_active_check = [...keys_active].join(',');
	return true;
}

export const game_render = (model, now) => {
	model.frame_last &&
	!model.flag_paused &&
		player_tick(model.player, now - model.frame_last);
	model.renderer &&
		renderer_render(model.renderer, now);
	model.frame_last = now;
}

const game_tick = model => {
	if (model.flag_paused) return;
	model.time = (model.time + 1) % 24e3;
	model.time_f = ((model.time + 6e3) * (1 / 24e3)) % 1;

	const {player, world} = model;
	const chunk_x_abs = Math_floor(player.position_x) >> CHUNK_WIDTH_L2;
	const chunk_z_abs = Math_floor(player.position_z) >> CHUNK_WIDTH_L2;
	if (
		world.offset_x + world.focus_x !== chunk_x_abs ||
		world.offset_z + world.focus_z !== chunk_z_abs
	) {
		const world_size = 1 << world.size_l2;
		world.offset_x = chunk_x_abs - (
			world.focus_x = (
				COORDINATE_OFFSET + chunk_x_abs
			) % world_size
		);
		world.offset_z = chunk_z_abs - (
			world.focus_z = (
				COORDINATE_OFFSET + chunk_z_abs
			) % world_size
		);
		world_chunk_load_setup(world);
	}

	world_chunk_load(world);
}

export const game_message_send = (model, value) => {
	if (value.charAt(0) === '/') {
		const args = value.substr(1).split(' ');
		const command = args.shift();
		switch(command) {
			case 'exit':
				model.flag_paused = false;
				model.menu = MENU_NONE;
				break;
			case 'help':
				game_message_print(model, 'commands: exit, help, version');
				break;
			case 'version':
				game_message_print(model, 'Minicraft ' + VERSION);
				break;
			default:
				game_message_print(model, 'unknown command: ' + command)
		}
	}
	else {
		game_message_print(model, '<me> ' + value);
	}
}

const game_message_print = (model, value) => {
	model.messages = [
		...model.messages.slice(-30),
		{
			id: ++message_id_counter,
			time: now(),
			value,
		},
	];
}
