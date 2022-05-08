import {
	BLOCK_COLORS_LENGTH,
	BLOCK_TYPE_AIR,
	BLOCK_TYPE_DIRT,
	CHUNK_HEIGHT,
	CHUNK_HEIGHT_L2,
	CHUNK_WIDTH,
	CHUNK_WIDTH_L2,
	FLATMAP_LAYERS,
	FLATMAP_LAYERS_LENGTH,
} from '../etc/constants.js';
import {
	localStorage_,
	Map_,
	Math_floor,
	Math_sqrt,
	number_square,
	Uint32Array_,
	Uint8Array_,
} from '../etc/helpers.js';
import {
	compress,
	decompress,
} from '../etc/lz.js';

// vertical strip of chunk for flatland generation
const chunk_template = new Uint32Array_(1 << (CHUNK_HEIGHT_L2 - 2));
for (let y = 0; y < FLATMAP_LAYERS_LENGTH; ++y) {
	chunk_template[y >> 2] |= FLATMAP_LAYERS[y] << (y << 3);
}

// used for loading/saving of chunks (prevent frequent reallocation)
const chunk_data_tmp = new Uint32Array_(1 << (CHUNK_WIDTH_L2 + CHUNK_WIDTH_L2 + CHUNK_HEIGHT_L2 - 2));
const chunk_data_tmp_u8 = new Uint8Array_(chunk_data_tmp.buffer);

const chunks_checklists = new Map_();

export const world_create = () => {
	const model = {
		// uint8[]
		blocks: null,
		blocks_u32: null,
		// all chunk metadata
		chunks: null,
		// {chunk metadata index, offset x, offset z}, sorted by loading order
		chunks_checklist: null,
		// next checklist item to check
		chunks_checklist_index: 0,
		// currently centered chunk (relative chunk position inside world tile)
		focus_x: 0,
		focus_z: 0,
		// world id for storage
		id: 0,
		// world tile offset in chunks
		offset_x: 0,
		offset_z: 0,
		// log2 of world tile width
		size_l2: 0,
		// block position of player spawn
		spawn_x: 0.5,
		spawn_y: FLATMAP_LAYERS_LENGTH + 1.5,
		spawn_z: 0.5,
	};

	return model;
}

const world_block_index = (model, x, y, z) => (
	(
		x << (model.size_l2 + CHUNK_WIDTH_L2) | z
	) << CHUNK_HEIGHT_L2 | y
);

const world_block_index_y0_r2 = (model, x, z) => (
	(
		x << (model.size_l2 + CHUNK_WIDTH_L2) | z
	) << (CHUNK_HEIGHT_L2 - 2)
);

export const world_block_get = (model, x, y, z) => (
	y < 0 || y >= CHUNK_HEIGHT ? BLOCK_TYPE_AIR :
	model.blocks[
		world_block_index(model, x, y, z)
	]
);

export const world_block_set = (model, x, y, z, value) => {
	const chunk = model.chunks[
		(x >> CHUNK_WIDTH_L2) << model.size_l2 |
		z >> CHUNK_WIDTH_L2
	];
	//if (chunk.x !== x >> CHUNK_WIDTH_L2 || chunk.z !== z >> CHUNK_WIDTH_L2)
	//	console.error(x >> CHUNK_WIDTH_L2, z >> CHUNK_WIDTH_L2, chunk.x, chunk.z);
	model.blocks[
		world_block_index(model, x, y, z)
	] = value;
	//if (!chunk.dirty) console.log('dirtify chunk', chunk.x, chunk.z);
	chunk.dirty = true;
}

export const world_data_init = (model, size_l2) => {
	if (model.chunks) world_save(model);

	model.blocks_u32 = new Uint32Array_((
		model.blocks = new Uint8Array_(1 << (
			CHUNK_WIDTH_L2 +
			CHUNK_WIDTH_L2 +
			CHUNK_HEIGHT_L2 +
			(size_l2 << 1)
		))
	).buffer);

	const size = 1 << (
		model.size_l2 = size_l2
	);
	const chunks = model.chunks = [];
	for (let x = 0; x < size; ++x)
	for (let z = 0; z < size; ++z)
		chunks.push({
			dirty: false,
			x,
			z,
			// +1 in order to make it always invalid at first so it will be initialized
			x_abs: model.offset_x + x + 1,
			z_abs: model.offset_z + z + 1,
		});

	world_chunk_load_setup(model);
	world_chunk_load(model);

	// block palette
	for (let i = 1; i < BLOCK_COLORS_LENGTH; ++i)
		world_block_set(
			model,
			i % 9,
			FLATMAP_LAYERS_LENGTH,
			Math_floor(i / 9),
			i
		);
}

