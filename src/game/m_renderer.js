import {
	BLOCK_TYPE_AIR,
	BLOCK_COLORS,
	CHUNK_WIDTH_L2,
	COORDINATE_OFFSET,
	COORDINATE_OFFSET_M1,
	SKY_COLOR,
	PLAYER_FOCUS_DISTANCE,
	BLOCK_TYPE_FACE_LABELS,
	CHUNK_HEIGHT,
} from '../etc/constants.js';
import {
	VERSION,
} from '../etc/env.js';
import {
	document_,
	Math_cos,
	Math_PI_180d,
	Math_pow,
	Math_sin,
	number_padStart2,
	number_toFixed2,
} from '../etc/helpers.js';
import {
	world_block_get,
} from './m_world.js';
import {
	TILES_DATA,
	TILES_RESOLUTION,
	TILES_RESOLUTION_LOG2,
	TILE_DIRT,
	TILE_GRASS_SIDE,
	TILE_GRASS_TOP,
	TILE_LOG_SIDE,
	TILE_LOG_TOP,
} from '../etc/textures.js';

// parse png
let tiles_data = null;
let tiles_image = new Image();
tiles_image.onload = () => {
	const canvas_temp = document_.createElement('canvas');
	const width = canvas_temp.width = tiles_image.width;
	const height = canvas_temp.height = tiles_image.height;
	const context = canvas_temp.getContext('2d');
	context.drawImage(tiles_image, 0, 0);
	tiles_image = tiles_data = new Uint32Array(
		context.getImageData(0, 0, width, height).data.buffer
	);
};
tiles_image.src = 'data:image/png;base64,' + TILES_DATA;

