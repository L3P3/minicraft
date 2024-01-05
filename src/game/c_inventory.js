import {
	hook_dom,
	hook_memo,
	node,
	node_dom,
} from '../etc/lui.js';

import {
	GAMEMODE_CREATIVE,
	ITEM_HANDLES,
	MENU_NONE,
	PLAYER_SLOTS,
} from '../etc/constants.js';
import {
	Math_ceil,
	Number_,
} from '../etc/helpers.js';

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
import {
	stack_create,
} from './m_stack.js';

import Stack from './c_stack.js';

function Palette({
	slot_hand,
}) {
	hook_dom('div[className=grid]', {
		onclick: ({
			target,
		}) => {
			const slot_element = target.closest('[data-id]');
			if (slot_element) {
				slot_transfer(
					slot_create(
						stack_create(
							Number_(slot_element.dataset.id)
						)
					),
					slot_hand
				);
			}
		},
	});

	return (
		ITEM_HANDLES.map((_, id) => (
			id > 0 &&
			node_dom('div', {
				D: {
					id,
				},
			}, [
				node(Stack, {
					id,
					amount: 1,
					data: null,
				}),
			])
		))
	);
}

export default function Inventory({
	game,
}) {
	const slot_hand = hook_memo(() => slot_create(null));

	hook_dom('div[className=menu overlay inventory]', hook_memo(() => ({
		onclick: ({
			target,
		}) => {
			if (target.className === 'menu overlay inventory') {
				if (slot_hand.content) {
					slot_hand.content = null;
				}
				else {
					game.menu = MENU_NONE;
					game.world.flag_paused = false;
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
			if (target.className === 'menu overlay inventory') {
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

	return tiles_data && [
		node_dom('div[className=window]', null, [
			node_dom('div[innerText=Inventar]'),
			game.player.gamemode === GAMEMODE_CREATIVE &&
			node(Palette, {
				slot_hand,
			}),
			node_dom('div[className=grid]', null,
				game.player.inventory.map(({content}, index) =>
					node_dom('div', {
						D: {
							slot: index,
						},
						F: {
							first: index < PLAYER_SLOTS,
						},
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
		]),
		slot_hand.content &&
		node_dom('div[className=hand]', {
			S: {
				transform: `translate(${game.cursor_x}px, ${game.cursor_y}px)`,
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
