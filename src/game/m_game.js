import {
	now,
} from '../etc/lui.js';

import {
	BLOCK_TYPE_AIR,
	BLOCK_TYPE_BEDROCK,
	BLOCK_TYPE_COBBLE,
	BLOCK_TYPE_DIRT,
	BLOCK_TYPE_FACE_B,
	BLOCK_TYPE_FACE_E,
	BLOCK_TYPE_FACE_S,
	BLOCK_TYPE_FACE_T,
	BLOCK_TYPE_FACE_W,
	BLOCK_TYPE_GLASS,
	BLOCK_TYPE_GRASS,
	BLOCK_TYPE_LEAVES,
	BLOCK_TYPE_MAX,
	BLOCK_TYPE_STONE,
	CHUNK_HEIGHT,
	CHUNK_WIDTH_L2,
	GAMEMODE_CREATIVE,
	GAMEMODE_SPECTATOR,
	GAMEMODE_SURVIVAL,
	ITEM_HANDLES,
	KEY_MOUSE_DOWN,
	KEY_MOUSE_LEFT,
	KEY_MOUSE_MIDDLE,
	KEY_MOUSE_RIGHT,
	KEY_MOUSE_UP,
	KEY_MOVE_BACK,
	KEY_MOVE_DOWN,
	KEY_MOVE_FRONT,
	KEY_MOVE_LEFT,
	KEY_MOVE_RIGHT,
	KEY_MOVE_UP,
	KEY_ROTATE_DOWN,
	KEY_ROTATE_LEFT,
	KEY_ROTATE_RIGHT,
	KEY_ROTATE_UP,
	MENU_INVENTORY,
	MENU_NONE,
	MENU_SETTINGS,
	MENU_TERMINAL,
	MOUSE_MODE_NORMAL,
	MOUSE_MODE_SELECT,
	PLAYER_SLOTS,
	STACK_SIZE,
} from '../etc/constants.js';
import {
	DEBUG,
	VERSION,
} from '../etc/env.js';
import {
	clearInterval_,
	Math_floor,
	Math_max,
	Math_PI,
	Math_round,
	Number_,
	setInterval_,
} from '../etc/helpers.js';
import {
	player_collect,
	player_create,
	player_rotate,
	player_tick,
} from './m_player.js';
import {
	renderer_canvas_init,
	renderer_create,
	renderer_destroy,
	renderer_render,
} from './m_renderer.js';
import {
	stack_create,
} from './m_stack.js';
import {
	world_block_get,
	world_block_set,
	world_chunk_reset,
	world_create,
	world_data_init,
	world_load,
	world_offset_update,
	world_save,
} from './m_world.js';

let message_id_counter = 0;

