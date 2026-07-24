---
title: "Tile Search"
description: "Search through a rack of tiles to find a specific letter."
---

You're building a Scrabble bot. Before the bot tries to play a word, it needs to check whether it has a specific letter tile in its rack.

The rack is represented as a list of single-letter strings (e.g. `["S", "C", "R", "A", "B"]`).

Write a function called <define>`contains`</define> that takes two inputs:

- <define>`haystack`</define>: the list of tiles in the rack
- <define>`needle`</define>: the letter to search for

Return `true` if the letter is in the rack, or `false` if it isn't.

Examples:

- `contains(["S", "C", "R", "A", "B"], "A")` returns `true`
- `contains(["S", "C", "R", "A", "B"], "Z")` returns `false`
- `contains([], "A")` returns `false`
