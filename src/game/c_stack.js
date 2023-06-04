import {
	hook_dom,
	node,
	node_dom,
} from '../etc/lui.js';

import {
	BLOCK_TEXTURES_SRC,
	ITEM_HANDLES,
} from '../etc/constants.js';

const Bitmap = ({
	id,
}) => (
	hook_dom(`div[className=bitmap][style=background-image:url(${BLOCK_TEXTURES_SRC})]`, {
		S: {
			backgroundPositionY: `-${(id - 1) * 2}rem`,
		},
	}),
	null
);

export default function Stack({
	amount,
	data,
	id,
}) {
	hook_dom('div[className=stack]', {
		title: ITEM_HANDLES[id],
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
