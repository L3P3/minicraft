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

/**
	maps rows/columns to inventory index
*/
const template = Array_(4).fill(null).map((_, row) =>
	Array_(PLAYER_SLOTS).fill(null).map((_, column) =>
		row * PLAYER_SLOTS + column
	)
);
// move first row to the end
template.push(template.shift());

function Palette({
	slot_hand,
	textures_id,
}) {
	hook_dom('table', {
		onclick: ({
			target,
		}) => {
			if (target.className === 'bitmap') {
				slot_transfer(
					slot_create(
						stack_create(
							Number_(target.parentElement.parentElement.dataset.id)
						)
					),
					slot_hand
				);
			}
			return false;
		},
	});

	let id = 0;
	return Array_(ITEM_PALETTE_ROWS).fill(null).map(() =>
		node_dom('tr', null, Array_(PLAYER_SLOTS).fill(null).map(() =>
			++id < BLOCK_TYPE_MAX + 1 &&
			node_dom('td', {
				D: {
					id,
				},
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

export default function Inventory({
	game,
	textures_id,
}) {
	const slot_hand = hook_memo(() => slot_create(null));

	const {gamemode} = game.player;

	hook_dom('div[className=menu inventory]', hook_memo(() => ({
		onclick: ({
			target,
		}) => {
			if (target.className === 'menu inventory') {
				if (slot_hand.content) {
					slot_hand.content = null;
				}
				else {
					game_menu_close(game);
				}
			}
			else if (
				target.parentElement.className === 'stack' &&
					target.parentElement.parentElement.dataset.slot ||
				target.tagName === 'TD'
			) {
				const slot = game.player.inventory[
					Number_(
						(
							target.tagName === 'TD'
							?	target
							:	target.parentElement.parentElement
						).dataset.slot
					)
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
			if (target.className === 'menu inventory') {
				if (!slot_hand.content) {
					game_menu_close(game);
				}
				else if (--slot_hand.content.amount <= 0) {
					slot_hand.content = null;
				}
			}
			else if (
				target.parentElement.className === 'stack' &&
					target.parentElement.parentElement.dataset.slot ||
				target.tagName === 'TD'
			) {
				const slot = game.player.inventory[
					Number_(
						(
							target.tagName === 'TD'
							?	target
							:	target.parentElement.parentElement
						).dataset.slot
					)
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

	return [
		node_dom('div[className=window]', null, [
			node_dom(`h2[innerText=${locale_inventory}]`),
			gamemode === GAMEMODE_CREATIVE &&
			node(Palette, {
				slot_hand,
				textures_id,
			}),
			node_dom('table', null, template.map((columns, row_num) =>
				node_dom((
					row_num < 3 ? 'tr' : 'tr[className=last]'
				), null, columns.map(slot =>
					node_dom('td', {
						D: hook_memo(() => ({
							slot,
						})),
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