export const world_chunk_load_setup = model => {
	const {focus_x, focus_z, size_l2} = model;
	const key = `${size_l2} ${focus_x} ${focus_z}`;
	let chunks_checklist = chunks_checklists.get(key);
	if (chunks_checklist == null) {
		const size = 1 << size_l2;
		chunks_checklists.set(key, chunks_checklist = (
			model.chunks
			.map(({x, z}, chunks_index) => {
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
					dist: Math_sqrt(
						dist_x + dist_z
					),
					chunks_index,
					offset_x,
					offset_z,
				};
			})
			.sort((a, b) => a.dist - b.dist)
		));
		// console.log('checklist', key, chunks_checklist);
	}
	model.chunks_checklist = chunks_checklist;
	model.chunks_checklist_index = 0;
}

export const world_save = model => {
	for (const chunk of model.chunks)
	if (chunk.dirty) {
		world_chunk_save(model, chunk);
	}
}

const world_chunk_save = (model, chunk) => {
	const {blocks_u32} = model;
	const blocks_offset_x = chunk.x << CHUNK_WIDTH_L2;
	const blocks_offset_z = chunk.z << CHUNK_WIDTH_L2;
	for (let x = 0, chunk_data_index = 0; x < CHUNK_WIDTH; ++x) {
		const blocks_u32_index = world_block_index_y0_r2(model, blocks_offset_x + x, blocks_offset_z);
		chunk_data_tmp.set(
			blocks_u32.subarray(
				blocks_u32_index,
				blocks_u32_index + (1 << (CHUNK_WIDTH_L2 + CHUNK_HEIGHT_L2 - 2))
			),
			chunk_data_index
		);
		chunk_data_index += (1 << (CHUNK_WIDTH_L2 + CHUNK_HEIGHT_L2 - 2));
	}

	// console.log('chunk_save', chunk.x_abs, chunk.z_abs);
	localStorage_.setItem(
		`minicraft.world.${model.id}:${chunk.x_abs}/${chunk.z_abs}`,
		compress(chunk_data_tmp_u8)
	);
	chunk.dirty = false;
}

export const world_chunk_load = model => {
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
		const {x, z} = chunk;
		const x_abs = offset_x + checklist_item.offset_x + x;
		const z_abs = offset_z + checklist_item.offset_z + z;
		if (
			x_abs !== chunk.x_abs ||
			z_abs !== chunk.z_abs
		) {
			if (chunk.dirty) world_chunk_save(model, chunk);
			// console.log('chunk_load', x_abs, z_abs);
			const chunk_stored = decompress(
				localStorage_.getItem(
					`minicraft.world.${model.id}:${
						chunk.x_abs = x_abs
					}/${
						chunk.z_abs = z_abs
					}`
				),
				chunk_data_tmp_u8
			);
			const {blocks_u32} = model;
			const blocks_offset_x = x << CHUNK_WIDTH_L2;
			const blocks_offset_z = z << CHUNK_WIDTH_L2;
			if (chunk_stored) {
				// insert loaded chunk
				for (let x = 0, chunk_stored_u32_index = 0; x < CHUNK_WIDTH; ++x) {
					blocks_u32.set(
						chunk_data_tmp.subarray(
							chunk_stored_u32_index,
							(
								chunk_stored_u32_index += (1 << (CHUNK_WIDTH_L2 + CHUNK_HEIGHT_L2 - 2))
							)
						),
						world_block_index_y0_r2(model, blocks_offset_x + x, blocks_offset_z)
					);
				}
			}
			else {
				// generate chunk
				for (let x = 0; x < CHUNK_WIDTH; ++x) {
					let i = world_block_index_y0_r2(model, blocks_offset_x + x, blocks_offset_z);
					for (let z = 0; z < CHUNK_WIDTH; ++z) {
						blocks_u32.set(chunk_template, i);
						i += 1 << (CHUNK_HEIGHT_L2 - 2);
					}
				}
				// chunk border marking
				/*
					for (let i = 0; i < CHUNK_WIDTH; i += 2) {
						world_block_set(
							model,
							blocks_offset_x + i,
							FLATMAP_LAYERS_LENGTH - 1,
							blocks_offset_z,
							BLOCK_TYPE_DIRT
						);
						world_block_set(
							model,
							blocks_offset_x,
							FLATMAP_LAYERS_LENGTH - 1,
							blocks_offset_z + i,
							BLOCK_TYPE_DIRT
						);
					}
					chunk.dirty = false;
				*/
				// checkerboard
				/*
					if ((x_abs + z_abs) % 2 > 0)
					for (let x = 0; x < CHUNK_WIDTH; ++x)
					for (let z = 0; z < CHUNK_WIDTH; ++z) {
						world_block_set(
							model,
							blocks_offset_x + x,
							FLATMAP_LAYERS_LENGTH - 1,
							blocks_offset_z + z,
							BLOCK_TYPE_DIRT
						);
					}
					chunk.dirty = false;
				*/
			}
			return;
		}
	}
}
