# Remote API and network behavior

This guide describes the minicraft client and its companion server routes. It describes the current implementation, not a separately versioned API contract.

## URLs and routing

`src/etc/env.js` defines the client base URLs. The checked-in development values are protocol-relative `//l3p3.de/api/minicraft/` and `//l3p3.de/static/minicraft/`; production builds use same-origin `/api/minicraft/` and `/static/minicraft/` paths (see [build.md](build.md)). The server exposes these public routes:

| Public path | Purpose |
| --- | --- |
| `/api/minicraft/world` | World metadata and data API |
| `/api/chat` | HTTP chat poll/send |
| `/account` | HTML registration, login, and account page |
| `/static/minicraft/...` | Client builds, texture catalog/images, and world snapshots |

API requests use the browser's `fetch`; JSON POSTs set `Content-Type: application/json`. Successful world API responses are JSON. The client helper parses successful responses as JSON and rejects non-2xx responses.

## World API

All world operations use `/api/minicraft/world`. The handler switches on the request method and `what` field. Query parameters are used for GET; POST and DELETE clients send JSON bodies. Timestamps are Unix epoch milliseconds. IDs are numeric; the GET handler parses `world` as an integer.

### Read operations

| Request | Success response | Notes |
| --- | --- | --- |
| `GET /api/minicraft/world?what=initial` | `{ account: { label, rank }, worlds: [...], version_latest }` | Initial account display/rank and visible listing. The client reloads when a non-`dev` build's version differs from `version_latest`. |
| `GET /api/minicraft/world?what=meta_all` | Array of world metadata objects | Refreshes the listing only. |
| `GET /api/minicraft/world?what=meta&world={id}` | One world metadata object | Requires read access. |
| `GET /api/minicraft/world?what=data&world={id}` | `302` with `Location: /static/minicraft/worlds/{hash}.json` | Redirects to the full stored world JSON after access checking. |
| `GET /api/minicraft/world?what=data_chunk&world={id}&chunk={key}` | Stored value for the key, or `""` if absent | `chunk` must be non-empty and contain `/`. |

Metadata objects have the shape `{ account_name, admins, hash, id, label, locked, modified, public, writable }`. `admins` is either `null` or an array of account IDs. The `hash` identifies the world snapshot; `modified` is its last content-change time.

For rank 0 (guest), the listing contains public worlds only. Rank 1 and rank 2 listings contain all worlds. Other signed-in accounts see public worlds plus worlds they own or administer. A listing is not itself an authorization grant: an individual private-world read still requires rank 1, ownership, public visibility, or (for read access) membership in the admins list.

### Create, update, delete

Send JSON bodies to `/api/minicraft/world`:

| Method/body | Result |
| --- | --- |
| `POST { "what":"meta", "label":"...", "public":false, "locked":false }` | Creates a world and returns `{ "id": number }`. Omit `world` to create. The server applies an account world-count limit. |
| `POST { "what":"meta", "world":id, "label":"...", "public":true, "locked":false, "admins":[...] }` | Updates only fields provided and returns `{}`. `label` must be a string no longer than 16 characters; it is trimmed before storage. `public` and `locked` are coerced to booleans. If present, `admins` must be an array of numbers. |
| `POST { "what":"data", "world":id, "data":worldObject }` | Replaces the world data and returns the updated metadata object. `data` must be truthy. |
| `POST { "what":"data_chunk", "world":id, "chunk":"group/key", "data":value }` | Reads the current world object, replaces/adds that property, saves the resulting object, and returns `{ hash, modified }`. `chunk` must contain `/`; `data` must be truthy. |
| `DELETE { "what":"world", "world":id }` | Deletes metadata and returns JSON `null`. |

POST and DELETE are unavailable to guests. A world-data write is permitted to the owner, a world administrator, or a server administrator. Metadata edits and deletion are permitted to the owner or a server administrator. Public status grants read access, not write access. Invalid methods/`what`, malformed IDs, chunk keys/data, or metadata fields produce 400; unknown worlds produce 404; failed authorization produces 403.

### How the bundled client syncs

The client first fetches `initial`, then refreshes with `meta_all`. It compares local `mod_l`, last-synced `mod_r`, and remote `modified`. If both local and remote changed after the last sync, it asks which version to keep. Otherwise, a newer remote snapshot is fetched from `/static/minicraft/worlds/{hash}.json`; local-newer data is uploaded. A new local world is registered first with `POST meta`, local storage is renamed to the returned ID, then all data is sent with `POST data`. A successful upload sets both local sync timestamps from the returned `modified` value.

The snapshot is a JSON object of string-keyed entries, including `meta` and chunk payloads. The API supports whole snapshots and individual chunk properties; the bundled client uses whole snapshots. Synchronization is file transfer, not shared real-time simulation; multiplayer remains unfinished. Chat is independent of world synchronization.

## Chat API

The client polls about every five seconds with `GET /api/chat` and sends `POST /api/chat` with JSON `{ "msg": "..." }`.

- Optional `since` is a numeric timestamp in milliseconds. Invalid numeric input returns 400. Without it, the server starts after that user's previous poll.
- `msg` is truncated to 300 characters and displayed as `<name> message`. Repeating an identical message longer than 10 characters when it matches one of the last five messages adds `error: spam` instead of posting it.
- The response is plain text: zero or more newline-separated chat/status lines, not JSON. It can include `join: ...`, `leave: ...`, and `users: ...`; the game client displays only lines beginning with `<` as chat messages.
- Guests can use chat. The current account/alias supplies the displayed name.

## Surface catalog and uploads

The client fetches `GET /static/minicraft/textures.json`, a JSON array of enabled packs with `{ id, label, owner }`, and loads images from `/static/minicraft/textures/{id}.png`. These historical filenames say `textures`; the UI calls them surfaces. The texture manager is linked from the settings view and is an HTML form, not a JSON API.

The manager uses a multipart form with `detail`, `label`, optional `owner`, and optional `file`. A signed-in account is required to submit. Creating a pack requires a PNG file; editing requires the pack owner or a server administrator, and the image can be omitted to retain the current one. Labels are limited to 30 characters. Uploaded images must be valid PNG files with dimensions exactly 16×416 pixels. Successful uploads are made available through the static image path and catalog. See [surfaces.md](surfaces.md) for the required atlas layout.

## Accounts and authorization

The account page is an HTML workflow, not a JSON login API. The client links to `/account?redir=minicraft`; after signing in, the browser returns to the game and can make authenticated requests. Registration/login are handled by the website's account page. Guest users can read public worlds and use chat; world creation, editing, deletion, and surface submissions require the appropriate signed-in permissions. Authorization is checked by the server, not by the client UI. API failures use HTTP status codes rather than structured JSON error objects.

## Brief implementation overview

The server keeps world metadata separately from each world's JSON snapshot. Snapshots are addressed by a content hash and served as static files; chat is a separate HTTP endpoint. This is enough context to understand the current API without depending on the website's internal service framework.

## Source pointers

- Client URL construction/sync: [`src/game/m_world_store.js`](../src/game/m_world_store.js), [`src/game/c_menu_start.js`](../src/game/c_menu_start.js), [`src/game/m_game.js`](../src/game/m_game.js), [`src/game/c_settings.js`](../src/game/c_settings.js), [`src/game/m_renderer.js`](../src/game/m_renderer.js), [`src/etc/env.js`](../src/etc/env.js).
