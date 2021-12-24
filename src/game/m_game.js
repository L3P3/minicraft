import {
	renderer_canvas_init,
	renderer_create,
	renderer_destroy,
} from './m_renderer.js';

export const game_create = () => ({
	flag_autoscaling: true,
	flag_diagnostics: true,
	flag_menu: false,
	flag_paused: false,
	renderer: null,
	resolution_scaling: 20.0,
	resolution_raw_x: 0,
	resolution_raw_y: 0,
	resolution_x: 0,
	resolution_y: 0,
	tick_interval: null,
	time: 0,
	time_f: 0.0,
});

export const game_start = (model, canvas) => {
	model.renderer = renderer_create(model, canvas);
	model.tick_interval = setInterval(() => {
		game_tick(model);
	}, 50);
};

export const game_resolution_raw_set = (model, width, height) => (
	model.resolution_raw_x = width,
	model.resolution_raw_y = height,
	game_resolution_update(model)
);

export const game_scaling_set = (model, scaling) => (
	model.resolution_scaling = scaling,
	game_resolution_update(model)
);

const game_resolution_update = model => {
	const x = Math.max(1, Math.round(model.resolution_raw_x / model.resolution_scaling));
	const y = Math.max(1, Math.round(model.resolution_raw_y / model.resolution_scaling));

	if (
		x === model.resolution_x &&
		y === model.resolution_y
	) return;

	model.resolution_x = x;
	model.resolution_y = y;
	if (model.renderer) {
		model.renderer.flag_dirty = true;
		renderer_canvas_init(model.renderer);
	}
};

export const game_umount = model => {
	clearInterval(model.tick_interval);
	renderer_destroy(model.renderer);
};

export const game_key = (model, code, state) => {
	if (state) switch (code) {
		case 27:
			model.flag_paused =
			model.flag_menu = !model.flag_menu;
			break;
		case 80:
			model.flag_paused = !model.flag_paused;
			break;
		case 114:
			model.flag_diagnostics = !model.flag_diagnostics;
			break;
		default:
			return true;
	}
	else switch (code) {
		default:
			return true;
	}
	return false;
};

const game_tick = model => {
	if (model.flag_paused) return;
	model.time = (model.time + 1) % 24e3;
	model.time_f = ((model.time + 6e3) * (1 / 24e3)) % 1;

	if (
		model.flag_autoscaling &&
		model.renderer &&
		model.time % 10 === 0
	) {
		if (
			model.resolution_scaling < 100 &&
			model.renderer.fps < 20
		)
			game_scaling_set(model, model.resolution_scaling + 1);
		else if (
			model.resolution_scaling > 1 &&
			model.renderer.fps > 40
		)
			game_scaling_set(model, model.resolution_scaling - 1);
	}
};
