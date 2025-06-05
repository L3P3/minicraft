import {
	hook_dom,
	hook_effect,
	hook_state,
	node,
	node_dom,
} from '../etc/lui.js';

import {
	APP_VIEW_GAME,
	APP_VIEW_SETTINGS,
	APP_VIEW_WORLDS,
} from '../etc/constants.js';
import {
	clearTimeout_,
	setTimeout_,
} from '../etc/helpers.js';
import {
	locale_error_connection,
	locale_retry,
} from '../etc/locale.js';
import {
	actions,
} from '../etc/state.js';

import {
	world_store_sync_check,
} from './m_world_store.js';

import Game from './c_game.js';
import MenuStart from './c_menu_start.js';
import Settings from './c_settings.js';

let sync_check_timeout = 0;

export default function App({
	state,
	ref,
}) {
	const [view, view_set] = hook_state(APP_VIEW_WORLDS);

	hook_effect(() => {
		clearTimeout_(sync_check_timeout);
		if (!state.connection_error) {
			sync_check_timeout = setTimeout_(world_store_sync_check);
		}
	}, [
		state.connection_error,
		state.worlds_merged,
	]);

	const frame = hook_dom('div[className=game]');

	return [
		(
			view === APP_VIEW_WORLDS ||
			view === APP_VIEW_SETTINGS
		) &&
		node(MenuStart, {
			state,
			view_set,
		}),
		view === APP_VIEW_SETTINGS &&
		node(Settings, {
			config: state.config,
			game: null,
			view_set,
		}),
		view === APP_VIEW_GAME &&
		node(Game, {
			frame,
			ref,
			state,
			view_set,
		}),
		view === APP_VIEW_WORLDS &&
		state.connection_error &&
		node_dom('div[style=position:absolute;bottom:0;left:0;color:yellow]', {
			title: state.connection_error,
		}, [
			node_dom(`span[innerText=${locale_error_connection} ]`),
			node_dom(`button[innerText=${locale_retry}]`, {
				onclick: () => {
					actions.state_patch({
						connection_error: null,
					});
				},
			}),
		]),
	];
}
