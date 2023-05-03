import {
	hook_dom,
	node,
	node_dom,
} from '../etc/lui.js';

import {
	ITEM_HANDLES,
} from '../etc/constants.js';
import {
	TILES_RESOLUTION,
	TILES_RESOLUTION_LOG2,
} from '../etc/textures.js';

import {
	tiles_data,
} from './m_renderer.js';

const rows_template = new Array(TILES_RESOLUTION).fill(0);

const Bitmap = ({
	id,
}) => (
	hook_dom('div[className=bitmap]'),
	id = (id - 1) << (TILES_RESOLUTION_LOG2 * 2),
	rows_template.map((_, row) => (
		row = id | (15 - row) << TILES_RESOLUTION_LOG2,
		node_dom('div', null,
			rows_template.map((_, column) => (
				column = tiles_data[row | column],
				node_dom('div', {
					style: (column >>> 24) > 0
					?	`background-color:rgb(${
							column & 0xff
						},${
							column >>> 8 & 0xff
						},${
							column >>> 16 & 0xff
						})`
					:	'',
				})
			))
		)
	))
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
