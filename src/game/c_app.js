import {
	hook_dom,
	hook_state,
	node,
} from '../etc/lui.js';

import {
	APP_VIEW_GAME,
	APP_VIEW_WORLDS,
} from '../etc/constants.js';

import Game from './c_game.js';
import MenuStart from './c_menu_start.js';

export default function App({
	actions,
	config,
	ref,
}) {
	const [view, view_set] = hook_state(APP_VIEW_WORLDS);

	const frame = hook_dom('div[className=game]');

	return [
		view === APP_VIEW_WORLDS &&
		node(MenuStart, {
			actions,
			config,
			view_set,
		}),
		view === APP_VIEW_GAME &&
		node(Game, {
			actions,
			config,
			frame,
			ref,
			view_set,
		}),
	];
}
