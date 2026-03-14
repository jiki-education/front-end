---
title: "Rainbow Splodges"
description: ""
---

Your task is to create a canvas full of colorful rainbow splodges!

Draw **500 circles** at random positions with random colors.

### How to solve it

- The canvas goes from `0,0` (top-left) to `100,100` (bottom-right).
- Create variables for `cx`, `cy`, and `hue` before the loop.
- Use a repeat loop that runs 500 times.
- In each iteration:
  1. Change `x` to a random position between 0 and 100
  2. Change `y` to a random position between 0 and 100
  3. Change `hue` to a random value between 0 and 360
  4. Draw a circle at that position with radius 3 and a color generated from the hue
