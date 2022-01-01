import {
	BLOCK_AIR,
	BLOCK_COLORS,
	SKY_COLOR,
	VERSION,
} from '../etc/constants.js';
import {
	world_block_get,
} from './m_world.js';

export const renderer_create = (game, canvas) => {
	const model = {
		canvas,
		canvas_context: null,
		canvas_surface: null,
		diagnostics: '',
		flag_dirty: false,
		fps: 0,
		fps_counter: 0,
		fps_interval: setInterval(() => {
			model.fps = model.fps_counter;
			model.fps_counter = 0;
		}, 1e3),
		game,
	};
	renderer_canvas_init(model);
	return model;
};

export const renderer_destroy = model => {
	clearInterval(model.fps_interval);
};

export const renderer_render = (model, now) => {
	++model.fps_counter;

	const {
		canvas_surface,
		game,
	} = model;
	const {
		player,
		world,
	} = game;

	model.diagnostics = (
		game.flag_diagnostics
		?	`Minicraft ${VERSION}
${
	model.fps
	.toString().padStart(2, '\xa0')
} fps, T: ${
	Math.floor(game.time_f * 24)
	.toString().padStart(2, '0')
}:${
	Math.floor(((game.time_f * 24) % 1) * 60)
	.toString().padStart(2, '0')
}; ${
	game.flag_paused &&
	now % 1e3 < 500
	?	''
	:	game.time
}
R: ${game.resolution_x}x${game.resolution_y} (x${game.resolution_scaling}), C: 0, D: INF
E: 0/0

Position: ${player.position_x.toFixed(2)} ${player.position_y.toFixed(2)} ${player.position_z.toFixed(2)}
Angle: ${(player.angle_h * 180 / Math.PI).toFixed(2)} ${(player.angle_v * 180 / Math.PI).toFixed(2)}
Block: 0 0 0
Chunk: 0 0 0 in 0 0
Facing: 0`
		:	''
	);

	if (
		game.flag_paused &&
		!model.flag_dirty
	) return;

	model.flag_dirty = false;

	const pixels = canvas_surface.data;
	const fov = (80 / 360) * Math.PI;
	const fov_x = game.resolution_x < game.resolution_y ? fov * game.resolution_x / game.resolution_y : fov;
	const fov_y = game.resolution_y < game.resolution_x ? fov * game.resolution_y / game.resolution_x : fov;

	let pixels_index = 0;

	for (let canvas_y = 0; canvas_y < game.resolution_y; ++canvas_y)
	for (let canvas_x = 0; canvas_x < game.resolution_x; ++canvas_x) {
		const canvas_x_relative = (canvas_x - game.resolution_x / 2) / game.resolution_x;
		const canvas_y_relative = (game.resolution_y / 2 - canvas_y) / game.resolution_y;
		const angle_h = player.angle_h + canvas_x_relative * fov_x;
		const angle_v = player.angle_v + canvas_y_relative * fov_y;

		const step_x = Math.sin(angle_h) * Math.cos(angle_v);
		const step_y = Math.sin(angle_v);
		const step_z = Math.cos(angle_h) * Math.cos(angle_v);

		let check_x = player.position_x;
		let check_y = player.position_y;
		let check_z = player.position_z;
		let distance = 0;

		let [pixel_r, pixel_g, pixel_b] = SKY_COLOR;

		do {
			const block = world_block_get(world, check_x, check_y, check_z);
			if (block !== BLOCK_AIR) {
				[pixel_r, pixel_g, pixel_b] = BLOCK_COLORS[block];
				break;
			}
			check_x += step_x;
			check_y += step_y;
			check_z += step_z;
		}
		while(++distance < 100);

		pixels[pixels_index] = pixel_r;
		pixels[++pixels_index] = pixel_g;
		pixels[++pixels_index] = pixel_b;
		pixels_index += 2;
	}

	model.canvas_context.putImageData(canvas_surface, 0, 0);
};

export const renderer_canvas_init = model => {
	const width = model.canvas.width = model.game.resolution_x;
	const height = model.canvas.height = model.game.resolution_y;
	const data = (
		model.canvas_surface = (
			model.canvas_context = model.canvas.getContext('2d')
		).createImageData(width, height)
	).data;
	const data_length = data.length;
	for (let i = 3; i < data_length; i += 4)
		data[i] = 0xff;
};
