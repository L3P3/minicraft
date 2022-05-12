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

	const ref = hook_static({
		history: null,
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
		node_dom('div[className=history]', {
			R: hook_static(element => {
				ref.history = element;
			}),
		}, [
			node_map(Message, messages),
		]),
		node_dom(
			'input[enterkeyhint=send][mozactionhint=send][name=message][required]',
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
				},
				R: element => (
					setTimeout_(() => (
						element.focus()
					), 0)
				),
			})
		),
	];
}
