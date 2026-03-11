---
title: "Rainbow Ball"
description: ""
---

Create a bouncing rainbow ball that leaves a colorful trail!

A ball bounces around the canvas, changing direction when it hits the edges. As it moves, it draws circles that cycle through rainbow colors.

### How to solve it

- The canvas goes from `0,0` (top-left) to `100,100` (bottom-right).
- Create variables for the ball's position (`cx`, `cy`) and its direction (`xDirection`, `yDirection`).
- Create a variable for `hue` and `hueDirection` to cycle through colors.
- Use a repeat loop that runs 1000 times.
- In each iteration:
  1. Update `x` and `y` by adding the direction values
  2. Update `hue` by adding `hue_direction`
  3. Check if the ball has hit an edge and reverse direction with a random speed
  4. Check if the hue has gone below 0 or above 360 and reverse hue direction
  5. Draw a circle at the current position with a color from the hue

### Functions used in this exercise

- `circle(cx, cy, radius, color)` - Draw a circle with center at (x, y) with the given radius and color
- `hsl(hue, saturation, luminosity)` - Convert HSL values to a hex color string
- `randomNumber(min, max)` - Get a random integer between min and max (inclusive)
