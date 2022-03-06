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
} from '../etc/constants.js';
import {
	DEBUG,
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
	world_create,
} from './m_world.js';

export const game_create = () => {
	const world = world_create(4);
	return {
		config: null,
		flag_diagnostics: DEBUG,
		flag_menu: false,
		flag_paused: true,
		frame_element: null,
		frame_last: 0,
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
};

export const game_start = (model, canvas_element) => {
	model.renderer = renderer_create(model, canvas_element);
	model.tick_interval = setInterval(() => {
		game_tick(model);
	}, 50);
};

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
};

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

export const game_key = (model, code, state) => {
	//console.log('KEY', code, state);
	if (state) switch (code) {
		case -1: // MOUSE_LEFT
			model.player.block_focus_y >= 0 &&
				world_block_set(
					model.world,
					model.player.block_focus_x,
					model.player.block_focus_y,
					model.player.block_focus_z,
					BLOCK_TYPE_AIR
				);
			break;
		case -2: // MOUSE_MIDDLE
		case 71: // G
			if (model.player.block_focus_y >= 0)
					model.player.holds = world_block_get(
						model.world,
						model.player.block_focus_x,
						model.player.block_focus_y,
						model.player.block_focus_z
					);
			break;
		case -3: // MOUSE_RIGHT
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
			model.flag_paused =
			model.flag_menu = !model.flag_menu;
			break;
		case 16: // SHIFT
			model.player.accel_y = -.1;
			break;
		case 32: // SPACE
			model.player.accel_y = .1;
			break;
		case 65: // A
			model.player.accel_x = -.1;
			break;
		case 68: // D
			model.player.accel_x = .1;
			break;
		case 80: // P
			model.flag_paused = !model.flag_paused;
			break;
		case 83: // S
			model.player.accel_z = -.1;
			break;
		case 87: // W
			model.player.accel_z = .1;
			break;
		case 114: // F3
			model.flag_diagnostics = !model.flag_diagnostics;
			break;
		default:
			return true;
	}
	else switch (code) {
		case 16: // SHIFT
		case 32: // SPACE
			model.player.accel_y = 0;
			break;
		case 65: // A
		case 68: // D
			model.player.accel_x = 0;
			break;
		case 83: // S
		case 87: // W
			model.player.accel_z = 0;
			break;
		default:
			return true;
	}
	return false;
};

export const game_render = (model, now) => {
	model.frame_last &&
	!model.flag_paused &&
		player_tick(model.player, now - model.frame_last);
	model.renderer &&
		renderer_render(model.renderer, now);
	model.frame_last = now;
};

const game_tick = model => {
	if (model.flag_paused) return;
	model.time = (model.time + 1) % 24e3;
	model.time_f = ((model.time + 6e3) * (1 / 24e3)) % 1;

	const {player, world} = model;
	const world_size = 1 << world.size_l2;
	world.focus_x = (
		COORDINATE_OFFSET + (
			world.offset_x = Math_floor(player.position_x) >> CHUNK_WIDTH_L2
		)
	) % world_size;
	world.focus_z = (
		COORDINATE_OFFSET + (
			world.offset_z = Math_floor(player.position_z) >> CHUNK_WIDTH_L2
		)
	) % world_size;
	world_chunk_load(world);
};
