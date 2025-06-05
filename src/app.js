import {
	hook_assert,
	hook_dom,
	hook_effect,
	hook_static,
	init,
	node,
	node_dom,
} from './etc/lui.js';

import {
	DEBUG,
} from './etc/env.js';
import {
	addEventListener_,
	BroadcastChannel_,
	clearTimeout_,
	Date_now,
	handler_noop,
	localStorage_,
	localStorage_getItem,
	localStorage_removeItem,
	localStorage_setItem,
	Number_,
	Object_keys,
	removeEventListener_,
	setInterval_,
	setTimeout_,
} from './etc/helpers.js';
import {
	locale_error_opened,
} from './etc/locale.js';
import {
	actions,
	hook_app_state,
} from './etc/state.js';

import {
	game_key,
	game_save,
} from './game/m_game.js';
import {
	tiles_set,
} from './game/m_renderer.js';
import {
	world_store_init,
} from './game/m_world_store.js';

import App from './game/c_app.js';


function Root() {
	const state = hook_app_state();

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

		world_store_init();

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
		setInterval_(() => (
			actions.config_save(),
			!BroadcastChannel_ && localStorage_setItem('minicraft.lock', Date_now())
		), 500);

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
	hook_effect(tiles_set, [state.config.textures]);

	hook_dom('', {
		onkeydown: handler_key,
		onkeyup: handler_key,
		oncontextmenu: handler_noop,
		ondragstart: handler_noop,
	});

	return [
		node(App, {
			ref,
			state,
		}),
	];
}

function ErrorOpened() {
	close();
	return [
		node_dom(`h1[innerText=${locale_error_opened}]`),
	];
}

if (window.SSR) {
	init(Root);
}
else if (BroadcastChannel_) {
	const channel_lock = new BroadcastChannel_('minicraft.lock');
	const timeout = setTimeout_(init, 100, Root);
	channel_lock.addEventListener('message', event => {
		if (event.data === 'yes') {
			clearTimeout_(timeout);
			channel_lock.close();
			init(ErrorOpened);
		}
		else {
			channel_lock.postMessage('yes');
			focus();
		}
	});
	channel_lock.postMessage('anyone there?');
}
else {
	// first make sure lock has expired
	const lock_found = Number_(localStorage_getItem('minicraft.lock'));
	const lock_limit = Date_now() - 1000;
	// if already expired
	if (lock_found < lock_limit) init(Root);
	// if not, wait and check again
	else setTimeout_(() => {
		init(
			Number_(localStorage_getItem('minicraft.lock')) === lock_found
			?	Root
			:	ErrorOpened
		);
	}, lock_found - lock_limit);
}
