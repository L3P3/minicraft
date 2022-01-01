import {
	CHUNK_HEIGHT,
	CHUNK_WIDTH,
} from '../etc/constants.js';

export const player_create = () => ({
	accel_x: 0,
	accel_y: 0,
	accel_z: 0,
	position_x: CHUNK_WIDTH / 2,
	position_y: 30,
	position_z: CHUNK_WIDTH / 2,
	speed_x: 0,
	speed_y: 0,
	speed_z: 0,
	angle_h: 0.0,
	angle_v: 0.0,
});
