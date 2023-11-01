import {
	hook_dom,
	hook_effect,
	hook_static,
	node_dom,
	node_map,
} from '../etc/lui.js';

import {
	MENU_NONE,
} from '../etc/constants.js';
import {
	setTimeout_,
} from '../etc/helpers.js';

import {
	game_message_send,
	game_mouse_catch,
} from './m_game.js';

const Message = ({
	I: {
		minor,
		value,
	}
}) => (
	// messages will not change
	hook_dom(minor ? 'div[className=minor]' : 'div', {
		innerText: value,
	}),
	null
);

export default function Terminal({
	game,
	messages,
}) {
	const ref = hook_static({
		history: null,
		input: null,
	});

	hook_dom('div[className=menu overlay terminal]', {
		onclick: event => {
			if (event.target !== ref.input)
				ref.input.focus();
		},
	});

	hook_effect(id => {
		id &&
		setTimeout_(() => (
			ref.history.scrollTop = 1e9
		), 0);
	}, [
		messages.length &&
		messages[messages.length - 1].id
	]);

	return [
		hook_static(node_dom('div[className=toolbar]', null, [
			node_dom('button[innerText=❌]', {
				onclick: () => {
					game.menu = MENU_NONE;
					game.world.flag_paused = false;
					game_mouse_catch(game);
				},
			}),
		])),
		node_dom('div[className=history]', {
			R: hook_static(element => {
				ref.history = element;
			}),
		}, [
			node_map(Message, messages),
		]),
		hook_static(node_dom('input[enterkeyhint=send][mozactionhint=send][name=message][required]', {
			onkeydown: event => {
				const {
					keyCode,
					target,
				} = event;
				if (keyCode === 13) {
					game_message_send(game, target.value);
					target.value = '';
				}
				else if (keyCode === 27) {
					game.flag_paused = false;
					game.menu = MENU_NONE;
				}
			},
			R: element => {
				ref.input = element;
				setTimeout_(() => (
					element.focus()
				), 0);
			},
		})),
	];
}
