import {
	BLOCK_COLORS,
	BLOCK_TYPE_AIR,
	BLOCK_TYPE_BEDROCK,
	BLOCK_TYPE_DIRT,
	BLOCK_TYPE_GRASS,
	CHUNK_HEIGHT,
	CHUNK_WIDTH,
	CHUNK_WIDTH_L2,
	CHUNK_WIDTH_L2_T2,
} from '../etc/constants.js';

export const world_create = () => {
	const model = {
		chunk: world_chunk_create(),
		spawn_x: CHUNK_WIDTH / 2,
		spawn_y: CHUNK_HEIGHT / 2,
		spawn_z: CHUNK_WIDTH / 2,
	};

	for (let i = 0; i < CHUNK_WIDTH; i += 2) {
		world_block_set(model, i, 4, 0, BLOCK_TYPE_DIRT);
		world_block_set(model, 0, 4, i, BLOCK_TYPE_DIRT);
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
			world_block_set(model, x + 1, 4, z, BLOCK_TYPE_BEDROCK);
		});
	});

	for (let i = 0; i < BLOCK_COLORS.length; ++i)
		world_block_set(model, i, 5, 7, i);

	return model;
}

const world_block_index = (x, y, z) => (
	(y << CHUNK_WIDTH_L2_T2) +
	(x << CHUNK_WIDTH_L2) +
	z
);

export const world_block_get = (model, x, y, z) => (
	y < 0 || y >= CHUNK_HEIGHT ? BLOCK_TYPE_AIR :
	model.chunk[
		world_block_index(x, y, z)
	]
);

export const world_block_set = (model, x, y, z, value) => {
	model.chunk[
		world_block_index(x, y, z)
	] = value;
}

const world_chunk_create = () => {
	const result = new Uint8Array(CHUNK_WIDTH * CHUNK_WIDTH * CHUNK_HEIGHT);

	const layers = [BLOCK_TYPE_BEDROCK, BLOCK_TYPE_DIRT, BLOCK_TYPE_DIRT, BLOCK_TYPE_DIRT, BLOCK_TYPE_GRASS];

	for (let i = -1, y = 0; y < layers.length; ++y) {
		const value = layers[y];
		for (let x = 0; x < CHUNK_WIDTH; ++x)
		for (let z = 0; z < CHUNK_WIDTH; ++z)
			result[++i] = value;
	}

	return result;
};
