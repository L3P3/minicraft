# Remote API and network behavior

The server implementation is not in this repository. This guide documents the client-side requests visible in `src/etc/env.js`, `src/game/m_world_store.js`, `src/game/m_game.js`, `src/game/c_menu_start.js`, and `src/game/c_settings.js`; request/response details beyond those call sites must be confirmed against the server.

## Base URLs

`src/etc/env.js` defines `API` and `API_DATA`. In the checked-in development configuration, they are protocol-relative URLs for `l3p3.de`:

- `API`: `//l3p3.de/api/minicraft/`
- `API_DATA`: `//l3p3.de/static/minicraft/`

`build.js` writes production values using same-origin paths (`/api/minicraft/` and `/static/minicraft/`) and development values using the host above. The build replaces `src/etc/env.js` for each output variant; see [build.md](build.md).

## Requests observed in the client

| Purpose | Request | Client behavior |
| --- | --- | --- |
| Initial account/world data | `GET API + world?what=initial` | Reads account information and remote world listings. In a non-development build it compares `version_latest` to the app version and reloads if they differ. |
| Refresh world metadata | `GET API + world?what=meta_all` | Replaces the remote listing and merges it with local world metadata. |
| Download a world | `GET API_DATA + worlds/{hash}.json` | Parses the response as a map of world metadata and chunk payload strings, then stores it locally. |
| Register a world for upload | `POST API + world`, JSON `{what: "meta", label}` | Reads the newly assigned remote world ID, renames local world storage to that ID, then uploads the data. |
| Upload world data | `POST API + world`, JSON `{what: "data", world, data}` | Sends all locally stored world metadata/chunks; updates the local/remote modification timestamps from the response. |
| Edit world metadata | `POST API + world`, JSON `{what: "meta", world, ...}` | Used for label, lock, and public/private changes. |
| Delete remote world | `DELETE API + world`, JSON `{what: "world", world}` | Deletes the selected remote world and refreshes the listing. |
| Get texture catalog | `GET API_DATA + textures.json` | Used by settings to list available texture sets. |
| Download a texture image | `GET API_DATA + textures/{id}.png` | Loaded by the renderer; image pixels are copied into a typed array. |
| Chat poll/send | `GET API_CHAT`; `POST API_CHAT`, JSON `{msg}` | Polls roughly every five seconds; successful returned lines beginning with `<` are displayed. |

The exact URL assembly and response parsing are in [`src/game/m_world_store.js`](../src/game/m_world_store.js), [`src/game/c_menu_start.js`](../src/game/c_menu_start.js), [`src/game/c_settings.js`](../src/game/c_settings.js), and [`src/game/m_renderer.js`](../src/game/m_renderer.js). Chat URL selection is in [`src/etc/constants.js`](../src/etc/constants.js); polling is in [`src/game/m_game.js`](../src/game/m_game.js).

## World synchronization

Local and remote listings are merged using IDs and modification timestamps. Local metadata tracks a local modification time and the last synchronized remote time; remote listings provide their modification time. If both sides changed after the recorded sync time, the client asks the user to resolve a conflict. Otherwise it downloads when the remote timestamp is newer or uploads when the local timestamp is newer and the remote world is writable/unlocked.

This is world-file synchronization, not shared live simulation. README marks multiplayer as unfinished. Chat is a separate HTTP poll/send path, not evidence of multiplayer world state.

## Authentication and failure boundaries

The client reads an account object from the initial response and uses its rank to enable some UI actions. Login itself navigates to `/account?redir=minicraft`; no credential exchange or server authorization code is present here. Network errors are caught in several UI/sync paths and surfaced as connection or operation errors. The exact authorization, validation, retention, and API compatibility guarantees are outside this repository.
