# How the raycaster works

The renderer is in [`src/game/m_renderer.js`](../src/game/m_renderer.js). It uses a 2D canvas and CPU pixel calculations, not WebGL. `renderer_create` obtains a 2D context and allocates an `ImageData` surface; `renderer_render` fills its pixel buffer and submits it with `putImageData`.

## From screen pixel to world block

1. The camera's position, horizontal/vertical angles, view angle, output resolution, and view distance are read from the game and config.
2. For each output row and pixel (or pixel group), the code derives a view direction from pixel coordinates and field of view, then normalizes it.
3. A 3D grid traversal tracks the distance to the next x, y, and z block boundary. It advances along whichever boundary is nearest, checks that voxel, and stops at a solid hit, vertical world boundary, or configured view distance. This is a DDA-style ray march.
4. A hit can update the player's center-screen block focus, which is how input knows which block to mine or place.
5. The renderer selects a color from a surface atlas or fallback block-color table, applies face-dependent shading and optional dimming, then writes the packed pixel value into the image buffer.

The block data is read directly from `m_world.js`'s typed-array-backed voxel buffer. Horizontal coordinates wrap with a bit mask; vertical coordinates stop at the configured world height.

## Surfaces, glass, and mirrors

Surface images are loaded from the configured static-data endpoint. The renderer copies the atlas into a `Uint32Array`; face orientation selects the appropriate block tile, and transparent texels allow the ray to continue. If “clear glass” is enabled, glass can be passed through using a checkerboard pixel pattern. Mirror blocks reflect the ray by reversing its component along the hit face's axis; this is a compact single-ray approximation, not a general reflection or lighting system. See [surfaces.md](surfaces.md) for image dimensions and tile ordering.

If surfaces are unavailable/disabled, `BLOCK_COLORS` supplies a flat color per block type. Shading is inexpensive: different faces receive fixed factors, the focused block is highlighted, and optional block dimming scales by the world-time sky brightness. Dynamic lighting is listed as unfinished in the README.

## Performance tradeoffs

The renderer exposes resolution scaling and pixel grouping. Lower render resolution reduces the number of rays, and grouping can reuse a color across neighboring pixels. The canvas is then displayed at a larger CSS size with pixelated image rendering. The output surface is refreshed when the game is unpaused or explicitly marked dirty, rather than blindly repainting a paused unchanged frame.

The algorithm trades GPU acceleration for explicit, inspectable JavaScript traversal. Its cost depends on output pixels, view distance, and how many empty/transparent voxels each ray crosses. See [design.md](design.md) for code conventions and [architecture.md](architecture.md) for the frame/update path.
