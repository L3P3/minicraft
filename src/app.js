import {
	hook_effect,
	hook_reducer,
	hook_static,
	lui_,
	node,
} from './etc/lui.js';

import Game from './game/c_game.js';

import {
	actions,
	ACTION_SAVE,
} from './etc/state.js';
import {
	handler_noop,
} from './etc/helpers.js';
import {
	game_key,
	game_save,
} from './game/m_game.js';

lui_.init(() => {
	const [state, dispatch] = hook_reducer(actions);

	const ref = hook_static({
		game: null,
	});

	hook_effect(() => {
		onbeforeunload = () => {
			dispatch(ACTION_SAVE);
			if (ref.game) game_save(ref.game);
		};
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
			config: state.config,
			dispatch,
			ref,
		}),
	]];
});
