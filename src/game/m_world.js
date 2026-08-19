import {
	BLOCK_TYPE_AIR,
	BLOCK_TYPE_BEDROCK,
	BLOCK_TYPE_DIRT,
	BLOCK_TYPE_GRASS,
	BLOCK_TYPE_STONE,
	CHUNK_HEIGHT,
	CHUNK_HEIGHT_FACTOR,
	CHUNK_HEIGHT_FACTOR_L2,
	CHUNK_HEIGHT_L2,
	CHUNK_WIDTH,
	CHUNK_WIDTH_L2,
	COORDINATE_OFFSET,
	FLATMAP_LAYERS_LENGTH,
	WORLD_FORMAT,
} from '../etc/constants.js';
import {
	Date_now,
	JSON_parse,
	JSON_stringify,
	localStorage_getItem,
	localStorage_setItem,
	Map_,
	Math_abs,
	Math_floor,
	Math_max,
	Math_min,
	number_square,
	Promise_,
	Promise_all,
	Uint32Array_,
	Uint8Array_,
} from '../etc/helpers.js';
import {
	compress,
	decompress,
} from '../etc/lz.js';
import {
	actions,
	app_state,
} from '../etc/state.js';
import {
	chunk_delete,
	chunk_get,
	chunk_set,
} from '../etc/storage.js';

import {
	stack_create,
} from './m_stack.js';

export const worlds = new Map_();

// used for loading/saving of chunks (prevent frequent reallocation)
// synchronous usage only!
const chunk_data_tmp = new Uint32Array_(1 << (CHUNK_WIDTH_L2 * 3 - 2));
const chunk_data_tmp_u8 = new Uint8Array_(chunk_data_tmp.buffer);

export const world_create = id => {
	const world_meta = app_state.worlds_merged.find(i => i.id === id);
	const world = {
		// blocks of superchunk
		// uint8[]
		blocks: null,
		blocks_u32: null,
		// all chunk metadata currently in superchunk
		chunks: null,
		// {chunk metadata index, offset x, offset z}, sorted by loading order
		chunks_checklist: null,
		// next checklist item to check
		chunks_checklist_index: 0,
		// chunks that are being loaded or need to be processed
		chunks_load_queue: [],
		// running chunk_load all, regen, save all etc.
		flag_busy: false,
		// could have been modified since last save
		flag_dirty: false,
		// nothing must change
		flag_frozen: !world_meta.writable || world_meta.locked,
		// currently centered chunk (relative chunk position inside superchunk)
		focus_x: 0,
		focus_y: 0,
		focus_z: 0,
		// world id for storage
		id,
		// superchunk offset in chunks
		offset_x: 0,
		offset_z: 0,
		// outstanding saves
		saves_pending: 0,
		// log2 of superchunk width
		size_l2: 0,
		// block position of player spawn
		spawn_x: 0.5,
		spawn_y: FLATMAP_LAYERS_LENGTH + 1.5,
		spawn_z: 0.5,
		// ingame time
		time: 0,
		time_f: 0.0,
	};
	worlds.set(id, world);
	actions.state_patch({
		worlds_opened: [...worlds.keys()],
	});
	return world;
}

export const world_destroy = model => {
	worlds.delete(model.id);
	actions.state_patch({
		worlds_opened: [...worlds.keys()],
	});
}

/*
	blocks:
	x << CHUNK_HEIGHT_L2 + CHUNK_WIDTH_L2 + size_l2
	z << CHUNK_HEIGHT_L2
	y
*/

const world_block_index = (size_l2, x, z, y) => (
	(
		x << (size_l2 + CHUNK_WIDTH_L2) | z
	) << CHUNK_HEIGHT_L2 | y
);

const world_chunk_index_r2 = (size_l2, x, z, y) => (
	world_block_index(
		size_l2,
		x, z, y
	) << (CHUNK_WIDTH_L2 - 2)
);

/*
	chunks:
	x << CHUNK_HEIGHT_FACTOR + size_l2
	z << CHUNK_HEIGHT_FACTOR
	y
*/

