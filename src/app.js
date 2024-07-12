import {
	hook_assert,
	hook_dom,
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
	addEventListener_,
	handler_noop,
	localStorage_,
	localStorage_removeItem,
	Object_keys,
	removeEventListener_,
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
		last_touch_event: 0,
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
		setInterval(actions.config_save, 500);

		addEventListener_('touchend', event => {
			ref.last_touch_event = event.timeStamp;
		}, true);
	});

	const handler_key = hook_static(event => {
		if (
			event.target.tagName === 'INPUT' ||
			!ref.game
		) return true;

		actions.config_touch_set(false);

		game_key(
			ref.game,
			event.keyCode,
			event.type === 'keydown'
		);

		return false;
	});
	const handler_touch = hook_static(() => {
		actions.config_touch_set(true);
	});
	const handler_mouse = hook_static(event => {
		if (event.timeStamp - ref.last_touch_event > 999) {
			actions.config_touch_set(false);
		}
	});

	const {flag_touch} = state.config;
	hook_effect(() => {
		if (flag_touch) {
			addEventListener_('mousedown', handler_mouse, true);
			addEventListener_('mouseup', handler_mouse, true);
			removeEventListener_('touchstart', handler_touch, true);
		}
		else {
			removeEventListener_('mousedown', handler_mouse, true);
			removeEventListener_('mouseup', handler_mouse, true);
			addEventListener_('touchstart', handler_touch, true);
		}
	}, [flag_touch]);

	hook_dom('', {
		onkeydown: handler_key,
		onkeyup: handler_key,
		oncontextmenu: handler_noop,
		ondragstart: handler_noop,
	});

	return [
		node(App, {
			account: state.account,
			actions,
			config: state.config,
			ref,
		}),
	];
});
