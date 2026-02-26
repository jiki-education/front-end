---
title: "Space Invaders: Solve Basic"
description: ""
---

Welcome to your second exercise - Space Invaders! Over the coming weeks you're going to build a fully automated laser to shoot down the aliens. But for now, your job is just to shoot down all the aliens manually!

You have two functions:

- `move()` moves your laser cannon one position to the right
- `shoot()` fires the laser upwards

Look at where the aliens are, then write a sequence of `move()` and `shoot()` calls to destroy them all.

Be careful:

- If you shoot when there's no alien above you, you'll get an error (after all, wasting ammo is not allowed!)
- If you move off the right edge of the screen, you'll get an error.