const world_chunk_get = (chunks, size_l2, x, y, z) => (
	chunks[
		(
			(x >> CHUNK_WIDTH_L2) << size_l2 |
			(z >> CHUNK_WIDTH_L2)
		) << CHUNK_HEIGHT_FACTOR_L2 |
		y >> CHUNK_WIDTH_L2
	]
);

export const world_block_get = (model, x, y, z) => (
	y < 0 || y > (CHUNK_HEIGHT - 1) ? BLOCK_TYPE_AIR :
	model.blocks[
		world_block_index(model.size_l2, x, z, y)
	]
);

/**
	tries to set a block
	attention: if the chunk is not loaded, the change is lost
*/
export const world_block_set = (model, x, y, z, value) => {
	const {size_l2} = model;
	const chunk = world_chunk_get(
		model.chunks, size_l2,
		x, y, z
	);
	if (!chunk.flag_loading) {
		model.blocks[
			world_block_index(size_l2, x, z, y)
		] = value;
		chunk.flag_dirty = chunk.flag_used = true;
	}
}

/**
	tries to set a block, only possible if the space is empty and the chunk is loaded
	@return {boolean} success
*/
export const world_block_set_try = (model, x, y, z, value) => {
	const {size_l2} = model;
	const chunk = world_chunk_get(
		model.chunks, size_l2,
		x, y, z
	);
	const index = world_block_index(size_l2, x, z, y);
	if (
		!chunk.flag_loading &&
		model.blocks[index] === BLOCK_TYPE_AIR
	) {
		model.blocks[index] = value;
		chunk.flag_dirty = chunk.flag_used = true;
		return true;
	}
	return false;
}

export const world_data_init = async (model, player, size_l2) => {
	if (model.chunks) await world_save(model, player, true);

	const size = 1 << (
		model.size_l2 = size_l2
	);
	const chunks = model.chunks = [];
	for (let x = 0; x < size; ++x)
	for (let z = 0; z < size; ++z)
	for (let y = 0; y < CHUNK_HEIGHT_FACTOR; ++y)
		chunks.push({
			// changes that need to be saved?
			flag_dirty: false,
			// is it loading?
			flag_loading: false,
			// non-zero? -> allows skipping loading of empty chunks
			flag_used: false,
			// xyz in superchunk
			x,
			y,
			z,
			// xz in world
			x_abs: x + 1, // always invalid to force initial load
			z_abs: 0,
		});

	const size_new = size << (
		size_l2
		+ CHUNK_WIDTH_L2 * 3
		+ CHUNK_HEIGHT_FACTOR_L2
	);
	if (
		model.blocks === null ||
		model.blocks.length < size_new
	) {
		model.blocks_u32 = new Uint32Array_((
			model.blocks = new Uint8Array_(size_new)
		).buffer);
	}
	else {
		model.blocks_u32.fill(0);
	}

	world_offset_update(model, player, true);
}

export const world_tick = model => {
	model.flag_dirty = true;
	world_time_set(model, model.time + 1);
}

export const world_microtick = (model, player) => {
	world_offset_update(model, player, false);
}

