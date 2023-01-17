import {
	hook_dom,
	hook_static,
	node,
	node_dom,
} from '../etc/lui.js';

import {
	PLAYER_SLOTS,
} from '../etc/constants.js';
import {
	Math_max,
	Math_min,
} from '../etc/helpers.js';

import Stack from './c_stack.js';

export default function Bar({
	player,
	time_now,
}) {
	hook_dom('div[className=bar]', {
		ontouchstart: hook_static(event => {
			player.slot_index = Number(
				event.target.closest('[data-slot]').dataset.slot
			);
			player.slot_time = event.timeStamp;
		}),
		S: {
			opacity: Math_max(
				.5,
				Math_min(
					1,
					1 - (time_now - player.slot_time - 5000) * .0005
				)
			),
		},
	});

	return (
		player.inventory
		//.slice(0, PLAYER_SLOTS)
		.map((stack, index) => (
			node_dom('div', {
				D: {
					slot: index,
				},
				F: {
					active: index === player.slot_index,
				},
			}, [
				stack !== null &&
				node(Stack, {
					...stack,
				}),
			])
		))
	);
}
