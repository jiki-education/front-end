---
title: "Scroll and Shoot"
description: "Scroll through Space Invaders and take out the aliens."
---

We're back with Space Invaders. Last time you only needed to move from left to right to shoot all the aliens down. But this time you need to also bounce the laser from left to right taking multiple passes to shoot the aliens down.

You can move the laser left and right using the `moveLeft()` and `moveRight()` functions. You can experiment to see how far left and right you can move. If you go off the edge of the screen, you lose.

As before, when you move, you need to check whether there's an alien above you using the `isAlienAbove()` function and then `shoot()` it if so. If you shoot when there's not an alien, you'll lose the game - wasting ammo is not allowed!

The laser cannon easily overheats. You need to move between shots to keep it cool.

The waves get busier as you go. In the final wave the aliens respawn, so there's no way to know in advance how many shots you'll need - your loop has to keep running until every alien is gone.

One rule in this exercise, to pass the final scenario, you cannot use a repeat loop with an input (ie you **can** use `repeat() { ... }` but you **can't** use `repeat(10) { ... }`).

Once all the aliens have been shot down, you win! Good luck!