const world_offset_update = (model, player, force) => {
	const focus_y = Math_max(
		Math_min(player.position_y, CHUNK_HEIGHT - 1),
		0
	) >> CHUNK_WIDTH_L2;
	const chunk_x_abs = Math_floor(player.position_x) >> CHUNK_WIDTH_L2;
	const chunk_z_abs = Math_floor(player.position_z) >> CHUNK_WIDTH_L2;
	if (
		force ||
		model.focus_y !== focus_y ||
		model.offset_x + model.focus_x !== chunk_x_abs ||
		model.offset_z + model.focus_z !== chunk_z_abs
	) {
		const {
			chunks,
			size_l2,
		} = model;
		const world_size = 1 << size_l2;
		const focus_x = model.focus_x = (
			COORDINATE_OFFSET + chunk_x_abs
		) % world_size;
		const focus_z = model.focus_z = (
			COORDINATE_OFFSET + chunk_z_abs
		) % world_size;
		const size_half = world_size >> 1;
		const max_dist_axis = Math_max(size_half - 2, 8);
		const chunks_checklist = model.chunks_checklist = [];
		model.chunks_checklist_index = 0;
		model.focus_y = focus_y;
		model.offset_x = chunk_x_abs - focus_x;
		model.offset_z = chunk_z_abs - focus_z;

		for (
			let chunks_index = 0, chunks_length = chunks.length;
			chunks_index < chunks_length;
			++chunks_index
		) {
			const {x, y, z} = chunks[chunks_index];

			let dx = Math_abs(x - focus_x);
			let offset_x = 0;
			if (dx > size_half) {
				dx = world_size - dx;
				offset_x = (x < focus_x ? world_size : -world_size);
			}
			if (dx > max_dist_axis) continue;

			let dz = Math_abs(z - focus_z);
			let offset_z = 0;
			if (dz > size_half) {
				dz = world_size - dz;
				offset_z = (z < focus_z ? world_size : -world_size);
			}
			if (dz > max_dist_axis) continue;

			chunks_checklist.push({
				dist: dx * dx + dz * dz + number_square(y - focus_y),
				chunks_index,
				offset_x,
				offset_z,
			});
		}
		chunks_checklist.sort((a, b) => a.dist - b.dist);
	}
	if (!model.flag_busy) {
		world_chunk_load(model, false);
	}
}

export const world_save = async (model, player, force) => {
	if (
		!force && model.flag_busy ||
		model.flag_frozen ||
		!model.flag_dirty
	) return;

	model.flag_busy = true;
	model.flag_dirty = false;
	const mod_l = Date_now();

	const i = player.inventory.map(({content}) =>
		content && [
			content.id,
			content.amount,
			content.data,
		]
	);
	while (
		i.length > 0 &&
		i[i.length - 1] === null
	) i.pop();

	localStorage_setItem(
		`minicraft.world.${model.id}:meta`,
		JSON_stringify(/** @type {TYPE_WORLD_META} */ ({
			p: {
				h: player.health,
				i,
				m: player.gamemode,
				p: [
					player.position_x,
					player.position_y,
					player.position_z,
					player.angle_h,
					player.angle_v,
				],
			},
			s: [
				model.spawn_x,
				model.spawn_y,
				model.spawn_z,
			],
			t: model.time,
			v: WORLD_FORMAT,
		}))
	);

	let promise_save_last = null;
	for (const chunk of model.chunks) {
		if (chunk.flag_dirty) {
			promise_save_last = world_chunk_save(model, chunk);
		}
	}
	await promise_save_last;

	actions.world_prop(model.id, {
		mod_l,
	});
	model.flag_busy = false;
}

export const world_load = (model, player) => {
	const meta = /** @type {TYPE_WORLD_META} */ (JSON_parse(
		localStorage_getItem(`minicraft.world.${model.id}:meta`)
	));
	if (meta) {
		const {
			p,
			s,
			t,
			v,
		} = meta;

		if (v == null) return;

		p.i.forEach((stack, i) => {
			if (stack) {
				player.inventory[i].content = stack_create(
					/** @type {number} */ (stack[0]),
					/** @type {number} */ (stack[1]),
					/** @type {Object} */ (stack[2])
				);
			}
		});

		player.health = p.h;
		player.gamemode = p.m;

		player.position_x = p.p[0];
		player.position_y = p.p[1];
		player.position_z = p.p[2];
		player.angle_h = p.p[3];
		player.angle_v = p.p[4];

		model.spawn_x = s[0];
		model.spawn_y = s[1];
		model.spawn_z = s[2];

		if (t != null) world_time_set(model, t);
	}
}

export const world_time_set = (model, time) => {
	model.time = time % 24e3;
	model.time_f = ((time + 6e3) / 24e3) % 1;
}

const world_chunk_key = (x_abs, z_abs, y) => (
	`${x_abs}/${z_abs}` + (
		y > 0
		?	'/' + y
		:	''
	)
);