export const renderer_create = (game, canvas_element) => {
	const model = {
		canvas_element,
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
		config,
		player,
		resolution_x,
		resolution_y,
		world,
	} = game;

	if (
		!game.flag_paused ||
		model.flag_dirty
	) {
		model.flag_dirty = false;

		const canvas_surface_data = canvas_surface.data;

		const {
			view_distance,
		} = config;
		const {
			angle_h,
			angle_v,
			block_focus_x,
			block_focus_y,
			block_focus_z,
			position_x,
			position_y,
			position_z,
		} = player;
		const {
			blocks,
			width_l2,
		} = world;
		const flag_textures = config.flag_textures && tiles_data !== null;
		tiles_data = /** @type {Uint32Array!} */ (tiles_data);
		const resolution_x_1d = 1 / resolution_x;
		const resolution_y_1d = 1 / resolution_y;
		const resolution_x_h = resolution_x >> 1;
		const resolution_y_h = resolution_y >> 1;
		const pixel_focus_x = resolution_x_h;
		const pixel_focus_y = resolution_y_h;
		const angle_h_cos = Math_cos(angle_h);
		const angle_h_sin = Math_sin(angle_h);
		const angle_v_cos = Math_cos(-angle_v);
		const angle_v_sin = Math_sin(-angle_v);
		const fov = config.view_angle / 45;// TODO
		const fov_x = resolution_x < resolution_y ? fov * resolution_x * resolution_y_1d : fov;
		const fov_y = resolution_y < resolution_x ? fov * resolution_y * resolution_x_1d : fov;
		const position_x_shifted = position_x + COORDINATE_OFFSET;
		const position_y_shifted = position_y + COORDINATE_OFFSET;
		const position_z_shifted = position_z + COORDINATE_OFFSET;
		const position_x_shifted_rest = position_x_shifted % 1;
		const position_y_shifted_rest = position_y_shifted % 1;
		const position_z_shifted_rest = position_z_shifted % 1;
		const world_width_m1 = (1 << width_l2) - 1;

		let focus_distance_min = PLAYER_FOCUS_DISTANCE;
		let canvas_surface_data_index =
			player.block_focus_x =
			player.block_focus_z =
			player.block_focus_face = 0;
		player.block_focus_y = -1;

		for (let canvas_y = 0; canvas_y < resolution_y; ++canvas_y) {
			const canvas_y_relative = (resolution_y_h - canvas_y) * resolution_y_1d * fov_y;

			const step_y_raw = canvas_y_relative * angle_v_cos - angle_v_sin;
			const step_z_rot = canvas_y_relative * angle_v_sin + angle_v_cos;

			for (let canvas_x = 0; canvas_x < resolution_x; ++canvas_x) {
				const canvas_x_relative = (canvas_x - resolution_x_h) * resolution_x_1d * fov_x;

				const step_x_raw = step_z_rot * angle_h_sin + canvas_x_relative * angle_h_cos;
				const step_z_raw = step_z_rot * angle_h_cos - canvas_x_relative * angle_h_sin;

				let pixel_color = SKY_COLOR;
				let pixel_factor = 1.0;

				let check_distance_min = view_distance;
				// step for each x, y, z
				for (let dim = 0; dim < 3; ++dim) {
					// https://jsben.ch/AqXcR
					let step_dim = step_z_raw;
					if (dim === 0) step_dim = step_x_raw;
					if (dim === 1) step_dim = step_y_raw;

					// https://jsben.ch/hKgi4
					const step_normal = 1 / (step_dim < 0 ? -step_dim : step_dim);
					const step_x = step_x_raw * step_normal;
					const step_y = step_y_raw * step_normal;
					const step_z = step_z_raw * step_normal;

					// calculate distance to first intersection to then start on it
					let offset = position_z_shifted_rest;
					if (dim === 0) offset = position_x_shifted_rest;
					if (dim === 1) offset = position_y_shifted_rest;
					if (step_dim > 0) offset = 1 - offset;

					let check_x = position_x_shifted + step_x * offset;
					let check_y = position_y_shifted + step_y * offset;
					let check_z = position_z_shifted + step_z * offset;
					let check_distance = step_normal * offset;

					// move into middle of block to prevent rounding errors causing flicker
					// https://jsben.ch/iIvG7
					if (dim === 0) check_x += .5 - ((step_dim < 0) | 0);
					if (dim === 1) check_y += .5 - ((step_dim < 0) | 0);
					if (dim === 2) check_z += .5 - ((step_dim < 0) | 0);

					// add steps until collision or out of range
					// https://jsben.ch/kM67J
					let check_x_int, check_y_int, check_z_int, block;
					while (check_distance < check_distance_min)
					if (
						(check_y_int = check_y & COORDINATE_OFFSET_M1) < 0 ||
						check_y_int >= CHUNK_HEIGHT ||
						(
							block = blocks[
								(
									(
										(check_y_int << width_l2) |
										(check_x_int = check_x & world_width_m1)
									) << width_l2
								) |
								(check_z_int = check_z & world_width_m1)
							]
						) === BLOCK_TYPE_AIR
					) {
						// no collision
						check_x += step_x;
						check_y += step_y;
						check_z += step_z;
						check_distance += step_normal;
					}
					else {
						// collision

						if (
							canvas_y === pixel_focus_y &&
							canvas_x === pixel_focus_x &&
							check_distance <= focus_distance_min
						) {
							// set focus
							player.block_focus_x = check_x_int;
							player.block_focus_y = check_y_int;
							player.block_focus_z = check_z_int;
							player.block_focus_face = (step_dim < 0) | (dim << 1);
							focus_distance_min = check_distance;
						}

						// calculate color
						if (flag_textures) {
							// shift so that block id 1 => tile 0
							--block;

							if (dim === 1) {
								if (block === TILE_LOG_SIDE)
									block = TILE_LOG_TOP;
								else if (
									block === TILE_GRASS_TOP &&
									step_dim > 0
								) block = TILE_DIRT;
							}
							else if (block === TILE_GRASS_TOP)
								block = TILE_GRASS_SIDE;

							// pick pixel
							const texture_pixel = tiles_data[
								(block << (TILES_RESOLUTION_LOG2 + TILES_RESOLUTION_LOG2)) +
								(
									(
										// y
										(
											dim === 1
											?	check_z
											:	check_y
										) * TILES_RESOLUTION & (TILES_RESOLUTION - 1)
									) << TILES_RESOLUTION_LOG2
								) +
								(
									// x
									(
										dim === 1
										?	check_x
										:	check_x + check_z
									) * TILES_RESOLUTION & (TILES_RESOLUTION - 1)
								)
							];

							// solid pixel
							if (texture_pixel >>> 24 !== 0)
								pixel_color = texture_pixel & 0xffffff;
							// transparent pixel
							else {
								check_x += step_x;
								check_y += step_y;
								check_z += step_z;
								check_distance += step_normal;
								continue;
							}
						}
						else pixel_color = BLOCK_COLORS[block];

						check_distance_min = check_distance;
						pixel_factor = (
							// fake shadow to see edges
							1 - ((dim + 2) % 3) * .2 +
							// highlight if focussed
							(
								check_y_int !== block_focus_y ||
								check_x_int !== block_focus_x ||
								check_z_int !== block_focus_z
								?	0
								:	.1
							)
						);
						break;
					}
				}

				canvas_surface_data[canvas_surface_data_index] =
					(pixel_color & 0xff) * pixel_factor;
				canvas_surface_data[++canvas_surface_data_index] =
					((pixel_color >> 8) & 0xff) * pixel_factor;
				canvas_surface_data[++canvas_surface_data_index] =
					(pixel_color >> 16) * pixel_factor;
				canvas_surface_data_index += 2;
			}
		}

		// cursor
		canvas_surface_data[
			canvas_surface_data_index =
				(resolution_x * pixel_focus_y + pixel_focus_x) << 2
		] *= 2;
		canvas_surface_data[++canvas_surface_data_index] *= 2;
		canvas_surface_data[++canvas_surface_data_index] *= 2;

		model.canvas_context.putImageData(canvas_surface, 0, 0);
	}

	model.diagnostics = (
		game.flag_diagnostics
		?	'Minicraft ' + VERSION + ' ' + (
				number_padStart2(model.fps, '\xa0')
			) + ' fps, T: ' + (
				number_padStart2(game.time_f * 24, '0')
			) + ':' + (
				number_padStart2((((game.time_f * 24) % 1) * 60), '0')
			) + '; ' + (
				game.flag_paused &&
				now % 1e3 < 500
				?	''
				:	game.time
			) + '\n' +

			'R: ' + resolution_x + 'x' + resolution_y +
			' (x' + config.resolution_scaling + '), D: ' + config.view_distance + ', ' +
			'C: ' + Math_pow(1 << (world.width_l2 - CHUNK_WIDTH_L2), 2) + ', ' +
			'M: ' + (Math_pow(1 << world.width_l2, 2) * CHUNK_HEIGHT >> 10) + 'k\n' +
			'E: 0/0\n\n' +

			'Position: ' + (
				number_toFixed2(player.position_x)
			) + ' ' + (
				number_toFixed2(player.position_y)
			) + ' ' + (
				number_toFixed2(player.position_z)
			) + '\n' +

			'Angle: ' + (
				number_toFixed2(player.angle_h * Math_PI_180d)
			) + ' ' + (
				number_toFixed2(player.angle_v * Math_PI_180d)
			) + '\n' +
			'Block: ' + (
				player.block_focus_y < 0
				?	0
				:	player.block_focus_x + ' ' +
					player.block_focus_y + ' ' +
					player.block_focus_z + ' ' +
					BLOCK_TYPE_FACE_LABELS[player.block_focus_face] + ': ' +
					world_block_get(
						world,
						player.block_focus_x,
						player.block_focus_y,
						player.block_focus_z
					)
			) + '\n' +
			'Chunk: 0 0'
		:	''
	);
};

export const renderer_canvas_init = model => {
	const width = model.canvas_element.width = model.game.resolution_x;
	const height = model.canvas_element.height = model.game.resolution_y;
	const data = (
		model.canvas_surface = (
			model.canvas_context = model.canvas_element.getContext('2d')
		).createImageData(width, height)
	).data;

	// set alpha to 255
	const data_length = data.length;
	for (let i = 3; i < data_length; i += 4)
		data[i] = 0xff;
};
