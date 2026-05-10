import {
	hook_dom,
	hook_memo,
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
	Math_min,
	Math_round,
	Number_,
	addEventListener_,
	removeEventListener_,
	touch_id_get,
} from '../etc/helpers.js';

import {
	game_key,
} from './m_game.js';

const buttons_top = [
	['pick', KEY_MOUSE_MIDDLE],
	['up', KEY_MOVE_UP],
	['down', KEY_MOVE_DOWN],
	['E', 69],
	['T', 84],
	['F1', 112],
	['F3', 114],
	['...', 27],
];

const childs_div = [
	node_dom('div'),
];

export default function Touch({
	game,
	viewport_width,
}) {
	const {keys_active} = game;

	hook_dom(
		'div[className=touch]',
		hook_static({
			ontouchstart: event => {
				let code = (
					event.target.dataset.code ||
					event.target.parentElement.dataset.code
				);
				if (
					code != null &&
					game_key(game, code = Number_(code), true)
				) {
					const touch_id = touch_id_get(event);
					const onend = event => {
						if (touch_id_get(event) === touch_id) {
							removeEventListener_('touchend', onend);
							game_key(game, code, false);
						}
					}
					addEventListener_('touchend', onend);
				}
				return false;
			},
		})
	);

	const [center_style, td_style] = hook_memo(button_size => [
		{
			height: (button_size - 8) + 'px',
		},
		{
			width: button_size += 'px',
			height: button_size,
		},
	], [
		Math_min(
			Math_round(viewport_width / 10),
			40
		),
	]);
	const [left_style, right_style] = hook_memo(() => {
		const gap = (
			viewport_width > 300
			?	'14px'
			:	'0'
		);
		const borderSpacing = (
			viewport_width > 300
			?	'2px'
			:	'0'
		);
		const bottom = (
			viewport_width > 650
			?	gap
			:	'40px'
		);
		return [{
			borderSpacing,
			bottom,
			left: gap,
		}, {
			borderSpacing,
			bottom,
			right: gap,
		}];
	}, [
		viewport_width,
	]);

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
		node_dom('table[className=move]', {
			S: left_style,
		}, [
			node_dom('tr', null, [
				node_dom('td'),
				node_dom('td', {
					D: {
						'code': KEY_MOVE_FRONT,
					},
					F: {
						'button up': true,
						'active': keys_active.has(KEY_MOVE_FRONT),
					},
					S: td_style,
				}, childs_div),
			]),
			node_dom('tr', null, [
				node_dom('td', {
					D: {
						'code': KEY_MOVE_LEFT,
					},
					F: {
						'button left': true,
						'active': keys_active.has(KEY_MOVE_LEFT),
					},
					S: td_style,
				}, childs_div),
				node_dom('td', null, [
					node_dom('div', {
						D: {
							'code': KEY_MOUSE_LEFT,
						},
						F: {
							'button center': true,
							'active': keys_active.has(KEY_MOUSE_LEFT),
						},
						S: center_style,
					}, childs_div),
				]),
				node_dom('td', {
					D: {
						'code': KEY_MOVE_RIGHT,
					},
					F: {
						'button right': true,
						'active': keys_active.has(KEY_MOVE_RIGHT),
					},
					S: td_style,
				}, childs_div),
			]),
			node_dom('tr', null, [
				node_dom('td'),
				node_dom('td', {
					D: {
						'code': KEY_MOVE_BACK,
					},
					F: {
						'button down': true,
						'active': keys_active.has(KEY_MOVE_BACK),
					},
					S: td_style,
				}, childs_div),
			]),
		]),
		node_dom('table[className=move]', {
			S: right_style,
		}, [
			node_dom('tr', null, [
				node_dom('td'),
				node_dom('td', {
					D: {
						'code': KEY_ROTATE_UP,
					},
					F: {
						'button up': true,
						'active': keys_active.has(KEY_ROTATE_UP),
					},
					S: td_style,
				}, childs_div),
			]),
			node_dom('tr', null, [
				node_dom('td', {
					D: {
						'code': KEY_ROTATE_LEFT,
					},
					F: {
						'button left': true,
						'active': keys_active.has(KEY_ROTATE_LEFT),
					},
					S: td_style,
				}, childs_div),
				node_dom('td', null, [
					node_dom('div', {
						D: {
							'code': KEY_MOUSE_RIGHT,
						},
						F: {
							'button center': true,
							'active': keys_active.has(KEY_MOUSE_RIGHT),
						},
						S: center_style,
					}, childs_div),
				]),
				node_dom('td', {
					D: {
						'code': KEY_ROTATE_RIGHT,
					},
					F: {
						'button right': true,
						'active': keys_active.has(KEY_ROTATE_RIGHT),
					},
					S: td_style,
				}, childs_div),
			]),
			node_dom('tr', null, [
				node_dom('td'),
				node_dom('td', {
					D: {
						'code': KEY_ROTATE_DOWN,
					},
					F: {
						'button down': true,
						'active': keys_active.has(KEY_ROTATE_DOWN),
					},
					S: td_style,
				}, childs_div),
			]),
		]),
	];
}