export const world_chunk_reset = async model => {
	model.flag_busy = true;
	const chunk = model.chunks[
		model.chunks_checklist[0].chunks_index
	];
	await chunk_delete(
		model.id,
		world_chunk_key(
			chunk.x_abs,
			chunk.z_abs,
			chunk.y
		)
	);
	// invalidate x_abs to force chunk reload
	chunk.x_abs++;
	model.chunks_checklist_index = 0;
	return world_chunk_load_all(model);
}

const world_chunk_save = async (model, chunk) => {
	++model.saves_pending;
	const {
		blocks_u32,
		size_l2,
	} = model;
	const {y} = chunk;
	const step_x = (
		(
			1 << (CHUNK_WIDTH_L2 + CHUNK_HEIGHT_L2 - 2) << size_l2
		) - (
			1 << (CHUNK_WIDTH_L2 + CHUNK_HEIGHT_L2 - 2)
		)
	);
	for (
		let x = 0,
			chunk_data_index = -1,
			blocks_u32_index = world_chunk_index_r2(
				size_l2,
				chunk.x, chunk.z, y
			);
		x < CHUNK_WIDTH;
		++x
	) {
		for (let z = 0; z < CHUNK_WIDTH; ++z) {
			chunk_data_tmp[++chunk_data_index] = blocks_u32[blocks_u32_index];
			chunk_data_tmp[++chunk_data_index] = blocks_u32[++blocks_u32_index];
			chunk_data_tmp[++chunk_data_index] = blocks_u32[++blocks_u32_index];
			chunk_data_tmp[++chunk_data_index] = blocks_u32[++blocks_u32_index];
			blocks_u32_index += ((CHUNK_HEIGHT - CHUNK_WIDTH) >> 2) + 1;
		}
		blocks_u32_index += step_x;
	}

	// console.log('chunk_save', chunk.x_abs, chunk.z_abs);
	chunk.flag_dirty = false;
	await chunk_set(
		model.id,
		world_chunk_key(
			chunk.x_abs,
			chunk.z_abs,
			y
		),
		compress(chunk_data_tmp_u8)
	);
	--model.saves_pending;
}

/**
	must be only called once at a time!
*/
export const world_chunk_load_all = async model => {
	model.flag_busy = true;
	await world_chunk_load(model, true);
	model.flag_busy = false;
}

