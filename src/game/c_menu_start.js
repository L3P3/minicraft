import {
	defer,
	defer_end,
	hook_async,
	hook_dom,
	hook_memo,
	hook_state,
	hook_static,
	node_dom,
	node_map,
} from '../etc/lui.js';

import {
	APP_VIEW_GAME,
} from '../etc/constants.js';
import {
	API,
	VERSION,
} from '../etc/env.js';
import {
	datify,
} from '../etc/helpers.js';

function WorldItem({
	I,
	world_selected,
	world_selected_set,
}) {
	hook_dom('div', {
		F: {
			selected: I === world_selected,
		},
		onclick: () => {
			world_selected_set(I.id);
		},
	});

	return [
		node_dom('span', {
			innerText: `${I.local ? '' : '🌐 '}${I.label}`,
			title: I.local ? '' : 'Besitzer: ' + I.account_name,
		}),
		node_dom('span', {
			innerText: I.local ? '' : datify(I.modified),
		}),
	];
}

export default function MenuStart({
	actions,
	view_set,
}) {
	hook_dom('div[className=menu]');

	const [refreshes, refreshes_set] = hook_state(0);

	const world_list_resolved = API && hook_async(
		async () => {
			const response = await fetch(API + 'world?what=meta_all');
			if (!response.ok) return null;
			return await response.json();
		},
		[refreshes],
		null
	);
	/**
		@type {{
			value: ?Array<TYPE_WORLD_LISTING>,
		}}
	*/
	const world_list_last_ref = API && hook_static({
		value: null,
	});
	const world_list = hook_memo(() => {
		if (
			API &&
			world_list_resolved
		) {
			world_list_last_ref.value = world_list_resolved;
		}

		const list = [];

		if (
			API &&
			world_list_last_ref.value
		) {
			list.push(
				...world_list_last_ref.value
				.map(world => ({
					account_name: world.account_name,
					id: -1 - world.id,
					label: world.label,
					local: false,
					modified: world.modified,
				}))
			);
		}

		list.sort((a, b) => b.modified - a.modified);

		list.unshift({
			account_name: '',
			id: 0,
			label: 'Lokale Welt',
			local: true,
			modified: 0,
		});

		return list;
	}, [
		world_list_resolved,
	]);

	const [world_selected_pair, world_selected_set] = hook_state(null);
	const world_selected = hook_memo(selected_id => (
		selected_id !== null &&
		world_list.find(world => (
			world.id === selected_id
		)) || null
	), [
		world_selected_pair,
		world_list,
	]);

	return [
		node_dom('h1[innerText=Welten]'),
		node_dom('div[className=worlds]', null, [
			node_map(WorldItem, world_list, {
				world_selected,
				world_selected_set,
			}),
		]),
		node_dom('center', null, [
			node_dom('button[innerText=Öffnen]', {
				disabled: !world_selected || !world_selected.local,
				onclick: () => {
					// TODO download world if not local
					defer();
					actions.config_set({
						world_last: world_selected.id,
					});
					view_set(APP_VIEW_GAME);
					defer_end();
				},
			}),
			!!API &&
			node_dom('button', {
				disabled: !world_list_resolved,
				innerText: 'Aktualisieren',
				onclick: () => {
					refreshes_set(refreshes + 1);
				},
			}),
		]),
		node_dom('hr'),
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
