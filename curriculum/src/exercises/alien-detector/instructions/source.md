---
title: "Alien Detector"
description: ""
---

In the previous Space Invaders exercise you moved your laser from side to side to shoot down all the aliens. A big part of what made that possible was the `isAlienAbove()` function. In this exercise, we've removed it, but you still need to shoot down all the aliens!

This exercise is designed to be a challenge! Take it slowly.

### Your Tasks

You have two tasks:

1. Shoot down all the aliens. Rather than being able to ask the exercise if there's an alien above you, you need to track which aliens you've shot down, and which are still there.
2. When you've shot them all down, you should immediately use `fireFireworks()`. This **must** happen in the same loop iteration as shooting the final alien.

I highly recommend completing the first task before starting the second. The first few scenarios can be passed without the fireworks firing!

### Meet `getStartingAliensInRow(idx)`

You have a new function called `getStartingAliensInRow(idx)`. It takes one input — the index of the row, starting from the bottom. There are a maximum of three rows, so the input value can be `1`, `2`, or `3`.

The function returns a list of 11 booleans. Each boolean specifies whether there is an alien in that position at the **start** of the exercise. So `[true, false, false, ...]` would mean that, before you do anything, there is an alien in the first position, but not in the next two (etc).

### Notes

- Every time you move left or right, you move one position forward or backwards. That position equates to the places the aliens can be.
- The aliens do not respawn in this exercise.
