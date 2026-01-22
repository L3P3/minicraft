/** @externs */
// lui types from lui/index.d.ts
/* eslint-disable no-unused-vars */

/**
	Data mapped to a child instance's `I` prop.
	Can be a primitive (string/number) or object with id property.
	@typedef {(string|number|{id: (string|number)})}
*/
var TYPE_NODEDATA_ITEM;

/**
	Array of NodeData items for mapping over children.
	@typedef {!Array<TYPE_NODEDATA_ITEM>}
*/
var TYPE_NODEDATA;

/**
	Child instance symbol. Must not be modified but can be cached.
	@typedef {!Object}
*/
var TYPE_NODE;

/**
	List of child instance symbols.
	An entry can be replaced with `true`, `false` or `null` to skip it.
	@typedef {!Array<(?TYPE_NODE|boolean|null|void)>}
*/
var TYPE_NODELIST;

/**
	Dataset properties and their values (used in Attrs.D).
	@typedef {!Object<string, *>}
*/
var TYPE_PROPS_D;

/**
	CSS classes and their conditions (used in Attrs.F).
	@typedef {!Object<string, boolean>}
*/
var TYPE_PROPS_F;

/**
	CSS properties and their values (used in Attrs.S).
	@typedef {!Object<string, string>}
*/
var TYPE_PROPS_S;

/**
	Attributes passed to dom nodes and hooks.
	@record
*/
var TYPE_PROPS;

/**
	Nodes to be put inside the dom instance.
	@type {(void|TYPE_NODELIST)}
*/
TYPE_PROPS.prototype.C;

/**
	Dataset properties and their values.
	@type {(void|TYPE_PROPS_D)}
*/
TYPE_PROPS.prototype.D;

/**
	CSS classes and their conditions.
	@type {(void|TYPE_PROPS_F)}
*/
TYPE_PROPS.prototype.F;

/**
	Reference setter for element.
	@type {(void|function(HTMLElement):void)}
*/
TYPE_PROPS.prototype.R;

/**
	CSS properties and their values.
	@type {(void|TYPE_PROPS_S)}
*/
TYPE_PROPS.prototype.S;

/**
	Data item for mapped instances.
	@type {(void|TYPE_NODEDATA_ITEM)}
*/
TYPE_PROPS.prototype.I;

/**
	Component function type.
	View element with its own logic, its instances will have their own state.
	@typedef {function(TYPE_PROPS):?TYPE_NODELIST}
*/
var TYPE_COMPONENT;

var lui = {}

/**
	Defer rerenderings until next frame.
	@return {void}
*/
lui.defer = function(){}

/**
	Rectify deferred rerenderings now.
	@return {void}
*/
lui.defer_end = function(){}

/**
	Define a dom element for later use, like a template.
	@param {string} handle
	@param {string} descriptor - DOM descriptor using syntax: element[attr1=value][attr2=value]
	@param {?TYPE_PROPS=} attributes
	@return {void}
*/
lui.dom_define = function(handle, descriptor, attributes){}

/**
	Conditionally interrupt the instance's rendering process.
	@param {boolean=} condition
	@return {void}
*/
lui.hook_assert = function(condition){}

/**
	Wait for data until it is available.
	Until then the fallback will be returned if specified.
	@template T
	@param {function(...*):!Promise<T>} getter
	@param {?Array=} deps
	@param {T=} fallback
	@return {T}
*/
lui.hook_async = function(getter, deps, fallback){}

/**
	Returns a persistent function to prevent pointless updates.
	@param {!Function} callback
	@param {?Array=} deps
	@return {!Function}
*/
lui.hook_callback = function(callback, deps){}

/**
	Turns `true` after the specified delay.
	@param {number} msecs
	@return {boolean}
*/
lui.hook_delay = function(msecs){}

/**
	Alternative to a single `node_dom` wrapping the returned childs.
	Must not be skipped if present.
	@param {string} descriptor
	@param {?TYPE_PROPS=} attributes
	@return {!HTMLElement}
*/
lui.hook_dom = function(descriptor, attributes){}

/**
	Call a function and redo it on deps change.
	Unmount function can be returned.
	@param {function(?):((void|function(?):void))} effect
	@param {?Array=} deps
	@return {void}
*/
lui.hook_effect = function(effect, deps){}

/**
	hook_sub over variable-length array items.
	@template T
	@param {function(TYPE_NODEDATA_ITEM):T} getter
	@param {TYPE_NODEDATA} data
	@param {?Array=} deps
	@return {!Array<T>}
*/
lui.hook_map = function(getter, data, deps){}

/**
	Transform data and redo it on deps change.
	@template T
	@param {function(...*):T} getter
	@param {?Array=} deps
	@return {T}
*/
lui.hook_memo = function(getter, deps){}

/**
	Model state with set of methods.
	Methods object must include `init` returning the initial state.
	@template T
	@param {!Object<string, !Function>} reducer
	@return {!Array<T|!Object<string, function(...*):T>>}
*/
lui.hook_model = function(reducer){}

/**
	List of changed properties since previous rendering.
	@param {!Object<string, *>} object
	@return {!Array<string>}
*/
lui.hook_object_changes = function(object){}

/**
	Returns the value from previous rendering.
	@template T
	@param {T} value
	@param {T=} initial
	@return {T}
*/
lui.hook_prev = function(value, initial){}

/**
	Request rerendering for the next display refresh.
	@return {void}
*/
lui.hook_rerender = function(){}

