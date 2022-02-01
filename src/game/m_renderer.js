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
R: ${game.resolution_x}x${game.resolution_y} (x${game.resolution_scaling}), C: 1, D: ${game.view_distance}
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

	const {resolution_x, resolution_y, view_distance} = game;
	const resolution_x_h = resolution_x * .5;
	const resolution_y_h = resolution_y * .5;
	const resolution_x_1d = 1 / resolution_x;
	const resolution_y_1d = 1 / resolution_y;
	const {angle_h, angle_v, position_x, position_y, position_z} = player;
	const angle_h_cos = Math.cos(angle_h);
	const angle_h_sin = Math.sin(angle_h);
	const angle_v_cos = Math.cos(-angle_v);
	const angle_v_sin = Math.sin(-angle_v);
	const fov = game.view_angle / 45;// TODO
	const fov_x = resolution_x < resolution_y ? fov * resolution_x * resolution_y_1d : fov;
	const fov_y = resolution_y < resolution_x ? fov * resolution_y * resolution_x_1d : fov;

	let pixels_index = 0;

	for (let canvas_y = 0; canvas_y < resolution_y; ++canvas_y)
	for (let canvas_x = 0; canvas_x < resolution_x; ++canvas_x) {
		const canvas_x_relative = (canvas_x - resolution_x_h) * resolution_x_1d * fov_x;
		const canvas_y_relative = (resolution_y_h - canvas_y) * resolution_y_1d * fov_y;

		const step_y_raw = canvas_y_relative * angle_v_cos -                     angle_v_sin;
		const step_z_rot =                     angle_v_cos + canvas_y_relative * angle_v_sin;
		const step_x_raw = canvas_x_relative * angle_h_cos + step_z_rot        * angle_h_sin;
		const step_z_raw = step_z_rot        * angle_h_cos - canvas_x_relative * angle_h_sin;

		let pixel_color = SKY_COLOR;
		let pixel_factor = 1.0;

		let check_distance_min = view_distance;
		// step for each x, y, z
		for (let dim = 0; dim < 3; ++dim) {
			const step_dim = (
				dim === 0
				?	step_x_raw
				: dim === 1
				?	step_y_raw
				:	step_z_raw
			);

			const step_normal = 1 / (step_dim < 0 ? -step_dim : step_dim);
			const step_x = step_x_raw * step_normal;
			const step_y = step_y_raw * step_normal;
			const step_z = step_z_raw * step_normal;

			// calculate distance to first intersection to then start on it
			let offset = (
				dim === 0
				?	position_x % 1
				: dim === 1
				?	position_y % 1
				:	position_z % 1
			);
			offset = offset < 0 ? -offset : offset;
			offset = step_dim > 0 ? 1 - offset : offset;

			let check_x = position_x + step_x * offset;
			let check_y = position_y + step_y * offset;
			let check_z = position_z + step_z * offset;
			let check_distance = step_normal * offset;

			// move into middle of block to prevent rounding errors causing flicker
			if (dim === 0) check_x += step_dim < 0 ? -.5 : .5;
			else if (dim === 1) check_y += step_dim < 0 ? -.5 : .5;
			else check_z += step_dim < 0 ? -.5 : .5;

			// add steps until collision or out of range
			while (check_distance < check_distance_min) {
				const block = world_block_get(world, check_x, check_y, check_z);
				if (block === BLOCK_AIR) {
					// no collision
					check_x += step_x;
					check_y += step_y;
					check_z += step_z;
					check_distance += step_normal;
					continue;	
				}
				// collision
				pixel_color = BLOCK_COLORS[block];
				pixel_factor = 1 - ((dim + 2) % 3) * .2;
				check_distance_min = check_distance;
				break;
			}
		}

		pixels[pixels_index] = ((pixel_color >> 16) & 0xff) * pixel_factor;
		pixels[++pixels_index] = ((pixel_color >> 8) & 0xff) * pixel_factor;
		pixels[++pixels_index] = (pixel_color & 0xff) * pixel_factor;
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
