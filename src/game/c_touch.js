import {
	hook_dom,
	hook_static,
	node_dom,
} from '../etc/lui.js';

import {
	KEY_MOUSE_LEFT,
	KEY_MOUSE_MIDDLE,
	KEY_MOUSE_RIGHT,
	KEY_MOVE_BACK,
	KEY_MOVE_DOWN,
	KEY_MOVE_FRONT,
	KEY_MOVE_LEFT,
	KEY_MOVE_RIGHT,
	KEY_MOVE_UP,
	KEY_ROTATE_DOWN,
	KEY_ROTATE_LEFT,
	KEY_ROTATE_RIGHT,
	KEY_ROTATE_UP,
} from '../etc/constants.js';
import {
	touch_id_get,
} from '../etc/helpers.js';
import {
	game_key,
} from './m_game.js';

const buttons_top = [
	['pick', KEY_MOUSE_MIDDLE],
	['up', KEY_MOVE_UP],
	['down', KEY_MOVE_DOWN],
	['T', 84],
	['F3', 114],
	['...', 27],
];
const buttons_move = [
	['up', KEY_MOVE_FRONT],
	['down', KEY_MOVE_BACK],
	['left', KEY_MOVE_LEFT],
	['right', KEY_MOVE_RIGHT],
	['center', KEY_MOUSE_LEFT],
];
const buttons_rotate = [
	['up', KEY_ROTATE_UP],
	['down', KEY_ROTATE_DOWN],
	['left', KEY_ROTATE_LEFT],
	['right', KEY_ROTATE_RIGHT],
	['center', KEY_MOUSE_RIGHT],
];

export default function Touch({
	game,
}) {
	const {keys_active} = game;

	const move_button = ([name, code]) => node_dom('div', {
		D: {
			code,
		},
		F: {
			'button': true,
			[name]: true,
			'active': keys_active.has(code),
		},
	});

	hook_dom(
		'div[className=touch]',
		hook_static({
			ontouchstart: event => {
				event.preventDefault();
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
			buttons_move.map(move_button)
		),
		node_dom('div[className=move sec]', null,
			buttons_rotate.map(move_button)
		),
	];
}
