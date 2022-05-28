import {
	hook_dom,
	node_map,
} from '../etc/lui.js';

import {Math_min} from '../etc/helpers.js';

const Message = ({
	I: {
		time,
		value,
	},
	time_now,
}) => (
	hook_dom('div', {
		innerText: value,
		S: {
			opacity: Math_min(
				1,
				1 - (time_now - time - 4500) * .001
			),
		},
	}),
	null
);

export default function Messages({
	messages,
	time_now,
}) {
	hook_dom('div[className=messages]');
	const time_filter = time_now - 5e3;

	return [
		node_map(
			Message,
			(
				messages
				.slice(-10)
				.filter(msg => msg.time > time_filter)
			),
			{
				time_now,
			}
		),
	];
}
