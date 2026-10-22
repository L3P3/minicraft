# Code structure and design

The project deliberately avoids classes. As the [root README](../README.md#paradigms) puts it, `m_*` files contain functions operating on plain “struct” objects, `c_*` files contain declarative lui components, and `etc/` contains shared utilities. The main domain models are created as object literals in `m_game.js`, `m_player.js`, and `m_world.js`; behavior is expressed as exported functions that receive those models.

## Naming and formatting

- Component files use the `c_` prefix; model/logic modules use `m_`; shared code lives in `src/etc/`.
- Functions and properties generally use `snake_case`; constants use uppercase names such as `CHUNK_WIDTH`.
- Source uses tabs for indentation and trailing commas in multiline object/argument lists.
- `constants.js` centralizes block types, keys, gamemodes, dimensions, and UI modes.
- `locale_` values are generated from CSV files. Edit `locales/*.csv`, not the generated locale module.
- Several files include Closure Compiler type annotations and `@noinline` hints. Preserve meaningful annotations: the production build enables advanced optimization and type-based optimization.

## Browser compatibility

Compatibility is handled explicitly rather than by a separate runtime framework. `src/etc/helpers.js` captures browser APIs behind aliases and provides an XHR-based `fetch_` fallback when the legacy build is active and native `fetch` is unavailable. Input/window code also branches for browser capabilities such as `BroadcastChannel`, `visualViewport`, and touch input.

`build.js` emits a legacy JavaScript bundle with an ECMAScript 3 output target, alongside the standard modern bundle and an SSR variant. `src/etc/env.js` is build-generated and selects `LEGACY`, `SSR`, debug, version, language, and API roots; do not assume the checked-in development values represent production.

## UI and model boundaries

UI components call model functions and pass ordinary data/handlers through props. `c_game.js` connects DOM events to `m_game.js`; `m_game.js` coordinates `m_player.js`, `m_world.js`, and `m_renderer.js`. `etc/state.js` owns app-level reducer actions, while world data persistence and network synchronization are separate modules. That separation gives newcomers a useful map, although UI and model state are intentionally coupled in places—for example, the game component owns the model lifecycle and renderer initialization.

## Compatibility, constraints, and unfinished features

The implementation favors compact browser-native tools: typed arrays for blocks, canvas 2D for rendering, IndexedDB/localStorage for saves, and a custom lightweight UI library. The README lists collision, multiplayer, dynamic lighting, sound, and world edit as unfinished. Touch controls exist, but the README still calls for a better mobile experience. Treat these as declared project limitations rather than inferring absent behavior from an empty UI path.

For practical workflows, start with [architecture.md](architecture.md), then [raycaster.md](raycaster.md), [storage.md](storage.md), and [api.md](api.md). The library-specific primer is [lui.md](lui.md); build commands and generated variants are covered in [build.md](build.md).
