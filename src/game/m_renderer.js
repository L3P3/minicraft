import {
	BLOCK_TYPE_AIR,
	BLOCK_COLORS,
	CHUNK_WIDTH_L2,
	COORDINATE_OFFSET,
	SKY_COLOR,
	PLAYER_FOCUS_DISTANCE,
	BLOCK_TYPE_FACE_LABELS,
	CHUNK_HEIGHT,
	CHUNK_HEIGHT_L2,
} from '../etc/constants.js';
import {
	VERSION,
} from '../etc/env.js';
import {
	clearInterval_,
	document_,
	Math_ceil,
	Math_cos,
	Math_floor,
	Math_min,
	Math_PI_180d,
	Math_sin,
	Math_sqrt,
	number_padStart2,
	number_square,
	number_toFixed2,
	setInterval_,
	Uint32Array_,
	window_,
} from '../etc/helpers.js';
import {
	world_block_get,
} from './m_world.js';
import {
	TILES_COUNT,
	TILES_RESOLUTION,
	TILES_RESOLUTION_LOG2,
	TILE_BOOKSHELF,
	TILE_DIRT,
	TILE_GRASS_SIDE,
	TILE_GRASS_TOP,
	TILE_LOG_SIDE,
	TILE_LOG_TOP,
	TILE_PLANKS,
} from '../etc/textures.js';

// parse png
let tiles_data = null;
let tiles_image = new Image();
tiles_image.crossOrigin = 'anonymous';
tiles_image.onload = () => {
	const canvas_temp = document_.createElement('canvas');
	canvas_temp.width = 1 << (TILES_RESOLUTION_LOG2 * 2);
	canvas_temp.height = TILES_COUNT;
	const context = canvas_temp.getContext('2d');
	context.drawImage(tiles_image, 0, 0);
	tiles_image = null;
	tiles_data = new Uint32Array_(
		context.getImageData(
			0, 0,
			1 << (TILES_RESOLUTION_LOG2 * 2),
			TILES_COUNT
		).data.buffer
	);
}
tiles_image.src = ASSETS + 'blocks.png';

export const renderer_create = (game, canvas_element) => {
	const model = {
		asm_instance: null,
		canvas_context: canvas_element.getContext('2d', {
			alpha: false,
			desynchronized: true,
		}),
		canvas_element,
		canvas_surface: null,
		canvas_surface_data32: null,
		diagnostics: '',
		flag_dirty: false,
		fps: 0,
		fps_counter: 0,
		fps_interval: setInterval_(() => (
			model.fps = model.fps_counter,
			model.fps_counter = 0
		), 1e3),
		game,
	};
	renderer_canvas_init(model);
	return model;
}

export const renderer_destroy = model => (
	clearInterval_(model.fps_interval)
);

