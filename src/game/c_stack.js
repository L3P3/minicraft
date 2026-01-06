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
	API_DATA,
	LANG,
} from '../etc/env.js';

const Bitmap = ({
	id,
	textures_id,
}) => (
	hook_dom('div[className=bitmap]', {
		S: {
			backgroundImage: `url(${API_DATA}textures/${textures_id}.png)`,
			backgroundPositionY: 100 - id * 100 + '%',
		},
	}),
	null
);

export default function Stack({
	amount,
	data,
	gamemode,
	id,
	textures_id,
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
			textures_id,
		}),
		amount !== 1 &&
		node_dom('div[className=amount]', {
			innerText: amount,
		}),
	];
}
