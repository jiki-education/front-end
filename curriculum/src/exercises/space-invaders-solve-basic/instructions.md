---
title: "Space Invaders"
description: "Shoot down some aliens in your first taste of Space Invaders."
---

Welcome to your second exercise - Space Invaders! This is a classic 1970s arcade game, and one of the first I ever played. Over the coming weeks you're going to build a fully automated laser to shoot down the aliens. But for now, your job is just to shoot down all the aliens manually!

You have two <define>functions</define>:

- <define>`move()`</define> moves your laser cannon one position to the right
- <define>`shoot()`</define> fires the laser upwards

We've put the first `move()` in place for you. **Look at where the aliens are**, then write a sequence of `move()` and `shoot()` calls to destroy them all.

Be careful:

- If you shoot when there's no alien above you, you'll get an <define>error</define> (after all, wasting ammo is not allowed!)
- If you move off the right edge of the screen, you'll get an error.

Have fun!