/**
	@noinline
	@preserve
*/
const asm_core = function(stdlib, foreign, heap) {
	'use asm';
	var world = new stdlib.Uint8Array(heap);

	var Math_abs = stdlib.Math.abs;
	var Math_floor = stdlib.Math.floor;
	var Math_sqrt = stdlib.Math.sqrt;

	var pixel_set = foreign.a;
	var focus_set = foreign.b;
	var resolution_x = foreign.c|0;
	var resolution_y = foreign.d|0;
	var resolution_x_h = foreign.e|0;
	var resolution_y_h = foreign.f|0;
	var world_width_l2 = foreign.j|0;
	var world_width_m1 = foreign.k|0;
	var texture_pixel_get = foreign.l;

	function render(
		view_distance,
		resolution_x_1d__fov_x,
		resolution_y_1d__fov_y,
		angle_h_cos,
		angle_h_sin,
		angle_v_cos,
		angle_v_sin,
		block_focus_x,
		block_focus_y,
		block_focus_z,
		position_x,
		position_y,
		position_z
	) {
		view_distance = +view_distance;
		resolution_x_1d__fov_x = +resolution_x_1d__fov_x;
		resolution_y_1d__fov_y = +resolution_y_1d__fov_y;
		angle_h_cos = +angle_h_cos;
		angle_h_sin = +angle_h_sin;
		angle_v_cos = +angle_v_cos;
		angle_v_sin = +angle_v_sin;
		block_focus_x = block_focus_x|0;
		block_focus_y = block_focus_y|0;
		block_focus_z = block_focus_z|0;
		position_x = +position_x;
		position_y = +position_y;
		position_z = +position_z;

		var block = 0;
		var canvas_surface_data_index = 0;
		var canvas_x = 0;
		var canvas_y = 0;
		var check_a = 0;
		var check_b = 0.0;
		var check_b_int = 0;
		var check_c = 0.0;
		var check_c_int = 0;
		var check_distance = 0.0;
		var check_distance_min = 0.0;
		var focus_distance_min = 0.0;
		var pixel_color = 0;
		var position_x_shifted = 0.0;
		var position_x_shifted_int = 0;
		var position_x_shifted_rest = 0.0;
		var position_y_int = 0;
		var position_y_rest = 0.0;
		var position_z_shifted = 0.0;
		var position_z_shifted_int = 0;
		var position_z_shifted_rest = 0.0;
		var step_a = 0;
		var step_b = 0.0;
		var step_c = 0.0;
		var step_diagonal = 0.0;
		var step_x = 0.0;
		var step_y = 0.0;
		var step_y_normal = 0.0;
		var step_z = 0.0;
		var step_x_base = 0.0;
		var step_z_base = 0.0;
		var tmp = 0.0;

		focus_distance_min = 5.0; // PLAYER_FOCUS_DISTANCE
		position_x_shifted = position_x + 65536.0; // +COORDINATE_OFFSET
		position_z_shifted = position_z + 65536.0;
		position_x_shifted_int = ~~Math_floor(position_x_shifted);
		position_y_int = ~~Math_floor(position_y);
		position_z_shifted_int = ~~Math_floor(position_z_shifted);
		position_x_shifted_rest = position_x_shifted % 1.0;
		position_y_rest = position_y - +(position_y_int|0);
		position_z_shifted_rest = position_z_shifted % 1.0;

		do {
			// canvas_y_relative
			tmp = +((resolution_y_h - canvas_y)|0) * resolution_y_1d__fov_y;
			step_y = tmp * angle_v_cos - angle_v_sin;
			step_y_normal = 1.0 / Math_abs(step_y);
			// angle_v
			tmp = tmp * angle_v_sin + angle_v_cos;
			step_x_base = angle_h_sin * tmp;
			step_z_base = angle_h_cos * tmp;

			canvas_x = 0;
			do {
				// canvas_x_relative
				tmp = +((canvas_x - resolution_x_h)|0) * resolution_x_1d__fov_x;
				step_x = step_x_base + angle_h_cos * tmp;
				step_z = step_z_base - angle_h_sin * tmp;

				pixel_color = 4294947204; // SKY_COLOR
				check_distance_min = view_distance;

				// Y
				// check_y
				check_a = position_y_int;
				// step_y
				step_a = step_y < 0.0 ? -1 : 1;
				// step_x
				step_b = step_x * step_y_normal;
				// step_z
				step_c = step_z * step_y_normal;
				step_diagonal = Math_sqrt(
					step_b * step_b +
					step_c * step_c +
					1.0
				);

				// calculate start position
				// offset
				tmp = step_y < 0.0 ? position_y_rest : 1.0 - position_y_rest;
				// check_x
				check_b = position_x_shifted + step_b * tmp;
				// check_z
				check_c = position_z_shifted + step_c * tmp;
				check_distance = step_diagonal * tmp;

				// add steps until collision or out of range
				stepping: while (check_distance < check_distance_min) {
					// move on
					check_a = (check_a + step_a)|0;

					// check for collision
					switch (
						((step_a|0) < 0) << 2 |
						((check_a|0) < 0) << 1 |
						((check_a|0) >= 64) // CHUNK_HEIGHT
					) {
					case 1: // step_y > 0.0 && check_y >= CHUNK_HEIGHT
					case 6: // step_y < 0.0 && check_y < 0.0
						// will never reach a block
						break stepping;
					case 2: // step_y > 0.0 && check_y < 0.0
					case 5: // step_y < 0.0 && check_y >= CHUNK_HEIGHT
						// will maybe reach a block
						break;
					default:
						// inside world
						check_b_int = ~~Math_floor(check_b) & world_width_m1;
						check_c_int = ~~Math_floor(check_c) & world_width_m1;
						block = world[
							(
								(check_b_int << world_width_l2) |
								check_c_int
							) << 6 | // CHUNK_HEIGHT_L2
							check_a
						]|0;
						if (block) {
							// collision

							if (
								((canvas_y|0) == (resolution_y_h|0)) &
								((canvas_x|0) == (resolution_x_h|0)) &
								(check_distance < focus_distance_min)
							) {
								// set focus
								focus_set(
									check_b_int|0,
									check_a|0,
									check_c_int|0,
									((step_a|0) < 0) | 2
								);
								focus_distance_min = check_distance;
							}

							switch(block|0) {
							case 7: // TILE_LOG_SIDE
								block = 25; // TILE_LOG_TOP
								break;
							case 14: // TILE_BOOKSHELF
								block = 4; // TILE_PLANKS
								break;
							case 2: // TILE_GRASS_TOP
								if ((step_a|0) > 0) {
									break;
								}
							default:
								// shift so that block id 1 => tile 0
								block = (block - 1)|0;
							}

							// get pixel color
							block = texture_pixel_get(
								block << 8 | // TILES_RESOLUTION_LOG2 * 2
								// y
								(
									~~Math_floor(check_c * 16.0) & 15 // TILES_RESOLUTION
							 	) << 4 |
								// x
								~~Math_floor(check_b * 16.0) & 15
							)|0;

							if (block >>> 24) {
								// solid pixel
								pixel_color = block;
								check_distance_min = check_distance;
								break stepping;
							}
						}
					}

					// no collision yet
					check_b = +(check_b + step_b);
					check_c = +(check_c + step_c);
					check_distance = +(check_distance + step_diagonal);
				}

				// X
				// check_x
				check_a = position_x_shifted_int;
				// step_normal
				tmp = 1.0 / Math_abs(step_x);
				// step_x
				step_a = step_x < 0.0 ? -1 : 1;
				// step_y
				step_b = step_y * tmp;
				// step_z
				step_c = step_z * tmp;
				step_diagonal = Math_sqrt(
					step_b * step_b +
					step_c * step_c +
					1.0
				);

				// calculate start position
				// offset
				tmp = step_x < 0.0 ? position_x_shifted_rest : 1.0 - position_x_shifted_rest;
				// check_y
				check_b = position_y + step_b * tmp;
				// check_z
				check_c = position_z_shifted + step_c * tmp;
				check_distance = step_diagonal * tmp;

				// add steps until collision or out of range
				stepping: while (check_distance < check_distance_min) {
					// move on
					check_a = (check_a + step_a)|0;

					// check for collision
					switch (
						(step_b < 0.0) << 2 |
						(check_b < 0.0) << 1 |
						(check_b >= 64.0) // CHUNK_HEIGHT
					) {
					case 1: // step_y > 0.0 && check_y >= CHUNK_HEIGHT
					case 6: // step_y < 0.0 && check_y < 0.0
						// will never reach a block
						break stepping;
					case 2: // step_y > 0.0 && check_y < 0.0
					case 5: // step_y < 0.0 && check_y >= CHUNK_HEIGHT
						// will maybe reach a block
						break;
					default:
						// inside world
						check_b_int = ~~Math_floor(check_b);
						check_c_int = ~~Math_floor(check_c) & world_width_m1;
						block = world[
							(
								((check_a & world_width_m1) << world_width_l2) |
								check_c_int
							) << 6 | // CHUNK_HEIGHT_L2
							check_b_int
						]|0;
						if (block) {
							// collision

							if (
								((canvas_y|0) == (resolution_y_h|0)) &
								((canvas_x|0) == (resolution_x_h|0)) &
								(check_distance < focus_distance_min)
							) {
								// set focus
								focus_set(
									check_a & world_width_m1,
									check_b_int|0,
									check_c_int|0,
									(step_x < 0.0) | 0
								);
								focus_distance_min = check_distance;
							}

							if ((block|0) == 2) { // TILE_GRASS_TOP
								block = 24; // TILE_GRASS_SIDE
							}
							else {
								// shift so that block id 1 => tile 0
								block = (block - 1)|0;
							}

							// get pixel color
							block = texture_pixel_get(
								block << 8 | // TILES_RESOLUTION_LOG2 * 2
								// y
								(
									~~Math_floor(check_b * 16.0) & 15 // TILES_RESOLUTION
							 	) << 4 |
								// x
								~~Math_floor(
									(
										(step_a|0) < 0
										?	check_c + 65536.0
										:	-check_c + 65536.0
									) * 16.0
								) & 15
							)|0;

							if (block >>> 24) {
								// solid pixel
								pixel_color = block;
								check_distance_min = check_distance;
								break stepping;
							}
						}
					}

					// no collision yet
					check_b = +(check_b + step_b);
					check_c = +(check_c + step_c);
					check_distance = +(check_distance + step_diagonal);
				}

				// Z
				// check_z
				check_a = position_z_shifted_int;
				// step_normal
				tmp = 1.0 / Math_abs(step_z);
				// step_z
				step_a = step_z < 0.0 ? -1 : 1;
				// step_y
				step_b = step_y * tmp;
				// step_x
				step_c = step_x * tmp;
				step_diagonal = Math_sqrt(
					step_b * step_b +
					step_c * step_c +
					1.0
				);

				// calculate start position
				// offset
				tmp = step_z < 0.0 ? position_z_shifted_rest : 1.0 - position_z_shifted_rest;
				// check_y
				check_b = position_y + step_b * tmp;
				// check_x
				check_c = position_x_shifted + step_c * tmp;
				check_distance = step_diagonal * tmp;

				// add steps until collision or out of range
				stepping: while (check_distance < check_distance_min) {
					// move on
					check_a = (check_a + step_a)|0;

					// check for collision
					switch (
						(step_b < 0.0) << 2 |
						(check_b < 0.0) << 1 |
						(check_b >= 64.0) // CHUNK_HEIGHT
					) {
					case 1: // step_y > 0.0 && check_y >= CHUNK_HEIGHT
					case 6: // step_y < 0.0 && check_y < 0.0
						// will never reach a block
						break stepping;
					case 2: // step_y > 0.0 && check_y < 0.0
					case 5: // step_y < 0.0 && check_y >= CHUNK_HEIGHT
						// will maybe reach a block
						break;
					default:
						// inside world
						check_b_int = ~~Math_floor(check_b);
						check_c_int = ~~Math_floor(check_c) & world_width_m1;
						block = world[
							(
								(check_c_int << world_width_l2) |
								check_a & world_width_m1
							) << 6 | // CHUNK_HEIGHT_L2
							check_b_int
						]|0;
						if (block) {
							// collision

							if (
								((canvas_y|0) == (resolution_y_h|0)) &
								((canvas_x|0) == (resolution_x_h|0)) &
								(check_distance < focus_distance_min)
							) {
								// set focus
								focus_set(
									check_c_int|0,
									check_b_int|0,
									check_a & world_width_m1,
									(step_z < 0.0) | 4
								);
								focus_distance_min = check_distance;
							}

							if ((block|0) == 2) { // TILE_GRASS_TOP
								block = 24; // TILE_GRASS_SIDE
							}
							else {
								// shift so that block id 1 => tile 0
								block = (block - 1)|0;
							}

							// get pixel color
							block = texture_pixel_get(
								block << 8 | // TILES_RESOLUTION_LOG2 * 2
								// y
								(
									~~Math_floor(check_b * 16.0) & 15 // TILES_RESOLUTION
							 	) << 4 |
								// x
								~~Math_floor(
									(
										(step_a|0) < 0
										?	-check_c + 65536.0
										:	check_c + 65536.0
									) * 16.0
								) & 15
							)|0;

							if (block >>> 24) {
								// solid pixel
								pixel_color = block;
								check_distance_min = check_distance;
								break stepping;
							}
						}
					}

					// no collision yet
					check_b = +(check_b + step_b);
					check_c = +(check_c + step_c);
					check_distance = +(check_distance + step_diagonal);
				}

				pixel_set(canvas_surface_data_index|0, pixel_color|0);
				canvas_surface_data_index = (canvas_surface_data_index + 1)|0;

				canvas_x = (canvas_x + 1)|0;
			}
			while ((canvas_x|0) < (resolution_x|0));
			canvas_y = (canvas_y + 1)|0;
		}
		while ((canvas_y|0) < (resolution_y|0));
	}

	return {
		z: render
	};
};

