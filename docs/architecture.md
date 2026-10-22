# Architecture

## Runtime graph

```text
app-dev.html / app-prod.html
  └─ lui runtime + src/app.js (or generated dist bundle)
      └─ app.js: Root
          ├─ global browser events, app state, storage and remote-world startup
          └─ os/c_window.js: Window
              └─ game/c_app.js: App
                  ├─ game/c_menu_start.js: world list and world actions
                  ├─ game/c_settings.js: app settings
                  └─ game/c_game.js: active game surface and game UI
                      ├─ game/m_game.js: game model, controls, commands, orchestration
                      ├─ game/m_player.js: player state and movement
                      ├─ game/m_world.js: voxel data, chunks, time and local world saves
                      ├─ game/m_renderer.js: CPU raycaster and canvas output
                      └─ c_bar, c_inventory, c_messages, c_settings,
                         c_terminal, c_touch: HUD and in-game controls
```

The graph shows the main route, not every import. The top-level app is a windowed browser application: it starts with one full-screen game window, but the initial `App` view is the world list. See [`src/etc/state.js`](../src/etc/state.js) for initial app state, [`src/app.js`](../src/app.js) for boot and global handlers, and [`src/os/c_window.js`](../src/os/c_window.js) for window behavior.

## What each node owns

| Node | Responsibility |
| --- | --- |
| `app-dev.html` / `app-prod.html` | HTML shells; load CSS, the lui runtime, and development source or production bundle. |
| `src/app.js` — `Root` | Initializes app state and world storage/sync; installs resize, keyboard, touch, unload, and single-instance handling; mounts windows. |
| `src/etc/state.js` | App configuration and reducer-style actions for windows and world-list state. |
| `src/etc/storage.js` | Browser persistence adapter: IndexedDB chunks with localStorage fallback; metadata remains in localStorage. |
| `src/game/m_world_store.js` | Remote world-list loading, local/remote list merge, conflict detection, and synchronization. |
| `src/os/c_window.js` — `Window` | Floating/fullscreen window state, drag/resize, focus, and viewport dimensions; renders an `App`. |
| `src/game/c_app.js` — `App` | Switches between worlds, app settings, and gameplay. |
| `src/game/c_menu_start.js` — `MenuStart` | Selects, creates, renames, deletes, downloads, uploads, and configures worlds. |
| `src/game/c_game.js` — `Game` | Owns the game model lifecycle and browser input listeners; triggers game rendering and presents the game UI. |
| `src/game/m_game.js` | Coordinates player, world, and renderer; maps input to actions; handles terminal commands and chat polling. |
| `src/game/m_player.js` | Plain-object player model and movement/rotation math. |
| `src/game/m_world.js` | Block indexing, chunk-window movement/loading, world time, chunk serialization, and player/world metadata. |
| `src/game/m_renderer.js` | Reads world blocks, ray-marches each output pixel, applies texture/shading/reflection rules, and paints a 2D canvas. |
| `src/game/c_bar.js`, `c_inventory.js`, `c_messages.js`, `c_settings.js`, `c_terminal.js`, `c_touch.js` | Declarative HUD, inventory, message, settings, terminal, and touch-control components. |
| `src/etc/constants.js`, `helpers.js`, `locale.js`, `textures.js`, `lz.js`, `env.js` | Shared constants, browser compatibility wrappers, generated translations, texture IDs, compression, and build-time environment values. |
| `build.js` | Generates language/environment variants and compiles JavaScript and CSS for distribution. |

## Runtime loop

`c_game.js` calls `game_render` as lui rerenders with a new `now()` value. `game_render` advances player motion when unpaused and asks the renderer to draw. Separately, `game_create` starts a 50 ms interval that advances world time while unpaused. The renderer also calls `world_microtick`, which updates the loaded chunk window around the player. This is therefore not a single conventional `requestAnimationFrame` loop: UI scheduling drives drawing, while a timer drives world time.

The player and world are ordinary objects manipulated by functions in `m_*` modules. `c_*` modules declare UI and connect browser events to those model functions. This split is explicitly described in the [root README](../README.md#paradigms).

## Useful first stops

- [`src/game/c_game.js`](../src/game/c_game.js): the bridge between browser input/UI and simulation.
- [`src/game/m_game.js`](../src/game/m_game.js): central game orchestration and command behavior.
- [`src/game/m_renderer.js`](../src/game/m_renderer.js): rendering algorithm.
- [`src/game/m_world.js`](../src/game/m_world.js): in-memory voxel and chunk layout.
- [`src/etc/state.js`](../src/etc/state.js), [`src/etc/storage.js`](../src/etc/storage.js), and [`src/game/m_world_store.js`](../src/game/m_world_store.js): app state, local persistence, and remote sync respectively.

Remote API details are in [api.md](api.md); the local data model is in [storage.md](storage.md).
