import {
	hook_dom,
	hook_static,
	node_dom,
	node_map,
} from '../etc/lui.js';

import {
	MENU_NONE,
} from '../etc/constants.js';

import {
	game_message_send,
} from './m_game.js';

const Message = ({
	I: {
		value,
	}
}) => (
	hook_dom('div', {
		innerText: value,
	}),
	null
);

export default function Terminal({
	game,
	messages,
}) {
	hook_dom('div[className=menu terminal]');

	return [
		node_dom('div[className=history]', null, [
			node_map(Message, messages),
		]),
		node_dom(
			'input[autofocus][enterkeyhint=send][mozactionhint=send][name=message][required]',
			hook_static({
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
					event.stopPropagation();
				},
				onkeyup: event => {
					event.stopPropagation();
				},
			})
		),
	];
}
