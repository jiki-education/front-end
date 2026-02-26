---
title: "Rainbow Splodges"
description: ""
---

Your task is to create a canvas full of colorful rainbow splodges!

Draw **500 circles** at random positions with random colors.

### How to solve it

- The canvas goes from `0,0` (top-left) to `100,100` (bottom-right).
- Create variables for `x`, `y`, and `hue` before the loop.
- Use a repeat loop that runs 500 times.
- In each iteration:
  1. Change `x` to a random position between 0 and 100
  2. Change `y` to a random position between 0 and 100
  3. Change `hue` to a random value between 0 and 360
  4. Draw a circle at that position with radius 3 and a color generated from the hue

### Functions used in this exercise

- `circle(x, y, radius, color)` - Draw a circle with center at (x, y) with the given radius and color
- `hsl(hue, saturation, luminosity)` - Convert HSL values to a hex color string
- `randomNumber(min, max)` - Get a random integer between min and max (inclusive)
