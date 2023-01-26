import {
	hook_dom,
	node,
	node_dom,
} from '../etc/lui.js';

import {
	ITEM_HANDLES,
	PLAYER_SLOTS,
} from '../etc/constants.js';

import Stack from './c_stack.js';

import {
	tiles_data,
} from './m_renderer.js';

export default function Inventory({
	game,
}) {
	hook_dom('div[className=menu inventory]');

	return [
		tiles_data &&
		node_dom('div', null,
			[
				...game.player.inventory.slice(PLAYER_SLOTS),
				...game.player.inventory.slice(0, PLAYER_SLOTS),
			].map(stack =>
				node_dom('div', {
					title: stack !== null
					?	ITEM_HANDLES[stack.id]
					:	'',
				}, [
					stack !== null &&
					node(Stack, {
						id: stack.id,
						amount: stack.amount,
						data: stack.data,
					}),
				])
			)
		),
	];
}
