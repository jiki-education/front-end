---
title: "Alien Detector"
description: "Move your laser from left to right and shoot the aliens."
---

In the previous Space Invaders exercise you moved your laser from side to side to shoot down all the aliens. A big part of what made that possible was the <define>`isAlienAbove()`</define> function. In this exercise, we've removed it, but you still need to shoot down all the aliens!

We've given you a blank canvas to start from. Feel free to reuse your code from the <a href="/lesson/scroll-and-shoot" target="_blank" rel="noopener noreferrer">previous Space Invaders exercise</a> as a starting point.

This exercise is designed to be a challenge! Take it slowly.

### Your Task

Shoot down all the aliens. Rather than being able to ask the exercise if there's an alien above you, you need to track which aliens you've shot down, and which are still there.

### Meet <define>`getStartingAliensInRow(idx)`</define>

You have a new function called `getStartingAliensInRow(idx)`. It takes one input: the index of the row, starting from the bottom. There are a maximum of three rows, so the input value can be `0`, `1`, or `2`.

The function returns a list of 11 booleans. Each boolean specifies whether there is an alien in that position at the **start** of the exercise. So `[true, false, false, ...]` would mean that, before you do anything, there is an alien in the first position, but not in the next two (etc).

This function only returns the **initial** positions of the aliens. It does **not** update as you shoot them down!

### Notes

- Every time you move left or right, you move one position forward or backwards. That position equates to the places the aliens can be.
- The aliens do not respawn in this exercise.
