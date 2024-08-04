import {
	hook_dom,
	hook_state,
	node,
} from '../etc/lui.js';

import {
	APP_VIEW_GAME,
	APP_VIEW_SETTINGS,
	APP_VIEW_WORLDS,
} from '../etc/constants.js';

import Game from './c_game.js';
import MenuStart from './c_menu_start.js';
import Settings from './c_settings.js';

export default function App({
	account,
	actions,
	config,
	ref,
}) {
	const [view, view_set] = hook_state(APP_VIEW_WORLDS);

	const frame = hook_dom('div[className=game]');

	return [
		(
			view === APP_VIEW_WORLDS ||
			view === APP_VIEW_SETTINGS
		) &&
		node(MenuStart, {
			account,
			actions,
			config,
			view_set,
		}),
		view === APP_VIEW_SETTINGS &&
		node(Settings, {
			actions,
			config,
			game: null,
			view_set,
		}),
		view === APP_VIEW_GAME &&
		node(Game, {
			account,
			actions,
			config,
			frame,
			ref,
			view_set,
		}),
	];
}
