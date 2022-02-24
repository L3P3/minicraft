import {
	BLOCK_COLORS,
	BLOCK_TYPE_AIR,
	BLOCK_TYPE_BEDROCK,
	BLOCK_TYPE_DIRT,
	BLOCK_TYPE_GRASS,
	BLOCK_TYPE_STONE,
	CHUNK_HEIGHT,
} from '../etc/constants.js';

export const world_create = width_l2 => {
	const model = {
		blocks: world_blocks_create(width_l2),
		spawn_x: 0.5,
		spawn_y: 8.5,
		spawn_z: 0.5,
		width_l2,
	};

	for (let i = 0; i < (1 << width_l2); i += 2) {
		world_block_set(model, i, 6, 0, BLOCK_TYPE_DIRT);
		world_block_set(model, 0, 6, i, BLOCK_TYPE_DIRT);
	}

	[
		'X   XXX XXX XXX',
		'X     X X X   X',
		'X   XXX XXX XXX',
		'X     X X     X',
		'XXX XXX X   XXX'
	].forEach((row, z, arr) => {
		z = arr.length - z;
		row.split('').forEach((char, x) => {
			char === 'X' &&
			world_block_set(model, x + 1, 6, z, BLOCK_TYPE_BEDROCK);
		});
	});

	for (let i = 0; i < BLOCK_COLORS.length; ++i)
		world_block_set(model, i, 7, 7, i);

	return model;
}

const world_block_index = (model, x, y, z) => (
	(
		(
			(y << model.width_l2) | x
		) << model.width_l2
	) | z
);

export const world_block_get = (model, x, y, z) => (
	y < 0 || y >= CHUNK_HEIGHT ? BLOCK_TYPE_AIR :
	model.blocks[
		world_block_index(model, x, y, z)
	]
);

export const world_block_set = (model, x, y, z, value) => {
	model.blocks[
		world_block_index(model, x, y, z)
	] = value;
}

const world_blocks_create = width_l2 => {
	const width = 1 << width_l2;
	const result = new Uint8Array(width * width * CHUNK_HEIGHT);

	const layers = [BLOCK_TYPE_BEDROCK, BLOCK_TYPE_STONE, BLOCK_TYPE_STONE, BLOCK_TYPE_DIRT, BLOCK_TYPE_DIRT, BLOCK_TYPE_DIRT, BLOCK_TYPE_GRASS];

	for (let i = -1, y = 0; y < layers.length; ++y) {
		const value = layers[y];
		for (let x = 0; x < width; ++x)
		for (let z = 0; z < width; ++z)
			result[++i] = value;
	}

	return result;
};
