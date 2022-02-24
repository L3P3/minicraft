export const document_ = document;
const Math_ = Math;
export const Math_PI = Math_.PI;
export const Math_PI_h = Math_PI * .5;
export const Math_PI_180d = 180 / Math_PI;
export const Math_random = Math_.random;
export const Math_floor = Math_.floor;
export const Math_round = Math_.round;
export const Math_min = Math_.min;
export const Math_max = Math_.max;
export const Math_cos = Math_.cos;
export const Math_sin = Math_.sin;
export const Math_pow = Math_.pow;

export const JSON_ = JSON;
export const localStorage_ = localStorage;

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
	@return {boolean}
*/
export const handler_noop = () => false;
