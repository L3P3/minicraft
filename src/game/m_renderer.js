import {
	VERSION,
} from '../etc/constants.js';

export const renderer_create = (game, canvas) => {
	const model = {
		canvas,
		canvas_context: null,
		canvas_surface: null,
		diagnostics: '',
		flag_dirty: false,
		fps: 0,
		fps_counter: 0,
		fps_interval: setInterval(() => {
			model.fps = model.fps_counter;
			model.fps_counter = 0;
		}, 1e3),
		game,
	};
	renderer_canvas_init(model);
	return model;
};

export const renderer_destroy = model => {
	clearInterval(model.fps_interval);
};

export const renderer_render = (model, now) => {
	++model.fps_counter;

	const {
		canvas_surface,
		game,
	} = model;

	model.diagnostics = (
		game.flag_diagnostics
		?	`Minicraft ${VERSION}
${
	model.fps
	.toString().padStart(2, '\xa0')
} fps, T: ${
	Math.floor(game.time_f * 24)
	.toString().padStart(2, '0')
}:${
	Math.floor(((game.time_f * 24) % 1) * 60)
	.toString().padStart(2, '0')
}; ${
	game.flag_paused &&
	now % 1e3 < 500
	?	''
	:	game.time
}
R: ${game.resolution_x}x${game.resolution_y} (x${game.resolution_scaling}), C: 0, D: INF
E: 0/0

X/Y/Z: 0.0 0.0 0.0
Block: 0 0 0
Chunk: 0 0 0 in 0 0
Facing: 0`
		:	''
	);

	if (
		game.flag_paused &&
		!model.flag_dirty
	) return;

	model.flag_dirty = false;

	const pixels = canvas_surface.data;

	for (let y = 0; y < game.resolution_y; ++y)
	for (let x = 0; x < game.resolution_x; ++x)
		pixels[((y * game.resolution_x + x) << 2) + 2] = Math.round(
			(
				.5 * Math.sin(
					(game.time % 50) / 50 * 2 * Math.PI +
					(x/game.resolution_x + y/game.resolution_y) * 10 * Math.PI
				) + .25
			) * 200 + 55
		);

	model.canvas_context.putImageData(canvas_surface, 0, 0);
};

export const renderer_canvas_init = model => {
	const width = model.canvas.width = model.game.resolution_x;
	const height = model.canvas.height = model.game.resolution_y;
	const data = (
		model.canvas_surface = (
			model.canvas_context = model.canvas.getContext('2d')
		).createImageData(width, height)
	).data;
	const data_length = data.length;
	for (let i = 3; i < data_length; i += 4)
		data[i] = 255;
};
