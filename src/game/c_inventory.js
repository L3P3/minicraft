import {
	hook_dom,
	hook_memo,
	node,
	node_dom,
} from '../etc/lui.js';

import {
	GAMEMODE_CREATIVE,
	GAMEMODE_SURVIVAL,
	ITEM_HANDLES,
	PLAYER_SLOTS,
} from '../etc/constants.js';
import {
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

function Palette({
	slot_hand,
	textures_id,
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

	hook_dom('div[className=menu overlay inventory]', hook_memo(() => ({
		onclick: ({
			target,
		}) => {
			if (target.className === 'menu overlay inventory') {
				if (slot_hand.content) {
					slot_hand.content = null;
				}
				else {
					game_menu_close(game);
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
					game_menu_close(game);
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

	return [
		node_dom('div[className=window]', null, [
			node_dom(`h2[innerText=${locale_inventory}]`),
			gamemode === GAMEMODE_CREATIVE &&
			node(Palette, {
				slot_hand,
				textures_id,
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
							amount: content.amount,
							data: content.data,
							gamemode,
							id: content.id,
							textures_id,
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
				amount: slot_hand.content.amount,
				data: slot_hand.content.data,
				gamemode: GAMEMODE_SURVIVAL,
				id: slot_hand.content.id,
				textures_id,
			}),
		]),
	];
}
