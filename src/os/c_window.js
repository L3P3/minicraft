import {
	defer,
	defer_end,
	hook_dom,
	hook_effect,
	hook_memo,
	hook_model,
	hook_prev,
	node,
	node_dom,
} from '../etc/lui.js';

import {
	in_event_set,
	windows_actions,
} from '../app.js';
import {
	WINDOW_MODE_FLOATING,
	WINDOW_MODE_FULL,
	WINDOW_MODE_HIDDEN,
	WINDOW_TYPE_GAME,
} from '../etc/constants.js';
import {
	addEventListener_,
	document_,
	Math_ceil,
	Math_floor,
	Math_max,
	Math_min,
	Math_round,
	removeEventListener_,
} from '../etc/helpers.js';
import {
	actions,
	app_state,
} from '../etc/state.js';

import App from '../game/c_app.js';

const AREA_START = 0;
const AREA_MIDDLE = 1;
const AREA_END = 2;

const AREA_TOPLEFT = 0;
const AREA_TOP = 1;
const AREA_TOPRIGHT = 2;
const AREA_LEFT = 3;
const AREA_CENTER = 4;
const AREA_RIGHT = 5;
const AREA_BOTTOMLEFT = 6;
const AREA_BOTTOM = 7;
const AREA_BOTTOMRIGHT = 8;

const CURSORS = 'nwse-resize,ns-resize,nesw-resize,ew-resize,move,ew-resize,nesw-resize,ns-resize,nwse-resize'.split(',');

const WIDTH_MIN = 100;
const HEIGHT_MIN = 50;

// hack until lui supports model parameters
let mode_initial_last = 0;
const model = {
	init: () => model.resize_to({
		custom_height: 0,
		custom_width: 0,
		height: 0,
		key_event: null,
		left: 0,
		mode: mode_initial_last,
		title: '...',
		top: 0,
		width: 0,
	}, 600, 400),
	fullscreen_toggle: state => ({
		...state,
		mode: (
			state.mode === WINDOW_MODE_FULL
			?	WINDOW_MODE_FLOATING
			:	WINDOW_MODE_FULL
		),
	}),
	key_event_set: (state, key_event) => (
		state.key_event &&
		state.key_event.code === key_event.code &&
		state.key_event.state === key_event.state
		?	state
		:	{
				...state,
				key_event,
			}
	),
	move_to: (state, x, y) => ({
		...state,
		left: Math_max(0, Math_min(x, app_state.screen_width - state.width)),
		top: Math_max(0, Math_min(y, app_state.screen_height - state.height)),
	}),
	patch: (state, patch) => ({
		...state,
		...patch,
	}),
	resize_to: (state, width, height) => ({
		...state,
		custom_width: (width = Math_max(WIDTH_MIN, Math_min(width, app_state.screen_width - state.left))),
		custom_height: (height = Math_max(HEIGHT_MIN, Math_min(height, app_state.screen_height - state.top))),
		width,
		height,
	}),
	title_set: (state, title) => ({
		...state,
		title,
	}),
};

