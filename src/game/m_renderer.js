import {
	defer,
	defer_end,
} from '../etc/lui.js';

import {
	BLOCK_COLORS,
	BLOCK_TYPE_AIR,
	BLOCK_TYPE_FACE_I,
	BLOCK_TYPE_FACE_LABELS,
	CHUNK_HEIGHT,
	CHUNK_HEIGHT_FACTOR,
	CHUNK_HEIGHT_L2,
	CHUNK_WIDTH_L2,
	GAMEMODE_CREATIVE,
	GAMEMODE_SPECTATOR,
	ITEM_HANDLES,
	PLAYER_FOCUS_DISTANCE_CREATIVE,
	PLAYER_FOCUS_DISTANCE_NORMAL,
} from '../etc/constants.js';
import {
	API_DATA,
	VERSION,
} from '../etc/env.js';
import {
	clearTimeout_,
	document_,
	Math_ceil,
	Math_cos,
	Math_floor,
	Math_max,
	Math_min,
	Math_PI_180d,
	Math_PI_d360,
	Math_random,
	Math_round,
	Math_sin,
	Math_sqrt,
	Math_tan,
	number_padStart2,
	number_square,
	number_toFixed2,
	Set_,
	setInterval_,
	Uint32Array_,
} from '../etc/helpers.js';
import {
	locale_error_loading_surface,
} from '../etc/locale.js';
import {
	actions,
	app_state,
} from '../etc/state.js';
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

import {
	world_block_get,
	world_microtick,
} from './m_world.js';

// parse png
let tiles_data = null;
let tiles_latest_working = 0;
const renderer_instances = new Set_;

export const tiles_set = id => {
	if (!id) {
		tiles_data = null;
	}
	else {
		const tiles_image = new Image();
		if (VERSION === 'dev') {
			tiles_image.crossOrigin = 'anonymous';
		}
		tiles_image.onload = () => {
			if (app_state.surface_loading !== id) return;
			const canvas_temp = document_.createElement('canvas');
			canvas_temp.width = TILES_RESOLUTION;
			canvas_temp.height = TILES_COUNT << TILES_RESOLUTION_LOG2;
			const context = canvas_temp.getContext('2d');
			// draw image flipped
			context.scale(1, -1);
			for (let tile = 0; tile < TILES_COUNT; ++tile) {
				context.drawImage(
					tiles_image,
					0, tile << TILES_RESOLUTION_LOG2,
					TILES_RESOLUTION, TILES_RESOLUTION,
					0, -(tile << TILES_RESOLUTION_LOG2) - TILES_RESOLUTION,
					TILES_RESOLUTION, TILES_RESOLUTION
				);
			}
			tiles_data = new Uint32Array_(
				context.getImageData(
					0, 0,
					TILES_RESOLUTION,
					TILES_COUNT << TILES_RESOLUTION_LOG2
				).data.buffer
			);
			for (const model of renderer_instances) model.flag_dirty = true;
			tiles_latest_working = id;
			actions.state_patch({
				surface_loading: 0,
			});
		}
		tiles_image.onerror = () => {
			if (app_state.surface_loading !== id) return;
			alert(locale_error_loading_surface);
			defer();
			actions.config_set({
				textures: tiles_latest_working,
			});
			actions.state_patch({
				surface_loading: 0,
			});
			defer_end();
		}
		tiles_image.src = `${API_DATA}textures/${id}.png`;
	}
}

