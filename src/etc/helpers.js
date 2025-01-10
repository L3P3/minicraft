import {
	locale_today,
} from '../etc/locale.js';

export const window_ = window;
export const document_ = document;
export const navigator_ = navigator;
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

export const BroadcastChannel_ = window_.BroadcastChannel;
const Date_ = Date;
export const Date_now = () => Date_.now();
const JSON_ = JSON;
export const Promise_ = Promise;
export const JSON_stringify = JSON_.stringify;
export const JSON_parse = JSON_.parse;
export const localStorage_ = localStorage;
export const localStorage_getItem = key => localStorage_.getItem(key);
export const localStorage_setItem = localStorage_.setItem.bind(localStorage_);
export const localStorage_removeItem = localStorage_.removeItem.bind(localStorage_);
export const indexedDB_ = window_.indexedDB;
export const fetch_ = fetch;
export const Error_ = msg => new Error(msg);
export const Uint8Array_ = Uint8Array;
export const Uint32Array_ = Uint32Array;
export const Set_ = Set;
export const Map_ = Map;
export const Number_ = Number;
export const Object_ = Object;
export const Object_keys = Object_.keys;
export const Object_entries = Object_.entries;
export const setTimeout_ = setTimeout;
export const setInterval_ = setInterval;
export const clearTimeout_ = clearTimeout;
export const clearInterval_ = clearInterval;
export const addEventListener_ = addEventListener;
export const removeEventListener_ = removeEventListener;
export const flag_chromium = navigator_.userAgent.includes('WebKit');

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
	@param {number} num
	@return {number}
*/
export const number_square = num => (
	num * num
);

/**
	@noinline
*/
export const touch_id_get = event => event.changedTouches[0].identifier;

/**
	@return {boolean}
*/
export const handler_noop = () => false;

export const datify = (time, short) => {
	const date_now = new Date_();
	const date_then = new Date_(time);

	const diff = date_now - date_then;

	if (diff < 59e3) return Math_round(diff / 1e3) + 's';
	if (diff < 3e6) return Math_round(diff / 6e4) + 'm';

	const year = date_then.getFullYear();
	const month = date_then.getMonth();
	const date = date_then.getDate();

	let result = '';

	if (year < date_now.getFullYear()) {
		result = year + '/';
	}
	if (
		result ||
		month < date_now.getMonth()
	) {
		result += (month + 1) + '/';
	}
	if(
		result ||
		date < date_now.getDate()
	) {
		result += date;
	}

	if (short) return result || locale_today;
	if (result) result += '/';

	return result + date_then.getHours() + ':' + number_padStart2(date_then.getMinutes(), '0');
}