/**
	Simple state containment.
	Returns [value, setter, getter] tuple.
	@template T
	@param {T=} initial
	@return {!Array<T|function(T):T|function():T>}
*/
lui.hook_state = function(initial){}

/**
	Returns the value from first rendering.
	@template T
	@param {T} initial
	@return {T}
*/
lui.hook_static = function(initial){}

/**
	hook_memo with switchable getter and contained hooks support.
	@template T
	@param {function(...*):T} getter
	@param {?Array=} deps
	@return {T}
*/
lui.hook_sub = function(getter, deps){}

/**
	Transitions value over given delay.
	@param {number} target
	@param {number} msecs
	@return {number}
*/
lui.hook_transition = function(target, msecs){}

/**
	Mounts root component on document's body or whatever root element specified.
	@param {TYPE_COMPONENT} root
	@param {HTMLElement=} dom
	@param {?TYPE_PROPS=} props
	@return {void}
*/
lui.init = function(root, dom, props){}

/**
	Component instantiation.
	@param {TYPE_COMPONENT} component
	@param {?TYPE_PROPS=} props
	@param {TYPE_NODELIST=} childs
	@return {TYPE_NODE}
*/
lui.node = function(component, props, childs){}

/**
	DOM element instantiation.
	@param {string} descriptor
	@param {?TYPE_PROPS=} attributes
	@param {TYPE_NODELIST=} childs
	@return {TYPE_NODE}
*/
lui.node_dom = function(descriptor, attributes, childs){}

/**
	Dynamic component instantiation from data array.
	@param {TYPE_COMPONENT} component
	@param {TYPE_NODEDATA} data
	@param {?TYPE_PROPS=} props
	@return {TYPE_NODE}
*/
lui.node_map = function(component, data, props){}

/**
	Reference time of current rendering.
	@return {number}
*/
lui.now = function(){}

var localStorage = {
	/**
		@param {string} key
		@return {?string}
	*/
	getItem: function(key){},
	/**
		@param {string} key
		@param {string} value
		@return {void}
	*/
	setItem: function(key, value){},
	/**
		@param {string} key
		@return {void}
	*/
	removeItem: function(key){}
}

/**
	@param {string} eventName
	@param {function(!Event):*} handler
	@param {(boolean|{passive: boolean})=} options
	@return {void}
*/
function addEventListener(eventName, handler, options){}

/**
	@param {string} eventName
	@param {function(!Event):*} handler
	@param {boolean=} options
	@return {void}
*/
function removeEventListener(eventName, handler, options){}

/**
	@param {string} url
	@return {?Window}
*/
function open(url){}

/** @return {void} */
function close(){}

/** @return {void} */
function focus(){}

// Window event handlers
/** @type {function(!Event):*} */
function onbeforeinstallprompt(){}

/** @type {function(!Event):*} */
function onbeforeunload(){}

/** @type {function(!Event):*} */
function onblur(){}

/** @type {function(!Event):*} */
function onfocus(){}

/** @type {function(!Event):*} */
function onpagehide(){}

/** @type {function(!Event):*} */
function onpageshow(){}

/** @type {function(!Event):*} */
function onunload(){}

/** @type {function(!Event):*} */
function onerror(error){}

/** @type {function(!KeyboardEvent):*} */
function onkeydown(event){}

/** @type {function(!Event):*} */
function oncontextmenu(){}

/** @type {function(!Event):*} */
function ondragstart(){}

/** @type {function(!MouseEvent):*} */
var onmousemove;

/** @type {function(!MouseEvent):*} */
var onmousedown;

/** @type {function(!MouseEvent):*} */
var onmouseup;

/** @type {function():*} */
var onresize;

/** @type {boolean} */
var SSR;

/**
	World metadata structure.
	@typedef {{
		p: {
			h: number,
			i: !Array<!Array<*>>,
			m: number,
			p: !Array<number>,
		},
		s: !Array<number>,
		t: number,
		v: number,
	}}
*/
var TYPE_WORLD_META;

/**
	Local world listing entry.
	@typedef {{
		id: number,
		label: string,
		mod_l: number,
		mod_r: number,
	}}
*/
var TYPE_WORLD_LISTING_LOCAL;

/**
	Remote world listing entry.
	@typedef {{
		account_name: string,
		hash: number,
		id: number,
		label: string,
		modified: number,
		public: boolean,
		writable: boolean,
	}}
*/
var TYPE_WORLD_LISTING_REMOTE;

/**
	World API request/response.
	@typedef {{
		data: !Object<string, *>,
		label: string,
		what: string,
		world: number,
	}}
*/
var TYPE_WORLD_API;

/**
	Chat API message.
	@typedef {{
		msg: string,
	}}
*/
var TYPE_CHAT_API;

/**
	Texture pack item.
	@typedef {{
		id: number,
		label: string,
		owner: string,
	}}
*/
var TYPE_TEXTURES_ITEM;

/**
	Initial server response.
	@typedef {{
		account: {
			label: string,
			rank: number,
		},
		worlds: !Array<TYPE_WORLD_LISTING_REMOTE>,
		version_latest: string,
	}}
*/
var TYPE_RESPONSE_INITIAL;

/**
	CSS classes state for UI.
	@typedef {{
		busy: boolean,
		window: boolean,
		borders: boolean,
	}}
*/
var TYPE_CSS_CLASSES;

/**
	IndexedDB chunk storage structure.
	@typedef {{
		world: number,
		coords: string,
		data: string,
	}}
*/
var TYPE_INDEXEDDB_CHUNK;