export const game_create = () => {
	const world = world_create();
	const player = player_create(world);

	world_load(world, player);

	return {
		actions: null,
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
		player,
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
	model.tick_interval = setInterval_(() => (
		game_tick(model)
	), 50);
}

export const game_save = model => (
	world_save(model.world, model.player)
);

export const game_umount = model => (
	clearInterval_(model.tick_interval),
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
	const {player, world} = model;
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
		world_data_init(world, player, size_l2);
}

/**
	@noinline
*/
export const game_mouse_catch = model => (
	model.frame_element.requestPointerLock()
);

export const game_mouse_move = (model, event) => {
	if (
		!model.flag_paused &&
		!model.menu
	) {
		const factor = model.config.mouse_sensitivity * Math_PI / Math_max(
			model.resolution_raw_x,
			model.resolution_raw_y
		);
		player_rotate(
			model.player,
			event.movementX * factor,
			-event.movementY * factor
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
	@noinline
*/
const game_rotation_h_update = model => (
	model.player.rotation_h = game_movement_calc(
		model.keys_active.has(KEY_ROTATE_LEFT),
		model.keys_active.has(KEY_ROTATE_RIGHT)
	)
);
/**
	@noinline
*/
const game_rotation_v_update = model => (
	model.player.rotation_v = game_movement_calc(
		model.keys_active.has(KEY_ROTATE_DOWN),
		model.keys_active.has(KEY_ROTATE_UP)
	)
);

/**
	@return {boolean} true if state changed
*/
export const game_key = (model, code, state) => {
	//console.log('KEY', code, state);
	const {
		keys_active,
		player,
	} = model;
	if (state) {
		if (keys_active.has(code)) return false;
		keys_active.add(code);
		const {
			block_focus_x,
			block_focus_y,
			block_focus_z,
		} = player;
		switch (code) {
		case KEY_ROTATE_LEFT:
		case KEY_ROTATE_RIGHT:
			game_rotation_h_update(model);
			break;
		case KEY_ROTATE_DOWN:
		case KEY_ROTATE_UP:
			game_rotation_v_update(model);
			break;
		case KEY_MOUSE_LEFT:
			if (
				player.gamemode !== GAMEMODE_SPECTATOR &&
				block_focus_y >= 0
			) {
				if (player.mouse_mode === MOUSE_MODE_NORMAL) {
					if (player.gamemode === GAMEMODE_SURVIVAL) {
						let id = world_block_get(
							model.world,
							block_focus_x,
							block_focus_y,
							block_focus_z
						);
						if (id === BLOCK_TYPE_GRASS) id = BLOCK_TYPE_DIRT;
						else if (id === BLOCK_TYPE_STONE) id = BLOCK_TYPE_COBBLE;
						if (
							id === BLOCK_TYPE_BEDROCK ||
							id !== BLOCK_TYPE_LEAVES &&
							id !== BLOCK_TYPE_GLASS &&
							player_collect(player, stack_create(id, 1)) !== null
						) break;
					}
					world_block_set(
						model.world,
						block_focus_x,
						block_focus_y,
						block_focus_z,
						BLOCK_TYPE_AIR
					);
				}
				else {
					game_block_select(
						model,
						[
							block_focus_x,
							block_focus_y,
							block_focus_z,
						],
						false
					);
				}
			}
			break;
		case KEY_MOUSE_MIDDLE:
		case 71: // G
			if (block_focus_y >= 0) {
				const id = world_block_get(
					model.world,
					block_focus_x,
					block_focus_y,
					block_focus_z
				);
				const slots = player.inventory.slice(0, PLAYER_SLOTS);
				const index_existing = slots.findIndex(stack =>
					stack !== null &&
					stack.id === id
				);
				if (index_existing >= 0) {
					player.slot_index = index_existing;
				}
				else if (player.gamemode === GAMEMODE_CREATIVE) {
					if (slots[player.slot_index] !== null) {
						const index_empty = slots.indexOf(null);
						if (index_empty >= 0) {
							player.slot_index = index_empty;
						}
					}
					player.inventory[player.slot_index] = stack_create(id);
				}
				player.slot_time = model.frame_last;
			}
			break;
		case KEY_MOUSE_RIGHT:
			if (
				player.gamemode !== GAMEMODE_SPECTATOR &&
				block_focus_y >= 0
			) {
				if (player.mouse_mode === MOUSE_MODE_NORMAL) {
					const stack = player.inventory[player.slot_index];
					if (stack === null) break;
					let x = block_focus_x;
					let y = block_focus_y;
					let z = block_focus_z;
					switch (player.block_focus_face) {
						case BLOCK_TYPE_FACE_W: --x; break;
						case BLOCK_TYPE_FACE_E: ++x; break;
						case BLOCK_TYPE_FACE_B: --y; break;
						case BLOCK_TYPE_FACE_T: ++y; break;
						case BLOCK_TYPE_FACE_S: --z; break;
						default: ++z;
					}
					if (
						y >= 0 &&
						y < CHUNK_HEIGHT
					) {
						world_block_set(
							model.world,
							x & ((1 << (CHUNK_WIDTH_L2 + model.world.size_l2)) - 1),
							y,
							z & ((1 << (CHUNK_WIDTH_L2 + model.world.size_l2)) - 1),
							stack.id
						);
						if (
							player.gamemode !== GAMEMODE_CREATIVE &&
							--stack.amount <= 0
						) {
							player.inventory[player.slot_index] = null;
						}
					}
				}
				else {
					game_block_select(
						model,
						[
							block_focus_x,
							block_focus_y,
							block_focus_z,
						],
						true
					);
				}
			}
			break;
		case KEY_MOUSE_UP:
			player.slot_index = (player.slot_index + PLAYER_SLOTS - 1) % PLAYER_SLOTS;
			player.slot_time = model.frame_last;
			break;
		case KEY_MOUSE_DOWN:
			player.slot_index = (player.slot_index + 1) % PLAYER_SLOTS;
			player.slot_time = model.frame_last;
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
		case 49: // 1
		case 50: // 2
		case 51: // 3
		case 52: // 4
		case 53: // 5
		case 54: // 6
		case 55: // 7
		case 56: // 8
		case 57: // 9 = PLAYER_SLOTS
			player.slot_index = code - 49;
			player.slot_time = model.frame_last;
			break;
		case KEY_MOVE_LEFT:
		case KEY_MOVE_RIGHT:
		case 65: // A
		case 68: // D
			game_movement_x_update(model);
			break;
		case 69: // E
			if (
				player.gamemode !== GAMEMODE_SPECTATOR &&
				!model.menu
			) {
				model.menu = MENU_INVENTORY;
				for (const code of keys_active)
					game_key(model, code, false);
			}
			break;
		case 80: // P
			model.flag_paused = !model.flag_paused;
			break;
		case 81: // Q
			if (
				keys_active.has(17) ||
				player.inventory[player.slot_index] !== null &&
				--player.inventory[player.slot_index].amount <= 0
			) {
				player.inventory[player.slot_index] = null;
			}
			break;
		case KEY_MOVE_BACK:
		case KEY_MOVE_FRONT:
		case 83: // S
		case 87: // W
			game_movement_z_update(model);
			break;
		case 84: // T
			if (!model.menu) {
				model.menu = MENU_TERMINAL;
				for (const code of keys_active)
					game_key(model, code, false);
			}
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
			break;
		case KEY_ROTATE_LEFT:
		case KEY_ROTATE_RIGHT:
			game_rotation_h_update(model);
			break;
		case KEY_ROTATE_DOWN:
		case KEY_ROTATE_UP:
			game_rotation_v_update(model);
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

	world_offset_update(model.world, model.player, false);
}
const coord_part_parse = (base, value) => (
	value = (
		value.startsWith('~')
		?	base + Number_(value.substr(1))
		:	Number_(value)
	),
	isNaN(value)
	?	base
	:	value
);

export const game_message_send = (model, value) => {
	const {
		player,
	} = model;
	if (!value) {}
	else if (value.charAt(0) === '/') {
		const args = value.substr(1).split(' ');
		const command = args.shift();
		switch(command) {
		case 'clear':
			model.messages = [];
			break;
		case 'clearinv':
			player.inventory.fill(null);
			game_message_print(model, 'inventory cleared', true);
			break;
		case 'exit':
			model.flag_paused = false;
			model.menu = MENU_NONE;
			break;
		case 'gamemode':
		case 'gm': {
				const value = Number_(args[0]);
				if (
					!isNaN(value) &&
					value >= 0 &&
					value < GAMEMODE_SPECTATOR + 1 &&
					value % 1 === 0
				) {
					player.gamemode = value;
					game_message_print(model, `gamemode set to ${value}`, true);
				}
				else {
					game_message_print(model, 'gamemode must be in 0..2');
				}
			}
			break;
		case 'give': {
				const handles_index = ITEM_HANDLES.indexOf(
					(args[0] || '').toLowerCase()
				);
				const value = handles_index >= 0 ? handles_index : Number_(args[0]);
				const amount = Number_(args[1] || 1);
				if (
					!isNaN(value) &&
					value > 0 &&
					value < BLOCK_TYPE_MAX + 1 &&
					value % 1 === 0
				) {
					if (
						!isNaN(amount) &&
						amount > 0 &&
						amount < STACK_SIZE + 1 &&
						amount % 1 === 0
					) {
						game_message_print(
							model,
							player_collect(player, stack_create(value, amount))
							?	'inventory full'
							:	`gave ${amount} ${ITEM_HANDLES[value]}`,
							true
						);
					}
					else {
						game_message_print(model, 'amount must be in 1..64');
					}
				}
				else {
					game_message_print(model, 'invalid block type');
				}
			}
			break;
		case 'help':
			game_message_print(model, 'commands: clear, clearinv, exit, gamemode, give, help, me, save, spawn, teleport, version');
			break;
		case 'me':
			game_message_print(model, player.name + ' ' + args.join(' '), true);
			break;
		case 'save':
			game_save(model);
			model.actions.config_save();
			game_message_print(model, 'world+config saved', true);
			break;
		case 'smart':
			player.name = 'LFF5644';
			game_message_print(model, 'lff.smart: true', true);
			break;
		case 'spawn':
			model.world.spawn_x = player.position_x;
			model.world.spawn_y = player.position_y;
			model.world.spawn_z = player.position_z;
			game_message_print(model, 'spawn updated', true);
			break;
		case 'teleport':
		case 'tp':
			if (args.length === 0) {
				player.position_x = model.world.spawn_x;
				player.position_y = model.world.spawn_y;
				player.position_z = model.world.spawn_z;
				model.renderer.flag_dirty = true;
				game_message_print(model, 'teleported to spawn', true);
			}
			else if (args.length === 3) {
				game_message_print(model, `teleported to ${
					player.position_x = coord_part_parse(player.position_x, args[0])
				} ${
					player.position_y = coord_part_parse(player.position_y, args[1])
				} ${
					player.position_z = coord_part_parse(player.position_z, args[2])
				}`, true);
				model.renderer.flag_dirty = true;
			}
			else {
				game_message_print(model, 'PITCH');
			}
			player.speed_x = 0;
			player.speed_y = 0;
			player.speed_z = 0;
			break;
		case 'version':
			game_message_print(model, 'Minicraft ' + VERSION);
			break;
		case '/exit':
			player.mouse_mode = MOUSE_MODE_NORMAL;
			game_message_print(model, 'normal mouse mode', true);
			break;
		case '/expand':
			if (game_block_assert(model)) {
				if (args[0] === 'vert') {
					player.block_select_a[1] = 0;
					player.block_select_b[1] = CHUNK_HEIGHT - 1;
					game_message_print(model, 'selection expanded', true);
				}
				else {
					game_message_print(model, 'only vert supported');
				}
			}
			break;
		case '/pos1':
		case '/pos2':
			game_block_select(
				model,
				[
					Math_floor(player.position_x),
					Math_floor(player.position_y),
					Math_floor(player.position_z),
				],
				command === '/pos2'
			);
			break;
		case '/regen':
			world_chunk_reset(model.world);
			game_message_print(model, 'regenerate chunk', true);
			model.renderer.flag_dirty = true;
			break;
		case '/show':
			game_message_print(
				model,
				`first: ${
					player.block_select_a
					?	player.block_select_a.join(' ')
					:	'none'
				}, second: ${
					player.block_select_b
					?	player.block_select_b.join(' ')
					:	'none'
				}`
			);
			break;
		case '/wand':
			player.mouse_mode = MOUSE_MODE_SELECT;
			game_message_print(model, 'primary+secondary button for selection', true);
			break;
		default:
			game_message_print(model, 'unknown command: ' + command);
		}
	}
	else {
		game_message_print(model, `<${player.name}> ` + value);
	}
}

const game_message_print = (model, value, minor = false) => {
	(
		model.messages = model.messages.slice(-49)
	).push({
		id: ++message_id_counter,
		minor,
		time: now(),
		value,
	});
}

export const game_block_assert = model => {
	if (
		!model.player.block_select_a ||
		!model.player.block_select_b
	) {
		game_message_print(model, 'selection required');
		return false;
	}
	return true;
}
export const game_block_select = (model, block, secondary) => {
	if (secondary)
		model.player.block_select_b = block;
	else
		model.player.block_select_a = block;
	game_message_print(
		model,
		`${
			secondary
			?	'second'
			:	'first'
		} position: ${
			block.join(' ')
		}`,
		true
	);
}
