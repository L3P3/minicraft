import {
	hook_assert,
	hook_dom,
	hook_effect,
	hook_static,
	init,
	node_dom,
	node_map,
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
	Map_,
	Number_,
	Object_keys,
	removeEventListener_,
	Set_,
	setInterval_,
	setTimeout_,
	window_,
} from './etc/helpers.js';
import {
	locale_error_opened,
} from './etc/locale.js';
import {
	actions,
	app_state,
	hook_app_state,
} from './etc/state.js';
import {
	chunks_db_promise,
} from './etc/storage.js';

import {
	game_save,
} from './game/m_game.js';
import {
	tiles_set,
} from './game/m_renderer.js';
import {
	world_store_init,
	world_store_sync_check,
} from './game/m_world_store.js';

import Window from './os/c_window.js';


export const games = new Set_;
export const windows_actions = new Map_;
export let in_event = false;
export const in_event_set = value => {
	in_event = value;
}
let last_touch_event = 0;
let sync_check_timeout = 0;

function Root() {
	hook_app_state();

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
			for (const game of games) game_save(game);
			actions.config_save();
		};
		onpageshow = onfocus = () => {
			unloaded = false;
		};
		onresize = () => {
			in_event = true;
			actions.state_patch({
				screen_height: window_.innerHeight,
				screen_width: window_.innerWidth,
			});
			in_event = false;
		};
		setInterval_(() => (
			actions.config_save(),
			!BroadcastChannel_ && localStorage_setItem('minicraft.lock', Date_now())
		), 500);

		addEventListener_('touchend', event => {
			last_touch_event = event.timeStamp;
		}, true);
	});

	const handler_key = hook_static(event => {
		if (event.target.tagName === 'INPUT') return true;
		in_event = true;
		actions.config_touch_set(false);

		if (app_state.windows.length > 0) {
			const window_focussed_actions = windows_actions.get(
				app_state.windows[app_state.windows.length - 1].id
			);
			const key_state = event.type === 'keydown';
			if (event.key !== 'f') {
				window_focussed_actions.key_event_set({
					code: event.keyCode,
					state: key_state,
				});
			}
			else if (key_state) {
				window_focussed_actions.fullscreen_toggle();
			}
		}

		in_event = false;
		return false;
	});
	const handler_touch = hook_static(() => {
		actions.config_touch_set(true);
	});
	const handler_mouse = hook_static(event => {
		if (event.timeStamp - last_touch_event > 999) {
			actions.config_touch_set(false);
		}
	});

	const {flag_touch} = app_state.config;
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
	hook_effect(tiles_set, [app_state.config.textures]);

	hook_effect(() => {
		clearTimeout_(sync_check_timeout);
		if (!app_state.connection_error) {
			sync_check_timeout = setTimeout_(world_store_sync_check);
		}
	}, [
		app_state.connection_error,
		app_state.worlds_merged,
	]);

	hook_dom('', {
		onkeydown: handler_key,
		onkeyup: handler_key,
		oncontextmenu: handler_noop,
		ondragstart: handler_noop,
	});

	return [
		node_map(Window, app_state.windows, {
			state: app_state,
		}),
		app_state.cursor &&
		node_dom('div[className=cursormask]', {
			S: {
				cursor: app_state.cursor,
			},
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
	const timeout = setTimeout_(() => (
		chunks_db_promise.then(() =>
			init(Root)
		)
	), 100);
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
	const lock_found = Number_(localStorage_getItem('minicraft.lock'));
	const lock_limit = Date_now() - 1500;
	// if lock still valid, wait and check again
	if (lock_found > lock_limit) {
		setTimeout_(() => {
			// chunks_db_promise will already be resolved by then
			init(
				Number_(localStorage_getItem('minicraft.lock')) === lock_found
				?	Root
				:	ErrorOpened
			);
		}, lock_found - lock_limit);
	}
	// if not, init right away
	else {
		chunks_db_promise.then(() =>
			init(Root)
		)
	}
}
