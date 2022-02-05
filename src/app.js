import {
	hook_static,
	lui_,
	node,
} from './etc/lui.js';

import Game from './game/c_game.js';

import {
	game_key,
} from './game/m_game.js';

const handler_noop = () => false;

lui_.init(() => {
	const ref = hook_static({
		game: null,
	});

	const handler_key = hook_static(event => (
		(
			!ref.game ||
			game_key(
				ref.game,
				event.keyCode,
				event.type === 'keydown'
			)
		) || (
			event.preventDefault(),
			false
		)
	));

	return [{
		onkeydown: handler_key,
		onkeyup: handler_key,
		oncontextmenu: handler_noop,
		ondragstart: handler_noop,
	}, [
		node(Game, {
			ref,
		}),
	]];
});
