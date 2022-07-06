/**
	Type definitions for lui
	@author Johann Laur <jl.01@icloud.com>
	@author L3P3 <dev@l3p3.de>
*/

declare namespace lui {
	/**
		Data mapped to a child instance's `I` prop
	*/
	type NodeData = (string | number | { id: (string | number) });

	/**
		Child instance symbol, must not be modified but can be cached
	*/
	interface LuiNode {}

	/**
		List of child instance symbols, an entry can be replaced with `true`, `false` or `null` to skip it
	*/
	type LuiNodeList = (LuiNode | boolean | null | void)[];

	/**
		Descriptor for dom elements using following syntax:
		`element[attr1=value][attr2=value]`
	*/
	type DomDescriptor = string;

	/**
		Attributes passed to dom hooks
	*/
	interface Attrs extends Omit<Partial<HTMLElement>, 'style'> {
		/**
			dataset properties and their values
		*/
		D?: { [key: string]: any },
		/**
			CSS classes and their conditions
		*/
		F?: { [key: string]: boolean },
		/**
			CSS properties and their values
		*/
		S?: Partial<Record<Exclude<keyof CSSStyleDeclaration, number>, string | null>>,
		/**
			CSS properties as string
		*/
		style?: string
	}

	/**
		Attributes passed to dom nodes
	*/
	interface AttrsNode extends Attrs {
		/**
			Nodes to be put inside the dom instance
		*/
		C?: LuiNodeList,
		/**
			Reference setter for element
		*/
		R?: (element: HTMLElement) => void
	}

	/**
		View element with its own logic, its instances will have their own state
	*/
	type Component<T extends {}> = (props: T) => LuiNodeList | null;

	/**
		Defer rerenderings until next frame
	*/
	export function defer(): void;

	/**
		Rectify deferred rerenderings now
	*/
	export function defer_end(): void;

	/**
		Conditionally interrupt the instance's rendering process
	*/
	export function hook_assert(condition: boolean): void;

	/**
		Wait for data until it is available, until then the fallback will be returned if specified
	*/
	export function hook_async<T, U extends any[]>(getter: (...deps: U) => Promise<T>, deps?: U, fallback?: T): T;

	/**
		Returns a persistent function to prevent pointless updates
	*/
	export function hook_callback<T extends any[], U extends any[], V>(callback: (...depsargs: [...U, ...T]) => V, deps?: U): (...args: T) => V;

	/**
		Turns `true` after the specified delay
	*/
	export function hook_delay(msecs: number): boolean;

	/**
		Alternative to a single `node_dom` wrapping the returned childs, must not be skipped if present
	*/
	export function hook_dom(descriptor: DomDescriptor, attrs?: Attrs): HTMLElement;

	/**
		Call a function and redo it on deps change, _unmount_ function can be returned
	*/
	export function hook_effect<T extends any[]>(callback: (...deps: T) => (void | ((...deps: T) => void)), deps?: T): void;

	/**
		hook_sub over variable-length array items
	*/
	export function hook_map<T extends any[], U extends NodeData, V>(getter: (item: U, ...deps: T) => V, data: U[], deps?: T): V[]

	/**
		Transform data and redo it on deps change
	*/
	export function hook_memo<T extends any[], U>(getter: (...deps: T) => U, deps?: T): U;

	/**
		Model state with set of methods, `init` returning the initial state
	*/
	export function hook_model<T, U extends {
		init: () => T,
		[key: string]: (current?: T, arg?: any) => T
	}>(mutations: U): [value: T, methods: {
		[method in keyof U]: (arg?: Parameters<U[method]>[1]) => void
	}];

	/**
		List of changed properties since previous rendering
	*/
	export function hook_object_changes(object: Object): string[];

	/**
		Returns the value from previous rendering
	*/
	export function hook_prev<T>(value: T, initial?: T): T;

	/**
		Request rerendering for the next display refresh
	*/
	export function hook_rerender(): void;

	/**
		Simple state containment
	*/
	export function hook_state<T>(initial?: T): [value: T, setter: (value: T) => void, getter: () => T];

	/**
		Returns the value from first rendering
	*/
	export function hook_static<T>(initial: T): T;

	/**
		hook_memo with switchable getter and contained hooks support
	*/
	export function hook_sub<T extends any[], U>(getter: (...deps: T) => U, deps?: T): U;

	/**
		Transitions value over given delay
	*/
	export function hook_transition(target: number, msecs: number): number;

	/**
		Mounts root component on document's body
	*/
	export function init(body: () => [bodyProps: Attrs | null, bodyContent: LuiNodeList]): void;

	/**
		Component instantiation
	*/
	export function node<T extends {}>(component: Component<T>, props?: T | null, children?: LuiNodeList): LuiNode;

	/**
		DOM element instantiation
	*/
	export function node_dom(descriptor: DomDescriptor, attrs?: AttrsNode | null, children?: LuiNodeList): LuiNode;

	/**
		Dynamic component instantiation from data array
	*/
	export function node_map<T extends NodeData, U extends {}>(component: Component<U & { I: T }>, data: T[], props?: U): LuiNode;

	/**
		Reference time of current rendering
	*/
	export function now(): number;
}

export = lui;
