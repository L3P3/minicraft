import {
	defer,
	hook_dom,
	node_dom,
} from '../etc/lui.js';

import {
	VERSION,
} from '../etc/env.js';

import {
	game_mouse_catch,
	game_world_open,
} from './m_game.js';

export default function MenuStart({
	actions,
	game,
}) {
	hook_dom('div[className=menu]');

	return [
		node_dom('h1[innerText=Minicraft]'),
		node_dom('center', null, [
			node_dom('button[innerText=Welt betreten]', {
				onclick: () => {
					defer();
					actions.config_set({
						world_last: 0,
					});
					game_world_open(game);
					game.world.flag_paused = false,
					game_mouse_catch(game);
				},
			}),
		]),
		node_dom('center', null, [
			node_dom('button[innerText=Weltenverzeichnis]', {
				onclick: () => {
					location.href = '/svr/minicraft/store.html';
				},
			}),
		]),
		node_dom('center', null, [
			node_dom('button[innerText=Projektseite]', {
				onclick: () => {
					open('//github.com/L3P3/minicraft');
				},
			}),
		]),
		node_dom('center', null, [
			node_dom('small[innerText=Version ' + VERSION + ' von L3P3]'),
		]),
	];
}
