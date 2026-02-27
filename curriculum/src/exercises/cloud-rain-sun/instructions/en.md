---
title: "Cloud, Rain & Sun"
description: ""
---

This exercise combines the `rectangle`, `circle`, and `ellipse` functions to create a weather scene.

### Drawing Ellipses

To draw ellipses, we use the `ellipse` function with 5 inputs:

- `cx`: The x position of the center
- `cy`: The y position of the center
- `rx`: The horizontal radius (how wide)
- `ry`: The vertical radius (how tall)
- `color`: The color (e.g. `"blue"`)

An ellipse is like a stretched circle. When `rx` and `ry` are different, you get an oval shape.

### Quick Reminder

- `rectangle(left, top, width, height, color)` — draws a rectangle
- `circle(cx, cy, radius, color)` — draws a circle
- `ellipse(cx, cy, rx, ry, color)` — draws an ellipse

## Instructions

Create a weather scene with a sky, a sun, a cloud, and some rain drops.

We've given you the main body of the cloud (a `"white"` rectangle). You need to add:

1. A `"skyblue"` background
2. A `"yellow"` sun
3. `"white"` circles to round out the cloud
4. `"blue"` ellipse-shaped rain drops

The top-left of the drawing canvas is `0,0`. The bottom-right is `100,100`.
