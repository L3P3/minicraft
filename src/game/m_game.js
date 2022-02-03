import {
	DEBUG,
} from '../etc/env.js';
import {
	Math_cos,
	Math_max,
	Math_round,
	Math_sin,
} from '../etc/helpers.js';
import {
	player_create,
} from './m_player.js';
import {
	renderer_canvas_init,
	renderer_create,
	renderer_destroy,
} from './m_renderer.js';
import {
	world_create,
} from './m_world.js';

export const game_create = () => ({
	flag_autoscaling: false,
	flag_diagnostics: DEBUG,
	flag_menu: false,
	flag_paused: false,
	player: player_create(),
	renderer: null,
	resolution_scaling: 10,
	resolution_raw_x: 0,
	resolution_raw_y: 0,
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
	model.renderer = renderer_create(model, canvas);
	model.tick_interval = setInterval(() => {
		game_tick(model);
	}, 50);
};

export const game_resolution_raw_set = (model, width, height) => (
	model.resolution_raw_x = width,
	model.resolution_raw_y = height,
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

export const game_umount = model => {
	clearInterval(model.tick_interval);
	renderer_destroy(model.renderer);
};

export const game_key = (model, code, state) => {
	if (state) switch (code) {
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

const game_tick = model => {
	if (model.flag_paused) return;
	model.time = (model.time + 1) % 24e3;
	model.time_f = ((model.time + 6e3) * (1 / 24e3)) % 1;

	const {player} = model;

	player.speed_x *= .8;
	player.speed_y *= .8;
	player.speed_z *= .8;

	player.speed_x += Math_cos(player.angle_h) * player.accel_x + Math_sin(player.angle_h) * player.accel_z;
	player.speed_y += player.accel_y;
	player.speed_z += -Math_sin(player.angle_h) * player.accel_x + Math_cos(player.angle_h) * player.accel_z;

	player.position_x += player.speed_x;
	player.position_y += player.speed_y;
	player.position_z += player.speed_z;

	if (
		model.flag_autoscaling &&
		model.renderer &&
		model.time % 10 === 0
	) {
		if (
			model.resolution_scaling < 100 &&
			model.renderer.fps < 20
		)
			game_scaling_set(model, model.resolution_scaling + 1);
		else if (
			model.resolution_scaling > 1 &&
			model.renderer.fps > 40
		)
			game_scaling_set(model, model.resolution_scaling - 1);
	}
};
