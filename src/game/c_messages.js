import {
	hook_dom,
	node_dom,
	node_map,
} from '../etc/lui.js';

import {
	LEGACY,
} from '../etc/env.js';
import {
	Math_min,
} from '../etc/helpers.js';

function Message({
	I: {
		minor,
		time,
		value,
	},
	time_now,
}) {
	const opacity = Math_min(
		1,
		1 - (time_now - time - 4500) * .001
	);
	// SAFE: messages will not change
	if (LEGACY) {
		hook_dom(minor ? 'div[className=minor]' : 'div');
	}
	else {
		hook_dom(minor ? 'div[className=minor]' : 'div', {
			S: {
				opacity,
			},
		});
	}

	return [
		LEGACY
		?	node_dom('div[className=backdrop]', {
			S: {
				opacity: opacity * .7,
				filter: `alpha(opacity=${opacity * 70})`,
			},
		})
		:	node_dom('div[className=backdrop]'),

		node_dom('span',
			LEGACY
			?	{
				innerText: value,
				S: {
					opacity,
					filter: `alpha(opacity=${opacity * 100})`,
				},
			}
			:	{
				innerText: value,
			}
		),
	];
}

export default function Messages({
	messages,
	time_now,
}) {
	hook_dom('div[className=messages]');

	return [
		node_map(
			Message,
			(
				messages
				.slice(-10)
				.filter(msg => msg.time > time_now - 5e3)
			),
			{
				time_now,
			}
		),
	];
}
