# lui: a minimal introduction

minicraft's UI is driven by [lui](https://github.com/L3P3/lui). You can think of it as [functional React](https://react.dev/learn/your-first-component#defining-a-component) without JSX. This page only covers its features that are most relevant to minicraft.

The `c_*` files contain component definitions. Examples:

- `src/game/c_app.js`: returns nodes to switch between app views.
- `src/game/c_game.js`: owns the game model via hooks and declares conditional HUD/menu nodes.
- `src/game/c_messages.js`: uses `node_map` to show a varying number of messages.

## Component and node model

A component on JavaScript level is written as a branch-less [pure function](https://en.wikipedia.org/wiki/Pure_function) which gets props and returns a _stable_ tree of child nodes. A node can be one of:
- `node(Component, props)`: another component.
- `node_dom(descriptor, props, children)`: native DOM element. A descriptor looks like `div[className=game]`.
- `node_map(Component, items, props)`: one component per item in a _dynamic_ array.

_Stable_ array's order and length will not change per component lifetime. _Dynamic_ array's order or length may change per component lifetime.

## Hooks and ordering

[Hooks](https://react.dev/reference/react/hooks) such as `hook_state`, `hook_effect` and `hook_memo` allow us state and side-effects. They are called directly in component functions only and must be _stable_ in call order; component bodies must not contain conditionals or loops.

For any procedural stuff with side effects, use `hook_effect` and return cleanup functions where needed. When dependencies are provided, the effect will re-run every time when they change.

`hook_dom` wraps the returned nodes in a root element.

## DOM attributes

Most DOM props map to DOM attributes, except for the following special props:

| Prop | Meaning |
| --- | --- |
| `D` | `dataset` definitions |
| `F` | Active CSS classes |
| `R` | Callback receiving the created element |
| `S` | `style` definitions (as the `style` prop must be a string) |

Attributes that never change are placed in the descriptor, the latter must also never change in a component's lifetime.

## Importing from lui

lui is loaded separately at runtime ("dynamically linked") and our `src/etc/lui.js` re-exports it for our use. lui itself is only a `package.json` dependency for IDE's type-checker and running minicraft via `app-*.html`; for building, it is not needed.
