import {
	VERSION,
} from './env.js';
import {
	locale_item_labels,
} from './locale.js';

export const APP_VIEW_GAME = 0;
export const APP_VIEW_SETTINGS = 1;
export const APP_VIEW_WORLDS = 2;

export const CHUNK_WIDTH_L2 = 4;
export const CHUNK_WIDTH = 1 << CHUNK_WIDTH_L2;
export const CHUNK_HEIGHT_FACTOR_L2 = 2;
export const CHUNK_HEIGHT_FACTOR = 1 << CHUNK_HEIGHT_FACTOR_L2;
export const CHUNK_HEIGHT_L2 = CHUNK_WIDTH_L2 + CHUNK_HEIGHT_FACTOR_L2;
export const CHUNK_HEIGHT = 1 << CHUNK_HEIGHT_L2;
export const COORDINATE_OFFSET = 1 << 16;

export const WORLD_FORMAT = 1;

export const BLOCK_TYPE_AIR = 0;
export const BLOCK_TYPE_STONE = 1;
export const BLOCK_TYPE_GRASS = 2;
export const BLOCK_TYPE_DIRT = 3;
export const BLOCK_TYPE_COBBLE = 4;
export const BLOCK_TYPE_PLANKS = 5;
export const BLOCK_TYPE_BEDROCK = 6;
export const BLOCK_TYPE_LOG = 7;
export const BLOCK_TYPE_LEAVES = 8;
export const BLOCK_TYPE_BRICKS = 9;
export const BLOCK_TYPE_WOOL = 10;
export const BLOCK_TYPE_SAND = 11;
export const BLOCK_TYPE_GRAVEL = 12;
export const BLOCK_TYPE_GLASS = 13;
export const BLOCK_TYPE_BOOKSHELF = 14;
export const BLOCK_TYPE_OBSIDIAN = 15;
export const BLOCK_TYPE_STONE_BRICKS = 16;
export const BLOCK_TYPE_SANDSTONE = 17;
export const BLOCK_TYPE_LAPIS_BLOCK = 18;
export const BLOCK_TYPE_IRON_BLOCK = 19;
export const BLOCK_TYPE_GOLD_BLOCK = 20;
export const BLOCK_TYPE_DIAMOND_BLOCK = 21;
export const BLOCK_TYPE_EMERALD_BLOCK = 22;
export const BLOCK_TYPE_REDSTONE_BLOCK = 23;
export const BLOCK_TYPE_QUARTZ_BLOCK = 24;
export const BLOCK_TYPE_MAX = 24;

export const ITEM_HANDLES = 'air,stone,grass,dirt,cobble,planks,bedrock,log,leaves,bricks,wool,sand,gravel,glass,bookshelf,obsidian,stone_bricks,sandstone,lapis_block,iron_block,gold_block,diamond_block,emerald_block,redstone_block,quartz_block'.split(',');
export const ITEM_LABELS = locale_item_labels.split(',');

// B G R
export const BLOCK_COLORS = [
	0x000000, // VOID
	0x818181, // STONE
	0x41b172, // GRASS
	0x425d81, // DIRT
	0x7b7b7b, // COBBLE
	0x5183a2, // PLANKS
	0x6b6b6b, // BEDROCK
	0x36586f, // LOG
	0x3fac6e, // LEAVES
	0x616b95, // BRICKS
	0xecebe8, // WOOL
	0xa2d4dc, // SAND
	0x7b7c7e, // GRAVEL
	0xfaf6e0, // GLASS
	0x3f5978, // BOOKSHELF
	0x1e1214, // OBSIDIAN
	0x7b7b7b, // STONE_BRICKS
	0x93ccd3, // SANDSTONE
	0x8b4327, // LAPIS_BLOCK
	0xe7e7e7, // IRON_BLOCK
	0x54f3fd, // GOLD_BLOCK
	0xdde17e, // DIAMOND_BLOCK
	0x78db55, // EMERALD_BLOCK
	0x0a1dac, // REDSTONE_BLOCK
	0xe3eaed, // QUARTZ_BLOCK
];

export const BLOCK_TYPE_FACE_LABELS = 'WEBTSNI';
export const BLOCK_TYPE_FACE_W = 0;
export const BLOCK_TYPE_FACE_E = 1;
export const BLOCK_TYPE_FACE_B = 2;
export const BLOCK_TYPE_FACE_T = 3;
export const BLOCK_TYPE_FACE_S = 4;
export const BLOCK_TYPE_FACE_N = 5;
export const BLOCK_TYPE_FACE_I = 6;

export const SKY_COLOR = 0xffb184;

export const GAMEMODE_SURVIVAL = 0;
export const GAMEMODE_CREATIVE = 1;
export const GAMEMODE_SPECTATOR = 2;

export const PLAYER_FOCUS_DISTANCE_CREATIVE = 6;
export const PLAYER_FOCUS_DISTANCE_NORMAL = 4;
export const PLAYER_SLOTS = 9;
export const PLAYER_INVENTORY = PLAYER_SLOTS * 4;

export const STACK_SIZE = 64;

export const FLATMAP_LAYERS_LENGTH = 7;

export const KEY_MOUSE_LEFT = -1;
export const KEY_MOUSE_MIDDLE = -2;
export const KEY_MOUSE_RIGHT = -3;
export const KEY_MOUSE_UP = -4;
export const KEY_MOUSE_DOWN = -5;
export const KEY_MOVE_FRONT = -10;
export const KEY_MOVE_BACK = -11;
export const KEY_MOVE_LEFT = -12;
export const KEY_MOVE_RIGHT = -13;
export const KEY_MOVE_UP = -14;
export const KEY_MOVE_DOWN = -15;
export const KEY_ROTATE_UP = -16;
export const KEY_ROTATE_DOWN = -17;
export const KEY_ROTATE_LEFT = -18;
export const KEY_ROTATE_RIGHT = -19;

export const MENU_NONE = 0;
export const MENU_SETTINGS = 1;
export const MENU_TERMINAL = 2;
export const MENU_INVENTORY = 3;

export const MOUSE_MODE_NORMAL = 0;
export const MOUSE_MODE_SELECT = 1;

export const API_CHAT = (VERSION === 'dev' ? '//l3p3.de' : '') + '/api/chat';

export const WINDOW_MODE_FULL = 0;
export const WINDOW_MODE_FLOATING = 1;
export const WINDOW_MODE_HIDDEN = 2;

export const WINDOW_TYPE_EMPTY = 0;
export const WINDOW_TYPE_GAME = 1;
