# Surface images

“Surface” is the user-facing name for a block image set. The source code and hosted service still use the older `textures` identifiers and URL paths; those names are implementation details, not the preferred term in documentation.

## Image layout

The renderer expects a vertical strip of **26 square tiles**, each **16 × 16 pixels**: nominally a **16 × 416 PNG**. Tile order is defined by `TILE_*` constants in [`src/etc/textures.js`](../src/etc/textures.js). The first tile is row 0 at the top of the source image; subsequent tiles proceed downward:

| Tile | Surface |
| ---: | --- |
| 0 | Stone |
| 1 | Grass top |
| 2 | Dirt |
| 3 | Cobblestone |
| 4 | Planks |
| 5 | Bedrock |
| 6 | Log side |
| 7 | Leaves |
| 8 | Bricks |
| 9 | Wool |
| 10 | Sand |
| 11 | Gravel |
| 12 | Glass |
| 13 | Bookshelf |
| 14 | Obsidian |
| 15 | Stone bricks |
| 16 | Sandstone |
| 17 | Lapis block |
| 18 | Iron block |
| 19 | Gold block |
| 20 | Diamond block |
| 21 | Emerald block |
| 22 | Redstone block |
| 23 | Quartz block |
| 24 | Grass side |
| 25 | Log top |

These are **tile indices**, not block IDs: the renderer starts from block ID minus one. It chooses the grass-side tile for vertical grass faces, dirt for the underside of grass, and the log-top tile for log end faces. Bookshelf end faces use the planks tile. Transparent image pixels are meaningful; the raycaster skips transparent texels rather than treating them as solid color. The renderer loads one image, crops it into the expected tile strip, and reads its pixels for drawing.

The same image is also used for inventory/HUD icons. Some less-common block icons are currently approximations; for example, the mirror uses a placeholder color and glass icon mapping in the stack UI.

## Browse and select surfaces in-game

Open **Settings → Surfaces…**. The settings UI fetches the surface catalog and presents each entry by label and owner. Selecting an entry changes the configured surface-set ID and loads that set's image; **Plain** disables surface images and uses the built-in block colors instead.

## Submit or upload a surface set

From the same surface picker, choose **Add surface**. The app opens the hosted surface manager at:

[`https://l3p3.de/svr/minicraft/textures.html`](https://l3p3.de/svr/minicraft/textures.html)

The manager is implemented in the companion `rtjscomp` server project at `public/svr/minicraft/textures.html`. It requires a signed-in account to submit. Creating a pack requires an image; editing an existing pack requires the account to own it or have administrator permission, and the image can be omitted to keep the current one. The submitted PNG must be valid and exactly **16 × 416 pixels**. The label is limited to 30 characters. Accepted images appear in the public catalog and are available at the static image URL. See [api.md](api.md#surface-catalog-and-uploads) for details.

In the client, the catalog is requested from `API_DATA + textures.json`, and an image for a selected ID is loaded from `API_DATA + textures/{id}.png`. These endpoint names remain `textures` in the implementation.

Relevant code: [`src/game/c_settings.js`](../src/game/c_settings.js) loads the catalog and exposes the Add surface link; [`src/game/m_renderer.js`](../src/game/m_renderer.js) loads and slices the image; [`src/etc/textures.js`](../src/etc/textures.js) defines tile order; and [`src/game/c_stack.js`](../src/game/c_stack.js) uses the image for inventory icons.
