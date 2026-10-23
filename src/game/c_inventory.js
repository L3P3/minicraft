import {
	hook_dom,
	hook_memo,
	node,
	node_dom,
} from '../etc/lui.js';

import {
	BLOCK_TYPE_MAX,
	GAMEMODE_CREATIVE,
	GAMEMODE_SURVIVAL,
	ITEM_PALETTE_ROWS,
	PLAYER_SLOTS,
} from '../etc/constants.js';
import {
	Array_,
	Math_ceil,
	Math_min,
	Number_,
} from '../etc/helpers.js';
import {
	locale_inventory,
} from '../etc/locale.js';

import {
	game_menu_close,
} from './m_game.js';
import {
	slot_create,
	slot_transfer,
} from './m_slot.js';
import {
	stack_create,
} from './m_stack.js';

import Stack from './c_stack.js';

const template_slots = Array_(PLAYER_SLOTS).fill(null);

/**
	maps rows/columns to inventory index
*/
const template_inventory = Array_(4).fill(null).map((_, row) =>
	template_slots.map((_, column) =>
		row * PLAYER_SLOTS + column
	)
);
// move first row to the end
template_inventory.push(template_inventory.shift());

const template_palette_rows = Array_(ITEM_PALETTE_ROWS).fill(null);

function Palette({
	slot_hand,
	textures_id,
	td_style,
}) {
	hook_dom('table', {
		onclick: event => {
			if (event.target.className === 'bitmap') {
				slot_transfer(
					slot_create(
						stack_create(
							Number_(event.target.parentElement.parentElement.dataset.id)
						)
					),
					slot_hand
				);
			}
			event.stopPropagation();
		},
	});

	let id = 0;
	return template_palette_rows.map(() =>
		node_dom('tr', null, template_slots.map(() =>
			++id < BLOCK_TYPE_MAX + 1 &&
			node_dom('td', {
				D: {
					id,
				},
				S: td_style,
			}, [
				node(Stack, {
					amount: 1,
					data: null,
					gamemode: GAMEMODE_CREATIVE,
					id,
					textures_id,
				}),
			])
		))
	);
}

const td_style_big = {
	fontSize: '',
	height: '32px',
	width: '32px',
};
const td_style_small = {
	fontSize: '75%',
	height: '16px',
	width: '16px',
};

export default function Inventory({
	game,
	textures_id,
	viewport_height,
	viewport_width,
}) {
	const slot_hand = hook_memo(() => slot_create(null));

	const {gamemode} = game.player;

	const menu_element = hook_dom('div[className=menu][style=overflow:hidden]', hook_memo(() => ({
		onclick: ({
			target,
		}) => {
			if (target === menu_element) {
				if (slot_hand.content) {
					slot_hand.content = null;
				}
				else {
					game_menu_close(game);
				}
			}
			else if (
				target.tagName === 'TD' ||
				target.parentElement.className === 'stack' && (
					target = target.parentElement.parentElement
				)
			) {
				const slot = game.player.inventory[
					Number_(target.dataset.slot)
				];
				if (slot_hand.content) {
					slot_transfer(slot_hand, slot);
				}
				else if (slot.content) {
					slot_transfer(slot, slot_hand);
				}
			}
		},
		oncontextmenu: ({
			target,
		}) => {
			if (target === menu_element) {
				if (!slot_hand.content) {
					game_menu_close(game);
				}
				else if (--slot_hand.content.amount <= 0) {
					slot_hand.content = null;
				}
			}
			else if (
				target.tagName === 'TD' ||
				target.parentElement.className === 'stack' && (
					target = target.parentElement.parentElement
				)
			) {
				const slot = game.player.inventory[
					Number_(target.dataset.slot)
				];
				if (slot_hand.content) {
					slot_transfer(slot_hand, slot, 1);
				}
				else if (slot.content) {
					slot_transfer(slot, slot_hand, Math_ceil(slot.content.amount / 2));
				}
			}
		},
	})));

	const [window_style, td_style] = hook_memo(() => {
		const small = Math_min(viewport_width, viewport_height) < 400;

		return [
			{
				// values have been measured, not perfect, I know
				left: `${viewport_width / 2 - (small ? 192 / 2 : 336 / 2)}px`,
				top: `${viewport_height / 2 - (small ? 182 / 2 : 294 / 2)}px`,
			},
			(
				small
				?	td_style_small
				:	td_style_big
			),
		];
	}, [
		viewport_height,
		viewport_width,
	]);

	return [
		node_dom('div[className=window]', {
			S: window_style,
		}, [
			node_dom(`h2[innerText=${locale_inventory}]`),
			gamemode === GAMEMODE_CREATIVE &&
			node(Palette, {
				slot_hand,
				textures_id,
				td_style,
			}),
			node_dom('table', null, template_inventory.map((columns, row_num) =>
				node_dom((
					row_num < 3 ? 'tr' : 'tr[className=last]'
				), null, columns.map(slot =>
					node_dom('td', {
						D: hook_memo(() => ({
							slot,
						})),
						S: td_style,
					}, [
						(slot = game.player.inventory[slot].content) &&
						node(Stack, {
							amount: slot.amount,
							data: slot.data,
							gamemode,
							id: slot.id,
							textures_id,
						}),
					])
				))
			)),
		]),
		slot_hand.content &&
		node_dom('div[className=hand]', {
			S: {
				left: game.cursor_x + 'px',
				top: game.cursor_y + 'px',
			},
		}, [
			node(Stack, {
				amount: slot_hand.content.amount,
				data: slot_hand.content.data,
				gamemode: GAMEMODE_SURVIVAL,
				id: slot_hand.content.id,
				textures_id,
			}),
		]),
	];
}
