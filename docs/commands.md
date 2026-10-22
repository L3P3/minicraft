# In-game terminal commands

Open the in-game terminal with **T**, type a command, and press **Enter**. Commands beginning with `/` are local commands; other input is displayed as chat and sent through the chat endpoint. See `game_message_send` in [`src/game/m_game.js`](../src/game/m_game.js) for the authoritative parser.

## Everyday commands

| Command | Behavior |
| --- | --- |
| `/help` | Prints the basic command list. |
| `/clear` | Clears the local message history. |
| `/clearinv` | Clears all inventory slots. |
| `/gamemode <0\|1\|2>` or `/gm <n>` | Sets gamemode: 0 survival, 1 creative, 2 spectator. |
| `/give <block-id-or-name> [amount]` | Adds blocks to inventory. Names are from `ITEM_HANDLES` in `src/etc/constants.js`; IDs are the corresponding numeric block types. |
| `/load` | Loads all chunks in the current in-memory world window. |
| `/save` | Saves world and player data if the world is writable and not busy. |
| `/spawn` | Sets the world spawn to the player's current position. |
| `/teleport` or `/tp` | Without coordinates, returns to spawn; with three coordinates, teleports to them. |
| `/time set <value>` | Sets world time. `day` and `night` are accepted aliases; numeric values wrap around a 24,000-tick day. |
| `/time add <value>` | Adds ticks to the current world time. |
| `/view_distance <blocks>` or `/vd <blocks>` | Sets the non-negative view distance. |
| `/version` | Prints the game version. |
| `/me <text>` | Sends a chat-style action message under the local player name. |

Teleport coordinates can use `~` for a relative offset, for example `/tp ~2 ~ ~-1`. The parser treats an invalid coordinate as the current coordinate.

## Selection and utility commands

The commands below are entered with **two leading slashes**. The terminal strips the first slash before dispatch, so `//wand` becomes the `/wand` case in the switch.

| Command | Behavior |
| --- | --- |
| `//wand` | Switches mouse actions into block-selection mode. |
| `//pos1`, `//pos2` | Sets the primary or secondary selection point to the player's floored position. |
| `//show` | Displays the two selection points. |
| `//expand vert` | Expands a valid selection to the full world height. Other expansion directions are not supported. |
| `//regen` | Deletes and reloads the current focus chunk; requires a writable, idle world. |
| `//exit` | Returns the mouse mode to normal. |

`/help` does not list these selection commands. The selection commands are groundwork for world editing, not a general-purpose editor; the README still lists world edit as unfinished.

## Internal window command

`/_w m` opens another game window; `/_w` with another or no argument opens an empty window. This is an internal utility rather than a documented player feature.

## Parsing details

The parser splits on literal spaces, accepts aliases shown above, and emits an “unknown command” message for unrecognized names. Block IDs and amount values must be positive integers in range. Commands which modify chunks or world metadata check writable/busy state where applicable; not every command has the same permission gate.
