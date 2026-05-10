import {
	hook_dom,
	hook_memo,
	hook_static,
	node,
	node_dom,
} from '../etc/lui.js';

import {
	PLAYER_SLOTS,
} from '../etc/constants.js';
import {
	Math_floor,
	Math_max,
	Math_min,
} from '../etc/helpers.js';

import Stack from './c_stack.js';

export default function Bar({
	player,
	textures_id,
	time_now,
	viewport_width,
}) {
	hook_dom('table[className=bar]', {
		ontouchstart: hook_static(event => {
			player.slot_index = Number(
				event.target.closest('[data-slot]').dataset.slot
			);
			player.slot_time = event.timeStamp;
		}),
		S: {
			left: Math_max(0, viewport_width / 2 - PLAYER_SLOTS * 20) + 'px',
			opacity: Math_max(
				.5,
				Math_min(
					1,
					1 - (time_now - player.slot_time - 5000) * .0005
				)
			),
		},
	});

	const td_style = hook_memo(tile_size => ({
		height: tile_size = (tile_size - 8) + 'px',
		width: tile_size,
	}), [
		Math_min(viewport_width / PLAYER_SLOTS, 40),
	]);
	const {gamemode} = player;

	return [
		node_dom('tr', null,
			player.inventory
			.slice(0, PLAYER_SLOTS)
			.map(({content}, index) =>
				node_dom('td', {
					D: {
						slot: index,
					},
					F: {
						active: index === player.slot_index,
					},
					S: td_style,
				}, [
					content &&
					node(Stack, {
						amount: content.amount,
						data: content.data,
						gamemode,
						id: content.id,
						textures_id,
					}),
					!content &&
					node_dom('div[className=stack]'),
				])
			)
		),
	];
}
