import {
	hook_assert,
	hook_effect,
	hook_model,
	hook_static,
	lui_,
	node,
} from './etc/lui.js';

import {
	DEBUG,
} from './etc/env.js';
import {
	reducers,
} from './etc/state.js';
import {
	Object_keys,
	handler_noop,
	localStorage_,
	localStorage_removeItem,
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
		if (
			DEBUG &&
			location.hash === '#purge'
		) {
			for (const key of Object_keys(localStorage_)) {
				localStorage_removeItem(key);
			}
			location.href = '/app-dev.html';
			hook_assert(false);
		}

		let unloaded = false;

		// shotgun method
		onbeforeunload = onunload = onpagehide = onblur = () => {
			if (unloaded) return;
			unloaded = true;
			if (ref.game) game_save(ref.game);
			actions.config_save();
		};
		onpageshow = onfocus = () => {
			unloaded = false;
		};
		setInterval(() => {
			actions.config_save();
		}, 500);
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
			account: state.account,
			actions,
			config: state.config,
			ref,
		}),
	]];
});
