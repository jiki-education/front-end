---
title: "Emoji Collector"
description: ""
---

Previously, you checked for words when you looked around. But now we've upgraded the mazes to use emojis! So you need to update your code to handle these:

- `"star"` (Where you start)
- `"flag"` (Where you're trying to get to)
- `"white square"` (An empty space you can move into)
- `"fire"` (Careful!)
- `"poop"` (Ewww)
- `"brick"` (A wall)

We've also scattered some extra emojis around the mazes for you to pick up. Each time your character finds an emoji that's not in the list above, it should add it to its tally.

To help we've added:

- A new direction you can look (`"down"`!). This tells you what's in the current square.
- A new function `removeEmoji()` that removes whatever emoji is on the current square from the board. Don't try and pick up a special emoji from above!

Once you move into the finishing square, you should use the `announceEmojis(result)` function, passing a dictionary representing the amount of emojis you've collected.

This would be a good time to use the `hasKey()` function!
