import {
	GAMEMODE_CREATIVE,
	MOUSE_MODE_NORMAL,
	PLAYER_INVENTORY,
} from '../etc/constants.js';
import {
	Math_cos,
	Math_max,
	Math_min,
	Math_PI,
	Math_PI_h,
	Math_sin,
} from '../etc/helpers.js';

import {
	slot_create,
} from './m_slot.js';

export const player_create = (world, account) => ({
	accel_x: 0.0,
	accel_y: 0.0,
	accel_z: 0.0,
	angle_h: 0.0,
	angle_v: 0.0,
	block_focus_face: 0,
	block_focus_x: 0,
	block_focus_y: -1,
	block_focus_z: 0,
	block_select_a: null,
	block_select_b: null,
	gamemode: GAMEMODE_CREATIVE,
	health: 20,
	inventory: new Array(PLAYER_INVENTORY)
		.fill(null)
		.map(() => slot_create(null)),
	mouse_mode: MOUSE_MODE_NORMAL,
	name: account.label || 'Spieler',
	position_x: world.spawn_x,
	position_y: world.spawn_y,
	position_z: world.spawn_z,
	rotation_h: 0.0,
	rotation_v: 0.0,
	slot_index: 0,
	slot_time: 0,
	speed_x: 0.0,
	speed_y: 0.0,
	speed_z: 0.0,
});

export const player_tick = (model, delay) => {
	const time_factor = Math_min(5, delay * .01);

	model.speed_x -= model.speed_x * .1 * time_factor;
	model.speed_y -= model.speed_y * .1 * time_factor;
	model.speed_z -= model.speed_z * .1 * time_factor;

	model.speed_x += (
		Math_cos(model.angle_h) * model.accel_x +
		Math_sin(model.angle_h) * model.accel_z
	) * time_factor;
	model.speed_y += model.accel_y * time_factor;
	model.speed_z += (
		-Math_sin(model.angle_h) * model.accel_x +
		Math_cos(model.angle_h) * model.accel_z
	) * time_factor;

	player_rotate(
		model,
		model.rotation_h * time_factor,
		model.rotation_v * time_factor
	);

	model.position_x += model.speed_x * time_factor;
	model.position_y += model.speed_y * time_factor;
	model.position_z += model.speed_z * time_factor;
}

export const player_rotate = (model, h, v) => {
	model.angle_h = (
		model.angle_h
		+ h
		+ Math_PI * 100
	) % (Math_PI * 2);

	model.angle_v = Math_max(
		-Math_PI_h,
		Math_min(
			Math_PI_h,
			model.angle_v
			+ v
		)
	);
}
