export const document_ = document;
const Math_ = Math;
export const Math_PI = Math_.PI;
export const Math_PI_h = Math_PI * .5;
export const Math_PI_180d = 180 / Math_PI;
export const Math_random = Math_.random;
export const Math_floor = Math_.floor;
export const Math_ceil = Math_.ceil;
export const Math_round = Math_.round;
export const Math_min = Math_.min;
export const Math_max = Math_.max;
export const Math_cos = Math_.cos;
export const Math_sin = Math_.sin;
export const Math_sqrt = Math_.sqrt;
export const Math_log2 = Math_.log2;
export const String_fromCharCode = String.fromCharCode;

export const JSON_ = JSON;
export const localStorage_ = localStorage;
export const Uint8Array_ = Uint8Array;
export const Uint32Array_ = Uint32Array;
export const Map_ = Map;
export const setTimeout_ = setTimeout;
export const setInterval_ = setInterval;
export const clearInterval_ = clearInterval;

/**
	@param {number} num
	@return {string}
	@noinline
*/
export const number_toFixed2 = num => num.toFixed(2);

/**
	@param {number} num
	@param {string=} pad
	@return {string}
	@noinline
*/
export const number_padStart2 = (num, pad) => (
	Math_floor(num)
	.toString()
	.padStart(2, pad)
);

/**
	@noinline
*/
export const touch_id_get = event => event.changedTouches[0].identifier;

/**
	@return {boolean}
*/
export const handler_noop = () => false;
