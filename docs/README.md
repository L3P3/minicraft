# Developer documentation

These guides describe the implementation in this repository. The GitHub wiki was not accessible when these pages were prepared, so this documentation lives alongside the source.

- [Architecture](architecture.md) — runtime graph and responsibilities of its major nodes.
- [lui](lui.md) — the UI component, node, and hook model used by the app.
- [Remote API](api.md) — observed HTTP endpoints, synchronization, and known server-side unknowns.
- [Storage](storage.md) — local configuration, world metadata, chunk data, and save timing.
- [Terminal commands](commands.md) — in-game commands and parser details.
- [Build and run](build.md) — local preview, build commands, and generated variants.
- [Raycaster](raycaster.md) — CPU pixel renderer, voxel traversal, surface sampling, and tradeoffs.
- [Surfaces](surfaces.md) — surface atlas dimensions, tile order, and where to browse or submit surface sets.
- [Design](design.md) — source layout, coding patterns, legacy support, and project limitations.
