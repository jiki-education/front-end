---
title: "Space Invaders: Conditional"
description: "Only shoot when there's an alien in your sights."
---

The aliens have changed their formation! They're now arranged in two rows, but not every column has an alien.

You have three functions:

- `move()` moves your laser cannon one position to the right
- `shoot()` fires the laser upwards
- `isAlienAbove()` returns `true` if there's an alien above you, or `false` if not

You need to move across the screen, checking each position. If there's an alien above you, shoot it! If not, just move on.

**Don't shoot when there's no alien above you, or you lose!**
