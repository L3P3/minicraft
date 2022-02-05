import {
	BLOCK_TYPE_AIR,
	BLOCK_TYPE_BRICKS,
	BLOCK_TYPE_FACE_B,
	BLOCK_TYPE_FACE_E,
	BLOCK_TYPE_FACE_S,
	BLOCK_TYPE_FACE_T,
	BLOCK_TYPE_FACE_W,
	CHUNK_HEIGHT,
	CHUNK_WIDTH_M1,
} from '../etc/constants.js';
import {
	DEBUG,
} from '../etc/env.js';
import {
	Math_max,
	Math_PI,
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
	world_block_set,
	world_create,
} from './m_world.js';

export const game_create = () => ({
	flag_diagnostics: DEBUG,
	flag_menu: false,
	flag_paused: false,
	frame_last: 0,
	player: player_create(),
	renderer: null,
	resolution_scaling: 10,
	resolution_raw_x: 1,
	resolution_raw_y: 1,
	resolution_x: 0,
	resolution_y: 0,
	tick_interval: null,
	time: 0,
	time_f: 0.0,
	view_angle: 80,
	view_distance: 64,
	world: world_create(),
});

export const game_start = (model, canvas) => {
	onmousemove = event => {
		if (!model.flag_paused) {
			model.player.angle_h = (event.clientX / model.resolution_raw_x - .5) * 2 * Math_PI;
			model.player.angle_v = (.5 - event.clientY / model.resolution_raw_y) * Math_PI;
		}
	};
	onmousedown = onmouseup = event => (
		model.flag_paused || (
			game_key(model, -1 - event.button, event.type === 'mousedown'),
			event.preventDefault(),
			false
		)
	);
	model.renderer = renderer_create(model, canvas);
	model.tick_interval = setInterval(() => {
		game_tick(model);
	}, 50);
};

export const game_resolution_raw_set = (model, width, height) => (
	model.resolution_raw_x = Math_max(1, width),
	model.resolution_raw_y = Math_max(1, height),
	game_resolution_update(model)
);

export const game_scaling_set = (model, scaling) => (
	model.resolution_scaling = scaling,
	game_resolution_update(model)
);

const game_resolution_update = model => {
	const x = Math_max(1, Math_round(model.resolution_raw_x / model.resolution_scaling));
	const y = Math_max(1, Math_round(model.resolution_raw_y / model.resolution_scaling));

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

export const game_umount = model => (
	onmousemove = onmousedown = onmouseup = null,
	clearInterval(model.tick_interval),
	renderer_destroy(model.renderer)
);

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
		case -3: // MOUSE_RIGHT
			if (model.player.block_focus_y) {
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
						x & CHUNK_WIDTH_M1,
						y,
						z & CHUNK_WIDTH_M1,
						BLOCK_TYPE_BRICKS
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
};
