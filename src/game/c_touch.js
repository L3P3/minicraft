import {
	hook_dom,
	hook_static,
	node_dom,
} from '../etc/lui.js';

import {
	KEY_MOVE_BACK,
	KEY_MOVE_FRONT,
	KEY_MOVE_LEFT,
	KEY_MOVE_RIGHT,
	KEY_MOVE_UP,
} from '../etc/constants.js';
import {
	touch_id_get,
} from '../etc/helpers.js';
import {
	game_key,
} from './m_game.js';

const buttons_top = [
	['F3', 114],
	['R', 82],
	['...', 27], // ESC
];
const buttons_move = [
	['up', KEY_MOVE_FRONT],
	['down', KEY_MOVE_BACK],
	['left', KEY_MOVE_LEFT],
	['right', KEY_MOVE_RIGHT],
	['center', KEY_MOVE_UP],
];

export default function Touch({
	game,
}) {
	const {keys_active} = game;

	hook_dom(
		'div[className=touch]',
		hook_static({
			ontouchstart: event => {
				event.preventDefault();
				game.flag_paused = false;
				const code = Number(event.target.dataset.code);
				if (
					code != null &&
					game_key(game, code, true)
				) {
					const touch_id = touch_id_get(event);
					const onend = event => {
						if (touch_id_get(event) === touch_id) {
							removeEventListener('touchend', onend);
							game_key(game, code, false);
						}
					}
					addEventListener('touchend', onend);
				}
			}
		})
	);

	return [
		node_dom('div[className=top]', null,
			buttons_top.map(([label, code]) =>
				node_dom(`div[innerText=${label}]`, {
					D: {
						code,
					},
					F: {
						'button': true,
						'active': keys_active.has(code),
					},
				})
			)
		),
		node_dom('div[className=move]', null,
			buttons_move.map(([name, code]) =>
				node_dom('div', {
					D: {
						code,
					},
					F: {
						'button': true,
						[name]: true,
						'active': keys_active.has(code),
					},
				})
			)
		),
	];
}
