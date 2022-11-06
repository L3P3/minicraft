import {
	hook_effect,
	hook_model,
	hook_static,
	lui_,
	node,
} from './etc/lui.js';

import Game from './game/c_game.js';

import {
	reducers,
} from './etc/state.js';
import {
	handler_noop,
} from './etc/helpers.js';
import {
	game_key,
	game_save,
} from './game/m_game.js';

lui_.init(() => {
	const [state, actions] = hook_model(reducers);

	const ref = hook_static({
		game: null,
	});

	hook_effect(() => {
		let unloaded = false;

		onbeforeunload = onunload = () => {
			if (unloaded) return;
			unloaded = true;
			actions.config_save();
			if (ref.game) game_save(ref.game);
		};
	});

	const handler_key = hook_static(event => (
		event.target.tagName === 'INPUT' ||
		!ref.game || (
			event.preventDefault(),
			game_key(
				ref.game,
				event.keyCode,
				event.type === 'keydown'
			),
			ref.game.flag_touch = false
		)
	));

	return [{
		onkeydown: handler_key,
		onkeyup: handler_key,
		oncontextmenu: handler_noop,
		ondragstart: handler_noop,
	}, [
		node(Game, {
			actions,
			config: state.config,
			ref,
		}),
	]];
});
