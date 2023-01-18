import {
	hook_dom,
	node,
	node_dom,
} from '../etc/lui.js';

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
	--id,
	rows_template.map((_, row) =>
		node_dom('div', null,
			rows_template.map((_, column) => {
				const pixel = tiles_data[
					id << (TILES_RESOLUTION_LOG2 * 2) |
					(15 - row) << TILES_RESOLUTION_LOG2 |
					column
				];
				return (
					node_dom('div', {
						style: (pixel >>> 24) > 0
						?	`background-color:rgb(${
								pixel & 0xff
							},${
								pixel >>> 8 & 0xff
							},${
								pixel >>> 16 & 0xff
							})`
						:	'',
					})
				);
			})
		)
	)
);

export default function Stack({
	amount,
	data,
	id,
}) {
	hook_dom('div[className=stack]');

	return [
		node(Bitmap, {
			id,
		}),
		amount > 1 &&
		node_dom('div[className=amount]', {
			innerText: amount,
		}),
	];
}