export const asm_link = model => {
	const {
		canvas_surface_data32,
		game,
	} = model;
	const {
		player,
		resolution_x,
		resolution_y,
		world,
	} = game;
	const pixel_set = (index, color) => {
		canvas_surface_data32[index] = color;
	};
	const focus_set = (x, y, z, face) => {
		player.block_focus_x = x;
		player.block_focus_y = y;
		player.block_focus_z = z;
		player.block_focus_face = face;
	};
	const texture_pixel_get = index => (
		tiles_data !== null
		?	tiles_data[index]
		:	BLOCK_COLORS[index >>> (TILES_RESOLUTION_LOG2 * 2)]
	);
	const world_width_l2 = world.size_l2 + CHUNK_WIDTH_L2;

	model.asm_instance = asm_core(
		window_,
		{
			'a': pixel_set,
			'b': focus_set,
			'c': resolution_x,
			'd': resolution_y,
			'e': resolution_x >> 1,
			'f': resolution_y >> 1,
			'j': world_width_l2,
			'k': (1 << world_width_l2) - 1,
			'l': texture_pixel_get,
		},
		world.blocks.buffer
	)['z'];
}

export const renderer_render = (model, now) => {
	++model.fps_counter;

	const {
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

		const fov = config.view_angle / 45;// TODO
		const fov_x = resolution_x < resolution_y ? fov * resolution_x / resolution_y : fov;
		const fov_y = resolution_y < resolution_x ? fov * resolution_y / resolution_x : fov;

		player.block_focus_y = -1;

		model.asm_instance(
			config.view_distance,
			fov_x / resolution_x,
			fov_y / resolution_y,
			Math_cos(angle_h),
			Math_sin(angle_h),
			Math_cos(-angle_v),
			Math_sin(-angle_v),
			block_focus_x,
			block_focus_y,
			block_focus_z,
			position_x,
			position_y,
			position_z
		);

		model.canvas_context.putImageData(
			model.canvas_surface,
			0, 0
		);
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
			//'S: ' + check_count + ', ' +
			'C: ' + world.chunks_checklist_index + '/' + world.chunks_checklist.length + ', ' +
			'M: ' + (
				number_square(
					1 << (CHUNK_WIDTH_L2 + world.size_l2)
				)
				* CHUNK_HEIGHT >> 10
			) + 'k\n' +
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
			'Chunk abs: ' + (
				Math_floor(player.position_x) >> CHUNK_WIDTH_L2
			) + ' ' + (
				Math_floor(player.position_z) >> CHUNK_WIDTH_L2
			) + ' ' + (
				Math_floor(player.position_y) >> CHUNK_WIDTH_L2
			) + ' rel: ' + (
				world.focus_x
			) + ' ' + (
				world.focus_z
			) + ' ' + (
				world.focus_y
			)
		:	''
	);
}

export const renderer_canvas_init = model => {
	(
		model.canvas_surface_data32 = new Uint32Array_((
			model.canvas_surface = model.canvas_context.createImageData(
				model.canvas_element.width = model.game.resolution_x,
				model.canvas_element.height = model.game.resolution_y
			)
		).data.buffer)
	).fill(0xffff0000);
	model.canvas_context.fillStyle = 'rgba(255,255,255,.5)';
	asm_link(model);
}
