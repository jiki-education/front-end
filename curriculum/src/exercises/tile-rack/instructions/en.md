---
title: "Tile Rack"
description: "Find exactly where a letter sits on the tile rack."
---

You're building an automated Scrabble bot. The bot has a rack of letter tiles represented as a string (e.g. `"AERHBT"`). When the bot decides which letter to play, it needs to know which position to move its hand to in order to pick up the tile.

Write a function called `findTile` that takes the rack (a string of letters) and the letter to find. If the tile is found, return `"Move to position X"` where X is the position of the first matching tile (starting from 0). If the tile isn't in the rack, return `"Error: Tile not on rack"`.

To build the result string, you'll need to convert the position number to a string and concatenate the parts together.

Examples:

- `findTile("ABCDE", "A")` returns `"Move to position 0"`
- `findTile("ABCDE", "C")` returns `"Move to position 2"`
- `findTile("BANANA", "A")` returns `"Move to position 1"` (the first A)
- `findTile("ABCDE", "Z")` returns `"Error: Tile not on rack"`
