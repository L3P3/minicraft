# lui: a minimal introduction

Minicraft uses [lui.js](https://github.com/L3P3/lui), a small, dependency-free UI library written by the same author. Its README describes function components, stateful hooks, declarative nodes, and optional server-side rendering. Read the [lui README](https://github.com/L3P3/lui/blob/master/README.md) for the complete API; this page only covers the pieces a Minicraft contributor will meet first.

## Component and node model

A component is a function of props that returns a list of child nodes. `node(Component, props)` embeds another component; `node_dom(descriptor, props, children)` describes native DOM elements. A descriptor looks like `div[className=game]`. `node_map(Component, items, props)` mounts a component for each item in a variable-length or reorderable list.

Minicraft's `src/etc/lui.js` re-exports the library API used by the app. The `c_*` files use these helpers rather than JSX. Examples:

- `src/game/c_app.js`: returns nodes to switch between app views.
- `src/game/c_game.js`: owns the game model via hooks and declares conditional HUD/menu nodes.
- `src/game/c_inventory.js`: uses `node_map` for inventory items.

## Hooks and ordering

Hooks such as `hook_state`, `hook_effect`, `hook_memo`, and `hook_static` are called directly in component functions. Stateful hooks are associated by call order, so keep their call order stable: do not put them in a conditional branch or loop. Use `hook_effect` for lifecycle side effects such as adding/removing event listeners, and return cleanup functions where needed.

In this codebase, `hook_dom` obtains or configures the root element for a component, while `hook_rerender` asks for another render. `hook_effect` also appears without explicit dependencies when an effect should run after each render. Consult lui's README for precise semantics and the full API.

## DOM props used here

Most DOM props map to DOM attributes. Four shorthand props are common:

| Prop | Meaning |
| --- | --- |
| `C` | Child nodes |
| `D` | `dataset` values |
| `F` | Boolean CSS classes |
| `R` | Callback receiving the created element |
| `S` | Inline style values |

Static attributes are often placed in the descriptor, such as `button[disabled]`; dynamic values are passed as props. Component lists whose items can move or change length should use `node_map`, not a hand-built sequence of `node` calls.

## Runtime and build integration

The development HTML loads `node_modules/lui/src/luirt.js` before `src/app.js`. The app imports `lui` symbols through `src/etc/lui.js`, whose type annotation references `lui/index`. The build temporarily changes that annotation for Closure Compiler and restores it after a local build. The production HTML also loads the lui runtime separately.

The package manifest lists `lui` as a GitHub development dependency and `lui-ssr` as a dependency. The build script uses the latter for the optional server-rendered variant. See [build.md](build.md) for how the variants are produced.
