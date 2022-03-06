import {
	BLOCK_COLORS_LENGTH,
	BLOCK_TYPE_AIR,
	CHUNK_HEIGHT,
	CHUNK_HEIGHT_L2,
	CHUNK_WIDTH,
	CHUNK_WIDTH_L2,
	FLATMAP_LAYERS,
	FLATMAP_LAYERS_LENGTH,
} from '../etc/constants.js';
import {
	diagonal,
	localStorage_,
	Math_abs,
	Math_min,
	Uint32Array_,
} from '../etc/helpers.js';

const chunk_template = new Uint32Array_(1 << (CHUNK_HEIGHT_L2 - 2));
for (let y = 0; y < FLATMAP_LAYERS_LENGTH; ++y) {
	chunk_template[y >> 2] |= FLATMAP_LAYERS[y] << (y << 3);
}

export const world_create = size_l2 => {
	const model = {
		blocks: null,
		chunks: null,
		focus_x: 0,
		focus_z: 0,
		id: 0,
		offset_x: 0,
		offset_z: 0,
		size_l2,
		spawn_x: 0.5,
		spawn_y: 8.5,
		spawn_z: 0.5,
	};

	world_data_init(model);

	return model;
}

const world_block_index = (model, x, y, z) => (
	(
		x << (model.size_l2 + CHUNK_WIDTH_L2) | z
	) << CHUNK_HEIGHT_L2 | y
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
	if (chunk.loaded) {
		model.blocks[
			world_block_index(model, x, y, z)
		] = value;
		//if (!chunk.dirty) console.log('dirtify chunk', chunk.x, chunk.z);
		chunk.dirty = true;
	}
}

const world_data_init = model => {
	model.blocks = new Uint8Array(1 << (
		CHUNK_WIDTH_L2 +
		CHUNK_WIDTH_L2 +
		CHUNK_HEIGHT_L2 +
		(model.size_l2 << 1)
	));

	const size = 1 << model.size_l2;
	const chunks = model.chunks = [];
	for (let x = 0; x < size; ++x)
	for (let z = 0; z < size; ++z)
		chunks.push({
			dirty: false,
			loaded: false,
			x,
			z,
		});
	
	// load first chunk synchronously
	world_chunk_load(model);

	// block palette
	for (let i = 0; i < BLOCK_COLORS_LENGTH; ++i)
		world_block_set(model, i, FLATMAP_LAYERS_LENGTH, 1, i);
}

export const world_chunk_load = model => {
	// find nearest missing chunk in amazing O(n)
	const {focus_x, focus_z} = model;
	const size = 1 << model.size_l2;
	let chunk, dist_min = 1e9, dist_check;
	for (const chunk_check of model.chunks) {
		if (
			!chunk_check.loaded &&
			(
				dist_check = diagonal(
					// is there a smarter way?
					Math_min(
						Math_abs(chunk_check.x - focus_x - size),
						Math_abs(chunk_check.x - focus_x),
						Math_abs(chunk_check.x - focus_x + size)
					),
					Math_min(
						Math_abs(chunk_check.z - focus_z - size),
						Math_abs(chunk_check.z - focus_z),
						Math_abs(chunk_check.z - focus_z + size)
					)
				)
			) < dist_min
		) {
			chunk = chunk_check;
			dist_min = dist_check;
		}
	}
	if (chunk) {
		chunk.loaded = true;
		const blocks_u32 = new Uint32Array_(model.blocks.buffer);
		const {x, z} = chunk;
		const offset_x = x << CHUNK_WIDTH_L2;
		const offset_z = z << CHUNK_WIDTH_L2;
		const chunk_stored = localStorage_.getItem(
			'minicraft.world.' + model.id + ':' + x + '/' + z
		);
		if (chunk_stored == null) {
			// generate chunk
			for (let x = 0; x < CHUNK_WIDTH; ++x) {
				let i = world_block_index(model, offset_x + x, 0, offset_z) >> 2;
				for (let z = 0; z < CHUNK_WIDTH; ++z) {
					blocks_u32.set(chunk_template, i);
					i += 1 << (CHUNK_HEIGHT_L2 - 2);
				}
			}
			// chunk border marking
			/* for (let i = 0; i < CHUNK_WIDTH; i += 2) {
				world_block_set(model, offset_x + i, FLATMAP_LAYERS_LENGTH - 1, offset_z, BLOCK_TYPE_DIRT);
				world_block_set(model, offset_x, FLATMAP_LAYERS_LENGTH - 1, offset_z + i, BLOCK_TYPE_DIRT);
			} */
		}
		else {
			// parse chunk
			let char_index = -1;
			for (let x = 0; x < CHUNK_WIDTH; ++x) {
				let i = (
					world_block_index(model, offset_x + x, 0, offset_z) >>> 2
				) - 1;
				for (let zy = 0; zy < (1 << (CHUNK_WIDTH_L2 + CHUNK_HEIGHT_L2 - 2)); ++zy) {
					blocks_u32[++i] = (
						chunk_stored.charCodeAt(++char_index) << 16 |
						chunk_stored.charCodeAt(++char_index)
					);
				}
			}
		}
	}
}