export const renderer_create = (game, canvas_element) => {
	const model = {
		canvas_element,
		canvas_context: canvas_element.getContext('2d', {
			alpha: false,
			desynchronized: true,
		}),
		canvas_surface: null,
		canvas_surface_data: null,
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
	renderer_instances.add(model);
	renderer_canvas_init(model);
	return model;
}

export const renderer_destroy = model => (
	renderer_instances.delete(model),
	clearTimeout_(model.fps_interval)
);

export const renderer_render = (model, now) => {
	++model.fps_counter;

	const {
		canvas_context,
		canvas_surface,
		canvas_surface_data,
		game,
	} = model;
	const {
		config,
		flag_hud,
		player,
		resolution_x,
		resolution_y,
		world,
	} = game;

	let block_inside = 0;

	if (
		!game.flag_paused ||
		model.flag_dirty
	) {
		model.flag_dirty = false;

		const {
			flag_blocks_dimming,
			pixel_grouping,
			view_distance,
		} = config;
		const {
			angle_h,
			angle_v,
			block_focus_x,
			block_focus_z,
			gamemode,
			position_x,
			position_y,
			position_z,
		} = player;
		const block_focus_y = flag_hud ? player.block_focus_y : -1;
		const {
			blocks,
			size_l2,
			time_f,
		} = world;
		const flag_textures = tiles_data !== null;
		const resolution_x_1d = 1 / resolution_x;
		const resolution_y_1d = 1 / resolution_y;
		const resolution_x_h = resolution_x >> 1;
		const resolution_y_h = resolution_y >> 1;
		const resolution_min = Math_min(resolution_x, resolution_y);
		const cursor_cross = resolution_min > 32;
		const pixel_focus_x = resolution_x_h;
		const pixel_focus_y = resolution_y_h;
		const angle_h_cos = Math_cos(angle_h);
		const angle_h_sin = Math_sin(angle_h);
		const angle_v_cos = Math_cos(-angle_v);
		const angle_v_sin = Math_sin(-angle_v);
		// virtual screen size at unit focal distance, along the longer screen dimension
		const fov = 2 * Math_tan(config.view_angle * Math_PI_d360);
		const fov_x = resolution_x < resolution_y ? fov * resolution_x * resolution_y_1d : fov;
		const fov_y = resolution_y < resolution_x ? fov * resolution_y * resolution_x_1d : fov;
		const resolution_x_1d__fov_x = resolution_x_1d * fov_x;
		const resolution_y_1d__fov_y = resolution_y_1d * fov_y;
		const position_x_block = Math_floor(position_x);
		const position_y_block = Math_floor(position_y);
		const position_z_block = Math_floor(position_z);
		const world_width_l2 = CHUNK_WIDTH_L2 + size_l2;
		const world_width_m1 = (1 << world_width_l2) - 1;
		const group_width = pixel_grouping < resolution_x ? pixel_grouping : 1;
		const group_last = resolution_x - group_width;
		// time_f is 0..1, where 0 is midnight and 0.5 is noon
		const sky_brightness = 1 - .9 * Math_max(
			0,
			Math_cos(time_f * Math_PI_d360 * 720)
		);
		const sky_color = (
			Math_round(0xff * sky_brightness) << 16 |
			Math_round(0xb1 * sky_brightness) << 8 |
			Math_round(0x84 * sky_brightness)
		);

		let focus_distance_min =
			player.gamemode === GAMEMODE_CREATIVE
			?	PLAYER_FOCUS_DISTANCE_CREATIVE
			:	PLAYER_FOCUS_DISTANCE_NORMAL;
		let canvas_surface_data_index_row =
			player.block_focus_x =
			player.block_focus_z =
			player.block_focus_face = 0;

		player.block_focus_y = -1;
		block_inside =
			(position_y < 0 || position_y >= CHUNK_HEIGHT) ? 0 :
			world_block_get(
				world,
				position_x_block & world_width_m1,
				position_y_block & (CHUNK_HEIGHT - 1),
				position_z_block & world_width_m1
			);

		// inside block?
		if (
			gamemode !== GAMEMODE_SPECTATOR &&
			block_inside > 0
		) {
			player.block_focus_x = position_x_block & world_width_m1;
			player.block_focus_y = position_y_block & (CHUNK_HEIGHT - 1);
			player.block_focus_z = position_z_block & world_width_m1;
			player.block_focus_face = BLOCK_TYPE_FACE_I;
			canvas_surface_data.fill(BLOCK_COLORS[block_inside] | 0xff000000);
		}
		else {
			tiles_data = /** @type {Uint32Array!} */ (tiles_data);

			for (let canvas_y = 0; canvas_y < resolution_y; ++canvas_y) {
				const canvas_y_relative = (resolution_y_h - canvas_y) * resolution_y_1d__fov_y;

				// vertical head rotation
				const step_y_row = canvas_y_relative * angle_v_cos - angle_v_sin;
				const step_xz_row = canvas_y_relative * angle_v_sin + angle_v_cos;
				// apply horizontal head rotation
				const step_x_center = step_xz_row * angle_h_sin;
				const step_z_center = step_xz_row * angle_h_cos;

				let canvas_x = 0;
				let group_color = 0;
				let group_at_end = false;
				let group_last_filled = false;

				group: for (
					let canvas_x_group = 0;
					canvas_x_group < resolution_x;
					canvas_x_group += group_width
				)
				for (
					let group_index = group_last_filled ? 1 : 0;
					group_index < group_width;
					++group_index
				) {
					// pixel_grouping disabled
					if (group_width < 2) canvas_x = canvas_x_group;
					// first canvas_x_group
					else if (canvas_x_group === 0) {
						canvas_x = (
							group_index === 0
							?	0
							: group_index === 1
							?	group_width
							:	group_index - 1
						);
						group_at_end = group_index === 1;
					}
					// middle canvas_x_group
					else if (canvas_x_group < group_last) {
						canvas_x = (
							(
								group_at_end = group_index === 1
							)
							?	canvas_x_group + group_width
							:	canvas_x_group + group_index - 1
						);
					}
					// last canvas_x_group
					else {
						if (
							(
								canvas_x = (
									group_index === 0
									?	canvas_x_group - 1
									:	canvas_x_group + group_index
								)
							) >= resolution_x
						) break group;
						group_at_end = false;
					}

					const canvas_x_relative = (canvas_x - resolution_x_h) * resolution_x_1d__fov_x;

					// ray direction, yet unnormalized
					const step_x_raw = step_x_center + canvas_x_relative * angle_h_cos;
					const step_z_raw = step_z_center - canvas_x_relative * angle_h_sin;

					let pixel_color = sky_color;
					let pixel_factor = 1.0;
					let check_distance_start = 0;

					// see through blocks in spectator mode
					if (
						gamemode === GAMEMODE_SPECTATOR &&
						block_inside > 0
					) {
						check_distance_start = Math_random() * Math_random() * 10;
					}

					// normalize ray direction
					const step_inverse = 1 / Math_sqrt(
						step_x_raw * step_x_raw +
						step_y_row * step_y_row +
						step_z_raw * step_z_raw
					);
					const step_x = step_x_raw * step_inverse;
					const step_y = step_y_row * step_inverse;
					const step_z = step_z_raw * step_inverse;
					// split signs and amounts
					const step_x_sign = step_x > 0 ? 1 : step_x < 0 ? -1 : 0;
					const step_y_sign = step_y > 0 ? 1 : step_y < 0 ? -1 : 0;
					const step_z_sign = step_z > 0 ? 1 : step_z < 0 ? -1 : 0;
					const step_x_delta = step_x_sign === 0 ? 1 / 0 : step_x_sign / step_x;
					const step_y_delta = step_y_sign === 0 ? 1 / 0 : step_y_sign / step_y;
					const step_z_delta = step_z_sign === 0 ? 1 / 0 : step_z_sign / step_z;

					// current position, in full blocks world coordinates
					let check_x_block = position_x_block;
					let check_y_block = position_y_block;
					let check_z_block = position_z_block;

					// current distance to first boundary, in world units
					let check_distance_x = (
						step_x < 0
						?	(position_x - check_x_block) * step_x_delta
						:	(check_x_block - position_x + 1) * step_x_delta
					);
					let check_distance_y = (
						step_y < 0
						?	(position_y - check_y_block) * step_y_delta
						:	(check_y_block - position_y + 1) * step_y_delta
					);
					let check_distance_z = (
						step_z < 0
						?	(position_z - check_z_block) * step_z_delta
						:	(check_z_block - position_z + 1) * step_z_delta
					);

					// render pixel, using dda raymarching
					for (;;) {
						let dim = 0;
						let step_dim = step_x;
						let check_distance = check_distance_x;

						if (check_distance_y < check_distance) {
							dim = 1;
							step_dim = step_y;
							check_distance = check_distance_y;
						}
						if (check_distance_z < check_distance) {
							dim = 2;
							step_dim = step_z;
							check_distance = check_distance_z;
						}

						if (check_distance >= view_distance) break;

						if (dim === 0) {
							check_x_block += step_x_sign;
							check_distance_x += step_x_delta;
						}
						else if (dim === 1) {
							check_y_block += step_y_sign;
							check_distance_y += step_y_delta;
						}
						else {
							check_z_block += step_z_sign;
							check_distance_z += step_z_delta;
						}

						if (check_y_block < 0) {
							if (step_y > 0) continue;
							break;
						}
						if (check_y_block >= CHUNK_HEIGHT) {
							if (step_y < 0) continue;
							break;
						}

						const check_x_int = check_x_block & world_width_m1;
						const check_y_int = check_y_block & (CHUNK_HEIGHT - 1);
						const check_z_int = check_z_block & world_width_m1;
						let block = blocks[
							(
								(check_x_int << world_width_l2) |
								check_z_int
							) << CHUNK_HEIGHT_L2 |
							check_y_int
						];
						if (
							gamemode === GAMEMODE_SPECTATOR &&
							check_distance < check_distance_start
						) {
							if (block === BLOCK_TYPE_AIR) {
								check_distance_start = 0;
							}
							continue;
						}
						if (block === BLOCK_TYPE_AIR) continue;

						if (
							gamemode !== GAMEMODE_SPECTATOR &&
							canvas_y === pixel_focus_y &&
							canvas_x === pixel_focus_x &&
							check_distance <= focus_distance_min
						) {
							// set focus
							player.block_focus_x = check_x_int;
							player.block_focus_y = check_y_int;
							player.block_focus_z = check_z_int;
							player.block_focus_face = (step_dim < 0) | dim << 1;
							focus_distance_min = check_distance;
						}

						// calculate color
						if (flag_textures) {
							// shift so that block id 1 => tile 0
							--block;

							if (dim === 1) {
								if (block === TILE_LOG_SIDE)
									block = TILE_LOG_TOP;
								else if (block === TILE_BOOKSHELF)
									block = TILE_PLANKS;
								else if (
									block === TILE_GRASS_TOP &&
									step_y > 0
								) block = TILE_DIRT;
							}
							else if (block === TILE_GRASS_TOP)
								block = TILE_GRASS_SIDE;

							// intersected pixel in world coordinates
							const hit_x = position_x + step_x * check_distance;
							const hit_z = position_z + step_z * check_distance;
							// pick pixel from texture
							const texture_pixel = tiles_data[
								block << (TILES_RESOLUTION_LOG2 * 2) |
								(
									// y
									Math_floor(
										(
											dim === 1
											?	hit_z
											:	position_y + step_y * check_distance
										) * TILES_RESOLUTION
									) & (TILES_RESOLUTION - 1)
								) << TILES_RESOLUTION_LOG2 |
								// x
								Math_floor(
									(
										dim === 1
										?	hit_x
										:	(
											step_dim > 0
											?	hit_x - hit_z
											:	hit_z - hit_x
										)
									) * TILES_RESOLUTION
								) & (TILES_RESOLUTION - 1)
							];

							// transparent pixel?
							if (texture_pixel >>> 24 === 0) continue;

							// solid pixel
							pixel_color = texture_pixel & 0xffffff;
						}
						else pixel_color = BLOCK_COLORS[block];

						pixel_factor = (
							// fake shadow to see edges
							(
								dim === 0
								?	.8
								: dim === 2
								?	.6
								: step_dim > 0
								?	.4
								:	1
							) +
							// highlight if focussed
							(
								check_y_int !== block_focus_y ||
								check_x_int !== block_focus_x ||
								check_z_int !== block_focus_z
								?	0
								:	.2
							)
						);

						if (flag_blocks_dimming) {
							pixel_factor *= sky_brightness;
						}

						break;
					}

					// apply lighting and alpha
					pixel_color = (
						0xff000000 |
						Math_min((pixel_color >> 16) * pixel_factor, 0xff) << 16 |
						Math_min(((pixel_color >> 8) & 0xff) * pixel_factor, 0xff) << 8 |
						Math_min((pixel_color & 0xff) * pixel_factor, 0xff)
					);

					if (
						group_last_filled = (
							(
								group_at_end = group_at_end && (
									canvas_y !== pixel_focus_y ||
									canvas_x < pixel_focus_x ||
									canvas_x > pixel_focus_x + group_width
								)
							) &&
							group_color === pixel_color
						)
					) {
						if (group_width > 6) {
							canvas_surface_data.fill(
								group_color,
								canvas_surface_data_index_row + canvas_x_group + 1,
								canvas_surface_data_index_row + canvas_x_group + group_width + 1
							);
							break;
						}
						let i = canvas_surface_data_index_row + canvas_x_group + 1;
						canvas_surface_data[i] = group_color;
						canvas_surface_data[++i] = group_color;
						if (group_width < 3) break;
						canvas_surface_data[++i] = group_color;
						if (group_width < 4) break;
						canvas_surface_data[++i] = group_color;
						if (group_width < 5) break;
						canvas_surface_data[++i] = group_color;
						if (group_width < 6) break;
						canvas_surface_data[++i] = group_color;
						break;
					}
					if (
						group_at_end ||
						canvas_x === 0
					) group_color = pixel_color;
					canvas_surface_data[canvas_surface_data_index_row + canvas_x] = pixel_color;
				}

				canvas_surface_data_index_row += resolution_x;
			}

			// cursor
			if (
				flag_hud &&
				!cursor_cross
			) {
				canvas_surface_data[
					resolution_x * pixel_focus_y + pixel_focus_x
				] ^= 0xffffff;
			}
		}

		canvas_context.putImageData(canvas_surface, 0, 0);

		if (
			flag_hud &&
			cursor_cross
		) {
			const cross_width_h = Math_min(
				Math_ceil(resolution_min * .05),
				8
			);
			const cross_width = cross_width_h << 1;
			canvas_context.fillRect(
				resolution_x_h - cross_width_h,
				resolution_y_h - 1,
				cross_width,
				2
			);
			canvas_context.fillRect(
				resolution_x_h - 1,
				resolution_y_h - cross_width_h,
				2,
				cross_width_h - 1
			);
			canvas_context.fillRect(
				resolution_x_h - 1,
				resolution_y_h + 1,
				2,
				cross_width_h - 1
			);
		}
	}

	world_microtick(world, player);

	if (!game.flag_diagnostics) {
		model.diagnostics = '';
	}
	else {
		const chunk_y = Math_floor(player.position_y) >> CHUNK_WIDTH_L2;
		const chunk = (
			chunk_y >= 0 &&
			chunk_y < CHUNK_HEIGHT_FACTOR &&
			world.chunks_checklist &&
			world.chunks[
				world.chunks_checklist[0].chunks_index
			]
		);
		let chunk_flags = [];
		if (chunk) {
			if (chunk.flag_dirty) chunk_flags.push('modified');
			if (chunk.flag_loading) chunk_flags.push('loading');
			if (!chunk.flag_used) chunk_flags.push('empty');
		}

		model.diagnostics = (
`minicraft ${VERSION} ${
	number_padStart2(model.fps, '\xa0')
} fps, T: ${
	number_padStart2(world.time_f * 24, '0')
}:${
	number_padStart2((((world.time_f * 24) % 1) * 60), '0')
}; ${
	game.flag_paused &&
	now % 1e3 < 500
	?	''
	:	world.time
}${world.flag_busy ? ' busy' : ''}
R: ${resolution_x}x${resolution_y} (x${config.resolution_scaling}), D: ${config.view_distance}, C: ${world.chunks_checklist_index}/${world.chunks_checklist.length}, M: ${
	number_square(
		1 << (CHUNK_WIDTH_L2 + world.size_l2)
	)
	* CHUNK_HEIGHT >> 10
}k
E: 0/0, M: ${player.gamemode}, I: ${block_inside}

Position: ${
	number_toFixed2(player.position_x)
} ${
	number_toFixed2(player.position_y)
} ${
	number_toFixed2(player.position_z)
}
Angle: ${
	number_toFixed2(player.angle_h * Math_PI_180d)
} ${
	number_toFixed2(player.angle_v * Math_PI_180d)
}
Focus: ${
	player.block_focus_y < 0
	?	''
	:	'(' + player.block_focus_x + ' ' +
		player.block_focus_y + ' ' +
		player.block_focus_z + ') ' +
		BLOCK_TYPE_FACE_LABELS[player.block_focus_face] + ': ' +
		ITEM_HANDLES[
			world_block_get(
				world,
				player.block_focus_x,
				player.block_focus_y,
				player.block_focus_z
			)
		]
}
Chunk abs: (${
	Math_floor(player.position_x) >> CHUNK_WIDTH_L2
} ${
	Math_floor(player.position_z) >> CHUNK_WIDTH_L2
} ${
	chunk_y
}) ${
	chunk
	?	'rel: (' + chunk.x + ' ' + chunk.z + ' ' + chunk.y + ') ' + chunk_flags.join(' ')
	:	'void'
}`
		);
	}
}

export const renderer_canvas_init = model => {
	const {
		canvas_element,
		game,
	} = model;
	model.canvas_surface_data = new Uint32Array_(
		(
			model.canvas_surface = model.canvas_context.createImageData(
				canvas_element.width = game.resolution_x,
				canvas_element.height = game.resolution_y
			)
		).data.buffer
	);
	const canvas_width = game.resolution_x * game.config.resolution_scaling / game.resolution_css_ratio;
	const canvas_height = game.resolution_y * game.config.resolution_scaling / game.resolution_css_ratio;
	canvas_element.style.width = canvas_width + 'px';
	canvas_element.style.height = canvas_height + 'px';
	canvas_element.style.left = Math_round((game.resolution_raw_x - canvas_width) / 2) + 'px';
	canvas_element.style.top = Math_round((game.resolution_raw_y - canvas_height) / 2) + 'px';
	model.canvas_context.fillStyle = 'rgba(255,255,255,.5)';
}
