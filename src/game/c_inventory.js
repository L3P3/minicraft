import {
	hook_assert,
	hook_dom,
	hook_memo,
	node,
	node_dom,
} from '../etc/lui.js';

import {
	ITEM_HANDLES,
	MENU_NONE,
	PLAYER_SLOTS,
} from '../etc/constants.js';
import {
	Math_ceil,
	Number_,
} from '../etc/helpers.js';

import Stack from './c_stack.js';

import {
	game_mouse_catch,
} from './m_game.js';
import {
	tiles_data,
} from './m_renderer.js';
import {
	slot_create,
	slot_transfer,
} from './m_slot.js';

export default function Inventory({
	game,
}) {
	const slot_hand = hook_memo(() => slot_create(null));

	hook_dom('div[className=menu inventory]', hook_memo(() => ({
		onclick: ({
			target,
		}) => {
			if (target.className === 'menu inventory') {
				if (slot_hand.content) {
					slot_hand.content = null;
				}
				else {
					game.menu = MENU_NONE;
					game.flag_paused = false;
					game_mouse_catch(game);
				}
			}
			else{
				const slot_element = target.closest('[data-slot]');
				if (slot_element) {
					const slot = game.player.inventory[
						Number_(slot_element.dataset.slot)
					];
					if (slot_hand.content) {
						slot_transfer(slot_hand, slot);
					}
					else if (slot.content) {
						slot_transfer(slot, slot_hand);
					}
				}
			}
		},
		oncontextmenu: ({
			target,
		}) => {
			if (target.className === 'menu inventory') {
				if (!slot_hand.content) {
					game.menu = MENU_NONE;
					game_mouse_catch(game);
				}
				else if (--slot_hand.content.amount <= 0) {
					slot_hand.content = null;
				}
			}
			else {
				const slot_element = target.closest('[data-slot]');
				if (slot_element) {
					const slot = game.player.inventory[
						Number_(slot_element.dataset.slot)
					];
					if (slot_hand.content) {
						slot_transfer(slot_hand, slot, 1);
					}
					else if (slot.content) {
						slot_transfer(slot, slot_hand, Math_ceil(slot.content.amount / 2));
					}
				}
			}
		},
	})));

	hook_assert(tiles_data);

	return [
		node_dom('div[className=window]', null,
			game.player.inventory.map(({content}, index) =>
				node_dom('div', {
					D: {
						slot: index,
					},
					F: {
						first: index < PLAYER_SLOTS,
					},
					title: content
					?	ITEM_HANDLES[content.id]
					:	'',
				}, [
					content &&
					node(Stack, {
						id: content.id,
						amount: content.amount,
						data: content.data,
					}),
				])
			)
		),
		slot_hand.content &&
		node_dom('div[className=hand]', {
			S: {
				left: `${game.cursor_x}px`,
				top: `${game.cursor_y}px`,
			},
		}, [
			node(Stack, {
				id: slot_hand.content.id,
				amount: slot_hand.content.amount,
				data: slot_hand.content.data,
			}),
		]),
	];
}
