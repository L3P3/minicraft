import {
	hook_dom,
	node,
	node_dom,
} from '../etc/lui.js';

import {
	GAMEMODE_CREATIVE,
	ITEM_HANDLES,
	ITEM_LABELS,
} from '../etc/constants.js';
import {
	LANG,
} from '../etc/env.js';

const Bitmap = ({
	id,
}) => (
	hook_dom('#tile', {
		S: {
			backgroundPositionY: `-${(id - 1) * 2}rem`,
		},
	}),
	null
);

export default function Stack({
	amount,
	data,
	gamemode,
	id,
}) {
	hook_dom('div[className=stack]', {
		title: (
			LANG === 'en'
			?	ITEM_HANDLES[id] + (gamemode === GAMEMODE_CREATIVE ? ` (${id})` : '')
			:	ITEM_LABELS[id] + (gamemode === GAMEMODE_CREATIVE ? ` (${ITEM_HANDLES[id]}, ${id})` : '')
		),
	});

	return [
		node(Bitmap, {
			id,
		}),
		amount !== 1 &&
		node_dom('div[className=amount]', {
			innerText: amount,
		}),
	];
}
