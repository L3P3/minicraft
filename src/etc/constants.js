export const VERSION = '0.1.1';

export const CHUNK_WIDTH_L2 = 4;
export const CHUNK_WIDTH_L2_T2 = CHUNK_WIDTH_L2 << 1;
export const CHUNK_WIDTH = 1 << CHUNK_WIDTH_L2;
export const CHUNK_HEIGHT = 64;
export const CHUNK_WIDTH_M1 = CHUNK_WIDTH - 1;

export const BLOCK_AIR = 0;
export const BLOCK_STONE = 1;
export const BLOCK_GRASS = 2;
export const BLOCK_DIRT = 3;
export const BLOCK_COBBLE = 4;
export const BLOCK_PLANKS = 5;
export const BLOCK_BEDROCK = 6;
export const BLOCK_LOG = 7;
export const BLOCK_LEAVES = 8;
export const BLOCK_BRICKS = 9;
export const BLOCK_WOOL = 10;

export const BLOCK_COLORS = [
	[0, 0, 0], // AIR
	[121, 121, 121], // STONE
	[127, 183, 82], // GRASS
	[120, 84, 57], // DIRT
	[130, 130, 130], // COBBLE
	[151, 123, 77], // PLANKS
	[69, 69, 69], // BEDROCK
	[96, 77, 47], // LOG
	[47, 130, 34], // LEAVES
	[184, 140, 128], // BRICKS
	[215, 215, 215], // WOOL
];

export const SKY_COLOR = [0x84, 0xB1, 0xFF];
