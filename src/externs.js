/** @externs */
/* eslint-disable no-unused-vars */

/**
	@typedef {(!Array<string>|!Array<number>|!Array<{id: string}>|!Array<{id: number}>)}
*/
var TYPE_NODEDATA;

/**
	@typedef {(string|number|{id: (string|number)})}
*/
var TYPE_NODEDATA_ITEM;

/**
	@typedef {!Object<string, *>}
*/
var TYPE_PROPS_D;

/**
	@typedef {!Object<string, boolean>}
*/
var TYPE_PROPS_F;

/**
	@typedef {!Object<string, string>}
*/
var TYPE_PROPS_S;

/**
	@typedef {{
		C: (void|TYPE_NODELIST),
		D: (void|TYPE_PROPS_D),
		F: (void|TYPE_PROPS_F),
		R: (void|function(HTMLElement):void),
		S: (void|TYPE_PROPS_S),
		I: (void|TYPE_NODEDATA),
	}}
*/
var TYPE_PROPS;

/**
	@typedef {function(TYPE_PROPS):?TYPE_NODELIST}
*/
var TYPE_COMPONENT;

/**
	@typedef {!Object}
*/
var TYPE_NODE;

/**
	@typedef {!Array<(?TYPE_NODE|boolean)>}
*/
var TYPE_NODELIST;

var lui = {}

lui.defer = function(){}

lui.defer_end = function(){}

/**
	@param {string} handle
	@param {string} descriptor
	@param {?TYPE_PROPS=} attributes
*/
lui.dom_define = function(handle, descriptor, attributes){}

/**
	@param {boolean=} condition
	@return {void}
*/
lui.hook_assert = function(condition){}

/**
	@template T
	@param {function(...*):Promise<T>} getter
	@param {?Array=} deps
	@param {T=} fallback
	@return {T}
*/
lui.hook_async = function(getter, deps, fallback){}

/**
	@param {Function} callback
	@param {?Array=} deps
	@return {Function}
*/
lui.hook_callback = function(callback, deps){}

/**
	@param {number} msecs
	@return {boolean}
*/
lui.hook_delay = function(msecs){}

/**
	@param {string} descriptor
	@param {?TYPE_PROPS=} attributes
	@return {HTMLElement}
*/
lui.hook_dom = function(descriptor, attributes){}

/**
	@param {function(?):(void|function(?):void)} effect
	@param {?Array=} deps
	@return {void}
*/
lui.hook_effect = function(effect, deps){}

/**
	@template T
	@param {function(?):T} getter
	@param {TYPE_NODEDATA} data
	@param {?Array=} deps
	@return {T}
*/
lui.hook_map = function(getter, data, deps){}

/**
	@template T
	@param {function(?):T} getter
	@param {?Array=} deps
	@return {T}
*/
lui.hook_memo = function(getter, deps){}

/**
	@param {!Object<string, Function>} reducer
	@return {!Array}
*/
lui.hook_model = function(reducer){}

/**
	@param {!Object<string, *>} object
	@return {!Array<string>}
*/
lui.hook_object_changes = function(object){}

/**
	@template T
	@param {T} value
	@param {T=} initial
	@return {T}
*/
lui.hook_prev = function(value, initial){}

/**
	@return {void}
*/
lui.hook_rerender = function(){}

/**
	@param {*} initial
	@return {!Array}
*/
lui.hook_state = function(initial){}

/**
	@template T
	@param {T} initial
	@return {T}
*/
lui.hook_static = function(initial){}

/**
	@template T
	@param {function(?):T} getter
	@param {?Array=} deps
	@return {T}
*/
lui.hook_sub = function(getter, deps){}

/**
	@param {number} target
	@param {number} msecs
	@return {number}
*/
lui.hook_transition = function(target, msecs){}

/**
	@param {function():Array!} root
	@return {void}
*/
lui.init = function(root){}

/**
	@param {TYPE_COMPONENT} component
	@param {?TYPE_PROPS=} props
	@param {TYPE_NODELIST=} childs
	@return {TYPE_NODE}
*/
lui.node = function(component, props, childs){}

/**
	@param {string} descriptor
	@param {?TYPE_PROPS=} attributes
	@param {TYPE_NODELIST=} childs
	@return {TYPE_NODE}
*/
lui.node_dom = function(descriptor, attributes, childs){}

/**
	@param {TYPE_COMPONENT} component
	@param {TYPE_NODEDATA} data
	@param {?TYPE_PROPS=} props
	@return {TYPE_NODE}
*/
lui.node_map = function(component, data, props){}

/**
	@return {number}
*/
lui.now = function(){}

var localStorage = {
	getItem: function(){},
	setItem: function(){},
	removeItem: function(){}
}

function addEventListener(
	/** string */ eventName,
	/** function(Event) */ handler,
	/** {passive: boolean}= */ options
){}
function removeEventListener(
	/** string */ eventName,
	/** function(Event) */ handler
){}

/**
	@param {string} url
	@return {void}
*/
function open(url){}

function onbeforeinstallprompt(){}
function onbeforeunload(){}
function onblur(){}
function onfocus(){}
function onpagehide(){}
function onpageshow(){}
function onunload(){}
function onerror(error){}
function onkeydown(event){}
function oncontextmenu(){}
function ondragstart(){}
/**
	@type {function(MouseEvent)?}
*/
var onmousemove;
/**
	@type {function(MouseEvent)?}
*/
var onmousedown;
/**
	@type {function(MouseEvent)?}
*/
var onmouseup;

/**
	@type {string}
*/
var ASSETS;

/**
	@typedef {{
		p: {
			h: number,
			i: !Array<Array>,
			m: number,
			p: !Array<number>,
		},
		s: !Array<number>,
		v: number,
	}}
*/
var TYPE_WORLD_META;
