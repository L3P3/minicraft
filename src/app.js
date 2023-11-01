import {
	hook_effect,
	hook_model,
	hook_static,
	lui_,
	node,
} from './etc/lui.js';

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

import App from './game/c_app.js';

lui_.init(() => {
	const [state, actions] = hook_model(reducers);

	const ref = hook_static({
		game: null,
	});

	hook_effect(() => {
		let unloaded = false;

		// shotgun method
		onbeforeunload = onunload = onpagehide = onblur = () => {
			if (unloaded) return;
			unloaded = true;
			actions.config_save();
			if (ref.game) game_save(ref.game);
		};
		onpageshow = onfocus = () => {
			unloaded = false;
		};
	});

	const handler_key = hook_static(event => {
		if (
			event.target.tagName === 'INPUT' ||
			!ref.game
		) return true;

		ref.game.flag_touch = false;

		game_key(
			ref.game,
			event.keyCode,
			event.type === 'keydown'
		);

		event.preventDefault();
		return false;
	});

	return [{
		onkeydown: handler_key,
		onkeyup: handler_key,
		oncontextmenu: handler_noop,
		ondragstart: handler_noop,
	}, [
		node(App, {
			actions,
			config: state.config,
			ref,
		}),
	]];
});
