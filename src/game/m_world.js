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
	JSON_parse,
	JSON_stringify,
	localStorage_getItem,
	localStorage_setItem,
	Map_,
	Math_floor,
	Math_max,
	Math_min,
	number_square,
	Promise_,
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
const chunk_data_tmp = new Uint32Array_(1 << (CHUNK_WIDTH_L2 * 3 - 2));
const chunk_data_tmp_u8 = new Uint8Array_(chunk_data_tmp.buffer);

const chunks_checklists = new Map_();

export const world_create = id => {
	const world = {
		// blocks of superchunk
		// uint8[]
		blocks: null,
		blocks_u32: null,
		// currently saving a chunk
		busy: false,
		// all chunk metadata currently in superchunk
		chunks: null,
		// {chunk metadata index, offset x, offset z}, sorted by loading order
		chunks_checklist: null,
		// next checklist item to check
		chunks_checklist_index: 0,
		// nothing must change
		flag_frozen: !app_state.worlds_merged.find(i => i.id === id).writable,
		// currently centered chunk (relative chunk position inside superchunk)
		focus_x: 0,
		focus_y: 0,
		focus_z: 0,
		// world id for storage
		id,
		// superchunk offset in chunks
		offset_x: 0,
		offset_z: 0,
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

export const world_block_set = (model, x, y, z, value) => {
	const {size_l2} = model;
	model.blocks[
		world_block_index(size_l2, x, z, y)
	] = value;
	world_chunk_get(
		model.chunks, size_l2,
		x, y, z
	).dirty = true;
}

/**
	tries to set a block
	@return {boolean} success
*/
export const world_block_set_try = (model, x, y, z, value) => {
	const {size_l2} = model;
	const index = world_block_index(size_l2, x, z, y);
	if (model.blocks[index] > BLOCK_TYPE_AIR) return false;
	model.blocks[index] = value;
	world_chunk_get(
		model.chunks, size_l2,
		x, y, z
	).dirty = true;
	return true;
}

export const world_data_init = (model, player, size_l2) => {
	if (model.chunks) world_save(model, player);

	const size = 1 << (
		model.size_l2 = size_l2
	);
	const chunks = model.chunks = [];
	for (let x = 0; x < size; ++x)
	for (let z = 0; z < size; ++z)
	for (let y = 0; y < CHUNK_HEIGHT_FACTOR; ++y)
		chunks.push({
			dirty: false,
			loaded: false,
			x,
			y,
			z,
			x_abs: 0,
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
		const world_size = 1 << model.size_l2;
		model.focus_y = focus_y;
		model.offset_x = chunk_x_abs - (
			model.focus_x = (
				COORDINATE_OFFSET + chunk_x_abs
			) % world_size
		);
		model.offset_z = chunk_z_abs - (
			model.focus_z = (
				COORDINATE_OFFSET + chunk_z_abs
			) % world_size
		);
		world_chunk_load_setup(model);
	}
	if (!model.busy) world_chunk_load(model, false);
}

const world_chunk_load_setup = model => {
	const {
		focus_x,
		focus_y,
		focus_z,
		size_l2,
	} = model;
	const key = `${size_l2} ${focus_x} ${focus_z} ${focus_y}`;
	let chunks_checklist = chunks_checklists.get(key);
	if (chunks_checklist == null) {
		const size = 1 << size_l2;
		const size_h_p2 = number_square(size * .5);
		chunks_checklists.set(key, chunks_checklist = (
			model.chunks
			.map(({x, y, z}, chunks_index) => {
				// https://jsben.ch/2kBkT
				let dist_x = number_square(x - focus_x);
				let dist_z = number_square(z - focus_z);
				let tmp = number_square(x - focus_x - size);
				let offset_x = 0;
				let offset_z = 0;

				if (tmp < dist_x) {
					dist_x = tmp;
					offset_x = -size;
				}
				if (
					(
						tmp = number_square(x - focus_x + size)
					) < dist_x
				) {
					dist_x = tmp;
					offset_x = size;
				}
				if (
					(
						tmp = number_square(z - focus_z - size)
					) < dist_z
				) {
					dist_z = tmp;
					offset_z = -size;
				}
				if (
					(
						tmp = number_square(z - focus_z + size)
					) < dist_z
				) {
					dist_z = tmp;
					offset_z = size;
				}

				return {
					dist: dist_x + dist_z + number_square(y - focus_y),
					chunks_index,
					offset_x,
					offset_z,
				};
			})
			.filter(({dist}) => dist <= size_h_p2)
			.sort((a, b) => a.dist - b.dist)
		));
		// console.log('checklist', key, chunks_checklist);
	}
	model.chunks_checklist = chunks_checklist;
	model.chunks_checklist_index = 0;
}

export const world_save = (model, player) => {
	if (model.flag_frozen) return;

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

	return Promise_.all(
		model.chunks
		.filter(chunk => chunk.dirty)
		.map(chunk => world_chunk_save(model, chunk))
	);
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
					stack[0],
					stack[1],
					stack[2]
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

		if (t == null) return;

		world_time_set(model, t);
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
	const chunk = model.chunks[
		model.chunks_checklist[
			model.chunks_checklist_index = 0
		].chunks_index
	];
	await chunk_delete(
		model.id,
		world_chunk_key(
			chunk.x_abs,
			chunk.z_abs,
			chunk.y
		)
	);
	chunk.dirty = false;
	// force reload
	++chunk.x_abs;
	return world_chunk_load(model, false);
}

const world_chunk_save = (model, chunk) => {
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
	chunk.dirty = false;
	return chunk_set(
		model.id,
		world_chunk_key(
			chunk.x_abs,
			chunk.z_abs,
			y
		),
		compress(chunk_data_tmp_u8)
	);
}

export const world_chunk_load = async (model, all) => {
	const {
		chunks,
		chunks_checklist,
		offset_x,
		offset_z,
	} = model;
	const chunks_checklist_length = chunks_checklist.length;
	while (model.chunks_checklist_index < chunks_checklist_length) {
		const checklist_item = chunks_checklist[model.chunks_checklist_index++];
		const chunk = chunks[checklist_item.chunks_index];
		const {
			loaded,
			x, y, z,
		} = chunk;
		const x_abs = offset_x + checklist_item.offset_x + x;
		const z_abs = offset_z + checklist_item.offset_z + z;
		if (
			!loaded ||
			x_abs !== chunk.x_abs ||
			z_abs !== chunk.z_abs
		) {
			// console.log('chunk_load', x_abs, z_abs);
			chunk.loaded = model.busy = true;
			const save_promise = chunk.dirty && world_chunk_save(model, chunk);
			const chunk_stored = decompress(
				await chunk_get(
					model.id,
					world_chunk_key(
						chunk.x_abs = x_abs,
						chunk.z_abs = z_abs,
						y
					)
				),
				chunk_data_tmp_u8
			);
			await save_promise;
			model.busy = false;
			if (
				loaded ||
				y === 0 ||
				chunk_stored
			) {
				const {
					blocks_u32,
					size_l2,
				} = model;
				const step_x = (
					(
						1 << (CHUNK_WIDTH_L2 + CHUNK_HEIGHT_L2 - 2) << size_l2
					) - (
						1 << (CHUNK_WIDTH_L2 + CHUNK_HEIGHT_L2 - 2)
					)
				);
				let blocks_u32_index = world_chunk_index_r2(
					size_l2,
					x, z, y
				);

				if (chunk_stored)
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
				else
				// generate chunk
				for (let x = 0; x < CHUNK_WIDTH; ++x) {
					for (let z = 0; z < CHUNK_WIDTH; ++z) {
						blocks_u32[blocks_u32_index] = (
							y > 0
							?	0
							:	BLOCK_TYPE_BEDROCK |
								BLOCK_TYPE_STONE << 8 |
								BLOCK_TYPE_STONE << 16 |
								BLOCK_TYPE_DIRT << 24
						);
						blocks_u32[++blocks_u32_index] = (
							y > 0
							?	0
							:	BLOCK_TYPE_DIRT |
								BLOCK_TYPE_DIRT << 8 |
								BLOCK_TYPE_GRASS << 16
						);
						if (loaded) {
							blocks_u32[++blocks_u32_index] = 0;
							blocks_u32[++blocks_u32_index] = 0;
							blocks_u32_index += ((CHUNK_HEIGHT - CHUNK_WIDTH) >> 2) + 1;
						}
						else {
							blocks_u32_index += ((CHUNK_HEIGHT - CHUNK_WIDTH) >> 2) + 3;
						}
					}
					blocks_u32_index += step_x;
				}
				if (!all) return;
			}
			// if no work neccessary, continue with next chunk
		}
	}
}

export const world_tick = (model, player) => {
	world_time_set(model, model.time + 1);

	world_offset_update(model, player, false);
}
