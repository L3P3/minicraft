# Local storage and worlds

Local persistence has two layers: app configuration/world-list metadata in `localStorage`, and world content in IndexedDB when available (with a `localStorage` fallback).

## App configuration

`src/etc/state.js` reads the `minicraft.config` key during module initialization. It restores settings such as view distance, surface selection, resolution scaling, and the selected world, plus the local world listing. The `config_save` reducer serializes these fields back under the same key. Touch detection is runtime state and is not persisted.

`src/app.js` calls configuration save from its 200 ms interval and on page unload. Configuration saves are skipped when the config object has not changed.

## World metadata and chunks

World metadata is stored as JSON in `localStorage` at `minicraft.world.{id}:meta`. It includes the world format version, time and spawn point, and player state such as position/orientation, health, gamemode, and inventory. The local world list is separately kept in `minicraft.config`; it records names/IDs and local/remote modification timestamps.

Chunk keys use absolute chunk coordinates and vertical chunk index. With IndexedDB, database `minicraft` contains a `chunks` object store keyed by `[world, coords]`; each row stores the compressed chunk payload. Without IndexedDB, the fallback stores chunks as `minicraft.world.{id}:{coords}` localStorage entries. Metadata remains in localStorage in either mode.

The IndexedDB object store is created on first open. During that upgrade path, chunk entries from the old localStorage format are copied into IndexedDB and removed from localStorage. The code also requests persistent browser storage when that API is available.

## In-memory layout and encoding

Chunks are 16 blocks wide and 16 blocks deep, and each vertical layer is 16 blocks high; there are four such vertical layers (64 blocks total). `m_world.js` maintains a moving in-memory “superchunk” around the player, stores block IDs in `Uint8Array`, and uses a `Uint32Array` view for efficient chunk copying. Chunks load in distance order with a bounded queue during ordinary movement.

When saving, the game copies a chunk's block data into a reusable temporary byte buffer and compresses it with the local `src/etc/lz.js` implementation. On load, it decompresses the payload into the chunk buffer. An absent ground-level chunk is generated with a simple bedrock/stone/dirt/grass flat layer; higher absent chunks remain empty.

## When data is saved

Changing blocks marks chunks dirty. World metadata is serialized by `world_save`; dirty chunk payloads are written by `world_chunk_save`. Saves happen on explicit `/save`, when entering settings, when a game closes, and on page unload; changing the active superchunk can also trigger a save before its buffer is reused. The periodic 50 ms world tick advances time and marks the world dirty, but that timer alone does not write each chunk to storage.

On startup, `app.js` waits for IndexedDB initialization before mounting the app. See [`src/etc/storage.js`](../src/etc/storage.js), [`src/etc/state.js`](../src/etc/state.js), [`src/game/m_world.js`](../src/game/m_world.js), and [`src/app.js`](../src/app.js) for implementation details.
