export const VERSION = '0.1.2';

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
	0x000000, // VOID
	0x797979, // STONE
	0x7fb752, // GRASS
	0x785439, // DIRT
	0x828282, // COBBLE
	0x977b4d, // PLANKS
	0x454545, // BEDROCK
	0x604d2f, // LOG
	0x2f8222, // LEAVES
	0xb88c80, // BRICKS
	0xd7d7d7, // WOOL
];

export const SKY_COLOR = 0x84B1FF;