/**
	either loads the next chunk or all chunks if `all` is true
	@param {boolean} all
*/
const world_chunk_load = async (model, all) => {
	const {
		blocks_u32,
		chunks,
		chunks_checklist,
		chunks_load_queue,
		offset_x,
		offset_z,
		size_l2,
	} = model;

	// queue load for next chunk in checklist if available
	let promise_load_last = null;
	let promise_save_last = null;
	const chunks_checklist_length = chunks_checklist.length;
	while (model.chunks_checklist_index < chunks_checklist_length) {
		const checklist_item = chunks_checklist[model.chunks_checklist_index++];
		const chunk = chunks[checklist_item.chunks_index];
		const {
			x, y, z,
		} = chunk;
		const x_abs = offset_x + checklist_item.offset_x + x;
		const z_abs = offset_z + checklist_item.offset_z + z;
		if (
			x_abs !== chunk.x_abs ||
			z_abs !== chunk.z_abs
		) {
			// console.log('chunk_load', x_abs, z_abs);
			const queue_item = {
				chunk,
				data: 'nope',
				x_abs,
				z_abs,
			};
			// if already loading for old abs position, cancel previous load
			if (chunk.flag_loading) {
				const existing_queue_item = chunks_load_queue.findIndex(i => i.chunk === chunk);
				// "I also like to live dangerously"
				// if (existing_queue_item >= 0) {
				chunks_load_queue.splice(existing_queue_item, 1);
				// }
			}
			chunk.flag_loading = true;

			chunks_load_queue.push(queue_item);
			if (chunk.flag_dirty) promise_save_last = world_chunk_save(model, chunk);
			promise_load_last = chunk_get(
				model.id,
				world_chunk_key(
					chunk.x_abs = x_abs,
					chunk.z_abs = z_abs,
					y
				)
			)
				.then(data => {
					queue_item.data = data;
				});

			// queue max 6 loading chunks
			if (
				!all &&
				chunks_load_queue.length > 5
			) break;
		}
	}
	if (all) await promise_load_last;

	// process next loaded chunk in queue if available
	let processed_counter = 0;
	while (
		chunks_load_queue.length > 0 &&
		chunks_load_queue[0].data !== 'nope'
	) {
		const {
			chunk,
			data,
			x_abs,
			z_abs,
		} = chunks_load_queue.shift();

		if (
			chunk.flag_loading &&
			chunk.x_abs === x_abs &&
			chunk.z_abs === z_abs
		) {
			chunk.flag_loading = false;
			const step_x = (
				(
					1 << (CHUNK_WIDTH_L2 + CHUNK_HEIGHT_L2 - 2) << size_l2
				) - (
					1 << (CHUNK_WIDTH_L2 + CHUNK_HEIGHT_L2 - 2)
				)
			);
			const {y} = chunk;
			let blocks_u32_index = world_chunk_index_r2(
				size_l2,
				chunk.x, chunk.z, y
			);

			if (
				decompress(data, chunk_data_tmp_u8)
			) {
				chunk.flag_used = true;
				// insert loaded chunk
				for (let x = 0, chunk_data_index = -1; x < CHUNK_WIDTH; ++x) {
					for (let z = 0; z < CHUNK_WIDTH; ++z) {
						blocks_u32[blocks_u32_index] = chunk_data_tmp[++chunk_data_index];
						blocks_u32[++blocks_u32_index] = chunk_data_tmp[++chunk_data_index];
						blocks_u32[++blocks_u32_index] = chunk_data_tmp[++chunk_data_index];
						blocks_u32[++blocks_u32_index] = chunk_data_tmp[++chunk_data_index];
						blocks_u32_index += ((CHUNK_HEIGHT - CHUNK_WIDTH) >> 2) + 1;
					}
					blocks_u32_index += step_x;
				}
			}
			else if (y === 0) {
				chunk.flag_used = true;
				// generate chunk
				for (let x = 0; x < CHUNK_WIDTH; ++x) {
					for (let z = 0; z < CHUNK_WIDTH; ++z) {
						blocks_u32[blocks_u32_index] = (
							BLOCK_TYPE_BEDROCK |
							BLOCK_TYPE_STONE << 8 |
							BLOCK_TYPE_STONE << 16 |
							BLOCK_TYPE_DIRT << 24
						);
						blocks_u32[++blocks_u32_index] = (
							BLOCK_TYPE_DIRT |
							BLOCK_TYPE_DIRT << 8 |
							BLOCK_TYPE_GRASS << 16
						);
						blocks_u32[++blocks_u32_index] = 0;
						blocks_u32[++blocks_u32_index] = 0;
						blocks_u32_index += ((CHUNK_HEIGHT - CHUNK_WIDTH) >> 2) + 1;
					}
					blocks_u32_index += step_x;
				}
			}
			else if (chunk.flag_used) {
				chunk.flag_used = false;
				// clear chunk
				for (let x = 0; x < CHUNK_WIDTH; ++x) {
					for (let z = 0; z < CHUNK_WIDTH; ++z) {
						blocks_u32[blocks_u32_index] = 0;
						blocks_u32[++blocks_u32_index] = 0;
						blocks_u32[++blocks_u32_index] = 0;
						blocks_u32[++blocks_u32_index] = 0;
						blocks_u32_index += ((CHUNK_HEIGHT - CHUNK_WIDTH) >> 2) + 1;
					}
					blocks_u32_index += step_x;
				}
			}
			else {
				// chunk was and stays empty, nothing to do
			}
		}

		if (
			!all &&
			++processed_counter > 5
		) break;
	}

	if (all) await promise_save_last;
}