const drag_handler = (hook_model_state_actions, window_id, event) => {
	actions.window_focus(window_id);
	const element = event.target;
	if (
		element.className !== 'window borders' ||
		event.button !== 0
	) {
		return;
	}
	event.preventDefault();
	document_.activeElement.blur();
	const [window_state_start, window_actions] = hook_model_state_actions;
	const mouse_x_start = event.clientX;
	const mouse_y_start = event.clientY;
	let mouse_x_start_relative = mouse_x_start - window_state_start.left;
	const mouse_y_start_relative = mouse_y_start - window_state_start.top;
	const area_h = ( // [0..7], [8..n-9], [n-8..n-1]
		mouse_x_start_relative < 8
		?	AREA_START
		: mouse_x_start_relative < window_state_start.width - 8
		?	AREA_MIDDLE
		:	AREA_END
	);
	const area_v = (
		mouse_y_start_relative < 8
		?	AREA_START
		: mouse_y_start_relative < window_state_start.height - 8
		?	AREA_MIDDLE
		:	AREA_END
	);
	const area = area_h + area_v * 3;
	element.style.willChange = area === AREA_CENTER ? 'transform' : 'contents';
	actions.state_patch({
		cursor: CURSORS[area],
	});

	const move_handler = event => {
		in_event_set(true);
		defer();
		let mouse_x_now = event.clientX;
		let mouse_y_now = event.clientY;

		// move only?
		area_center: if (area === AREA_CENTER) {
			// snap to edges
			if (event.type === 'mouseup') {
				if (mouse_y_now < 4) {
					window_actions.patch({
						left: 0,
						top: 0,
						width: app_state.screen_width,
						height: app_state.screen_height,
					});
					break area_center;
				}
				if (mouse_x_now < 4) {
					window_actions.patch({
						left: 0,
						top: 0,
						width: Math_ceil(app_state.screen_width / 2),
						height: app_state.screen_height,
					});
					break area_center;
				}
				if (mouse_x_now > app_state.screen_width - 3) {
					window_actions.patch({
						left: Math_ceil(app_state.screen_width / 2),
						top: 0,
						width: Math_floor(app_state.screen_width / 2),
						height: app_state.screen_height,
					});
					break area_center;
				}
			}
			// unsnap from edges
			else {
				const [window_state_now] = hook_model_state_actions;
				if (
					window_state_now.custom_width !== window_state_now.width ||
					window_state_now.custom_height !== window_state_now.height
				) {
					window_actions.resize_to(
						window_state_now.custom_width,
						window_state_now.custom_height
					);
					const [window_state_now_2] = hook_model_state_actions;
					mouse_x_start_relative = Math_round(
						mouse_x_start_relative * window_state_now_2.custom_width / window_state_now.width
					);
				}
			}

			window_actions.move_to(
				mouse_x_now - mouse_x_start_relative,
				mouse_y_now - mouse_y_start_relative
			);
		}
		// resize?
		else {
			// need to move?
			if (area_h === AREA_START || area_v === AREA_START) {
				window_actions.move_to(
					// left
					area_h === AREA_START
					?	(
							// limit mouse_x to left and right
							mouse_x_now = Math_max(
								mouse_x_start_relative,
								Math_min(
									mouse_x_now,
									window_state_start.left + window_state_start.width - WIDTH_MIN + mouse_x_start_relative
								)
							)
						) - mouse_x_start_relative
					:	window_state_start.left,
					// top
					area_v === AREA_START
					?	(
							// limit mouse_y to top and bottom
							mouse_y_now = Math_max(
								mouse_y_start_relative,
								Math_min(
									mouse_y_now,
									window_state_start.top + window_state_start.height - HEIGHT_MIN + mouse_y_start_relative
								)
							)
						) - mouse_y_start_relative
					:	window_state_start.top
				);
			}

			window_actions.resize_to(
				// width
				area_h === AREA_START
				?	window_state_start.width + window_state_start.left + mouse_x_start_relative - mouse_x_now
				: area_h === AREA_MIDDLE
				?	window_state_start.width
				:	window_state_start.width - mouse_x_start + mouse_x_now,
				// height
				area_v === AREA_START
				?	window_state_start.height + window_state_start.top + mouse_y_start_relative - mouse_y_now
				: area_v === AREA_MIDDLE
				?	window_state_start.height
				:	window_state_start.height - mouse_y_start + mouse_y_now
			);
		}
		defer_end();
		in_event_set(false);
	};
	const up_handler = event => {
		removeEventListener_('mousemove', move_handler, true);
		removeEventListener_('mouseup', up_handler);
		if (
			event.clientX !== mouse_x_start ||
			event.clientY !== mouse_y_start
		) {
			move_handler(event);
		}
		actions.state_patch({
			cursor: null,
		});
		element.style.willChange = 'auto';
	};
	addEventListener_('mousemove', move_handler, true);
	addEventListener_('mouseup', up_handler);
}

const window_attributes_get = (
	{
		height,
		left,
		mode,
		top,
		width,
	},
	down_callback
) => ({
	F: {
		window: true,
		borders: mode === WINDOW_MODE_FLOATING,
	},
	S: {
		display: mode === WINDOW_MODE_HIDDEN ? 'none' : 'block',
		height: mode === WINDOW_MODE_FULL ? '100%' : height + 'px',
		transform: mode === WINDOW_MODE_FULL ? '' : `translate(${left}px, ${top}px)`,
		width: mode === WINDOW_MODE_FULL ? '100%' : width + 'px',
	},
	onmousedown: down_callback,
})

const WindowCaption = ({
	title,
	window_id,
}) => [
	node_dom('div[className=window_title]', {
		innerText: title,
	}),
	node_dom('div[className=window_button]', {
		onclick: () => actions.window_remove(window_id),
	}),
]

export default function Window({
	I: {
		id: window_id,
		mode_initial,
		type,
	},
	state,
}) {
	// HACK: lui does not support model parameters (yet), so we use a global variable
	mode_initial_last = mode_initial;
	const hook_model_state_actions = hook_model(model);
	const [window_state, window_actions] = hook_model_state_actions;

	hook_effect(() => (
		windows_actions.set(window_id, window_actions),
		() => windows_actions.delete(window_id)
	));
	const down_callback = hook_memo(() => drag_handler.bind(null, hook_model_state_actions, window_id));

	hook_dom(
		'div',
		hook_memo(window_attributes_get, [window_state, down_callback])
	);

	// limit window size to screen
	const screen_changed = hook_prev(true, false);
	hook_effect((width, height) => {
		if (screen_changed) {
			window_actions.patch({
				left: Math_max(0, Math_min(window_state.left, width - window_state.width)),
				top: Math_max(0, Math_min(window_state.top, height - window_state.height)),
				width: Math_min(width, Math_max(WIDTH_MIN, window_state.custom_width, window_state.width)),
				height: Math_min(height, Math_max(HEIGHT_MIN, window_state.custom_height, window_state.height)),
			});
		}
	}, [state.screen_width, state.screen_height]);

	return [
		type === WINDOW_TYPE_GAME &&
		node(App, {
			key_event: window_state.key_event,
			state,
			window_actions,
			window_id,
		}),
		window_state.mode !== WINDOW_MODE_FULL &&
		node(WindowCaption, {
			title: window_state.title,
			window_id,
		}),
	];
}
